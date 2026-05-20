# Database Architecture

The system uses **SQLite** for local development (via `test.db`) and **PostgreSQL** (hosted on Supabase) in production. Data modeling is handled exclusively by **SQLAlchemy ORM**.

## Schema Definitions

All models inherit from a standard declarative `Base` (`backend/models.py`).

### 1. `Cafe` (Tenant)
The central entity of the application.
- Stores basic identity (`name`, `slug`).
- Links to Supabase Auth (`auth_id`).
- Manages business logic configuration (`google_maps_link`, `reward_text`).
- Tracks subscription lifecycle (`subscription_status`, `subscription_plan`, `plan_expiry`, `razorpay_customer_id`).

### 2. `Feedback`
Records a single customer rating instance.
- **Foreign Key**: `cafe_id` -> `cafes.id`
- **Fields**: `customer_phone`, `rating` (1-5), `comment`, `marketing_opt_in`.
- **Constraint**: `UniqueConstraint('cafe_id', 'customer_phone')`. This enforces a lifetime strict idempotency rule—a customer can only leave feedback for a specific cafe *once*.

### 3. `Coupon`
The digital reward issued upon feedback submission.
- **Foreign Key**: `cafe_id` -> `cafes.id`
- **Fields**: `code` (unique 6-char string), `customer_phone`, `status` (issued, redeemed, expired).
- **Constraint**: `UniqueConstraint('cafe_id', 'customer_phone')`.

### 4. `AuditLog`
An immutable, append-only ledger.
- **Fields**: `actor`, `action`, `target_cafe_id`, `details` (JSON dump of changes).
- Designed for compliance and debugging (e.g., logging exact Razorpay webhook payloads or Super Admin subscription overrides).

### 5. `ContactMessage`
A simple table storing inquiries from the public landing page.

## Database Connection Management

`backend/database.py` utilizes environment-aware connection pooling. When connected to PostgreSQL, it enforces a `pool_size` of 20 and a `pool_recycle` of 1800 seconds to prevent connection exhaustion in serverless environments.
