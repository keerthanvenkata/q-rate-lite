# Database Architecture

The system uses **SQLite** for local development (via `test.db`) and **PostgreSQL** (hosted on Supabase) in production. Data modeling is handled exclusively by **SQLAlchemy ORM** (`backend/models.py`).

## Schema Definitions

All models inherit from a standard declarative `Base` (`backend/models.py`).

### 1. `Cafe` (Tenant)

The central entity of the application. One row = one cafe tenant.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | Auto-increment. |
| `slug` | VARCHAR UNIQUE | URL-safe identifier, e.g. `cafe-<supabase-uuid>`. Set by the signup trigger. |
| `name` | VARCHAR | Cafe display name. Set during onboarding. |
| `hashed_password` | VARCHAR | Staff passcode (bcrypt). Used for coupon redemption at the counter. |
| `auth_id` | VARCHAR UNIQUE | Supabase Auth user UUID. The primary link between the cafe tenant and the auth system. |
| `google_maps_link` | VARCHAR | Optional. If set, 4-5★ feedback submissions redirect customers here. |
| `reward_text` | VARCHAR | Coupon reward description. Default: `"10% off on your next visit"`. |
| `subscription_status` | VARCHAR | CHECK: `trial`, `active`, `cancelled`, `past_due`. Default: `trial`. |
| `subscription_plan` | VARCHAR | `monthly` or `annual`. Nullable. |
| `razorpay_customer_id` | VARCHAR | Razorpay customer reference. Nullable. |
| `plan_expiry` | DATETIME | UTC timestamp. Set to `+14 days` on trial signup, `+30/365 days` on payment capture. |
| `marketing_credits` | INTEGER | Prepaid credits for WhatsApp broadcast blasts. Default: `0`. |
| `onboarding_completed` | BOOLEAN | `False` until the owner completes the name-setting step post-signup. |

Relationships: `feedbacks` (one-to-many), `coupons` (one-to-many).

---

### 2. `Feedback`

Records a single customer rating instance.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | |
| `cafe_id` | FK → cafes.id | |
| `customer_phone` | VARCHAR | Normalized 10-digit Indian number. |
| `rating` | INTEGER | 1–5 stars. |
| `comment` | TEXT | Optional free-text comment. |
| `marketing_opt_in` | BOOLEAN | Customer consent for future broadcast messages. Default: `True`. |
| `created_at` | DATETIME | UTC. |

**Constraint**: `UniqueConstraint('cafe_id', 'customer_phone')` — a customer can only leave feedback for a specific cafe **once, lifetime**. Enforced both at the DB level and with a `SELECT ... FOR UPDATE` row lock in the submission flow to prevent race conditions.

---

### 3. `Coupon`

The digital reward issued automatically upon every valid feedback submission.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | |
| `cafe_id` | FK → cafes.id | |
| `code` | VARCHAR UNIQUE | 8-character hex string (4 random bytes). Globally unique. |
| `customer_phone` | VARCHAR | |
| `status` | VARCHAR | `issued`, `redeemed`, or `expired`. Default: `issued`. |
| `created_at` | DATETIME | UTC. |
| `redeemed_at` | DATETIME | UTC. Nullable; set when staff redeems. |

**Constraint**: `UniqueConstraint('cafe_id', 'customer_phone')` — one coupon issued per customer per cafe (mirrors the feedback constraint).

---

### 4. `AuditLog`

An immutable, append-only ledger for compliance and debugging.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | |
| `actor` | VARCHAR | Who triggered the action (e.g., `"razorpay_webhook"`, `"superadmin"`). |
| `action` | VARCHAR | What happened (e.g., `"SUBSCRIPTION_RENEWED"`, `"MARKETING_BLAST"`). |
| `target_cafe_id` | INTEGER | Nullable. The affected cafe. |
| `details` | TEXT | JSON dump of the relevant payload (e.g., exact Razorpay webhook body). |
| `created_at` | DATETIME | UTC. |

---

### 5. `ContactMessage`

Stores inquiries submitted through the public landing page contact form.

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | |
| `name` | TEXT | |
| `email` | TEXT | Validated via Pydantic `EmailStr`. |
| `company` | TEXT | Optional. |
| `phone` | TEXT | Optional. |
| `message` | TEXT | |
| `status` | TEXT | `unread`, `read`, or `archived`. Default: `unread`. |
| `created_at` | TIMESTAMP WITH TIME ZONE | UTC. |

---

### 6. `ProcessedWebhook`

A deduplication table for incoming WhatsApp webhook events.

| Column | Type | Notes |
|---|---|---|
| `message_id` | VARCHAR PK | The `messages[0].id` field from the Meta webhook payload. |
| `created_at` | TIMESTAMP WITH TIME ZONE | UTC. |

**Purpose**: Meta's WhatsApp Cloud API can deliver the same webhook event more than once. Before processing any inbound message, the backend attempts to `INSERT` the `message_id` here. If the insert fails with an `IntegrityError` (duplicate PK), the message is discarded as a replay. This guarantees exactly-once processing.

---

## Tenant Provisioning: The `handle_new_user` Trigger

When a user completes Google OAuth signup via Supabase Auth, a PostgreSQL trigger (`supabase_setup.sql`) automatically provisions a `cafes` row **before the user ever hits the application**.

**Trigger name**: `on_auth_user_created`
**Fires**: `AFTER INSERT ON auth.users`
**Function**: `handle_new_user()`

**What it does:**
1. Reads the new user's `id` and `raw_user_meta_data` from `auth.users`.
2. Creates a `cafes` row with:
   - `slug`: `cafe-<user_uuid>` (guaranteed unique)
   - `name`: extracted from `full_name` or `name` in OAuth metadata; falls back to the email prefix; final fallback is `"My Cafe"`
   - `auth_id`: the Supabase user UUID (the foreign key between auth and the app)
   - `subscription_status`: `trial`
   - `plan_expiry`: `NOW() + 14 days`
   - `marketing_credits`: `0`
   - `onboarding_completed`: `false`
3. **Error-safe**: The `EXCEPTION` block catches any failure and logs it, but does **not** abort the user signup. The user is always created even if tenant provisioning fails.

This means **zero manual onboarding step** is needed to create a tenant — signup is the trigger.

---

## Database Connection Management

`backend/database.py` uses environment-aware configuration:

- **SQLite (dev)**: Absolute path, `connect_args={"check_same_thread": False}`.
- **PostgreSQL (prod)**: Uses `NullPool`. This is a deliberate choice for serverless environments — it prevents stale persistent connections from accumulating across Vercel cold starts. A fresh connection is acquired and released on every request.

The `get_db()` generator yields a `SessionLocal` instance and closes it in the `finally` block, ensuring connections are always returned to the pool.
