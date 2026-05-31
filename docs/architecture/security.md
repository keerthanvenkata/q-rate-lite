# Security & Compliance Architecture

Q-Rate Lite employs a multi-layered security model to protect tenant data, prevent API abuse, and ensure financial compliance.

## 1. Authentication Layers

The system uses two distinct authentication methodologies depending on the actor:

- **B2B Tenants (Café Owners)**: Authenticated via **Supabase Auth**. The frontend passes a secure, Supabase-signed JWT in the `Authorization: Bearer` header. The backend validates this token in `dependencies.py` via `python-jose` (using `SUPABASE_JWT_SECRET`) and extracts the `sub` to map it to the `Cafe` tenant record.
- **B2C End-Users (Customers)**: Because we want a frictionless flow, customers do not create accounts. Instead, when they trigger the WhatsApp webhook, the backend generates a short-lived, locally-signed JWT (using a separate `SECRET_KEY`) embedding their phone number and the `cafe_id`. This token is passed via the URL query string to the React PWA.
- **Super Admins**: Protected via a strictly enforced `SUPERADMIN_EMAIL` environment variable verified against the decoded Supabase JWT email claim.

## 2. Webhook Integrity (Hardened)

Because webhooks expose public URL endpoints, they are hardened using HMAC SHA-256 signature verification to prevent spoofing.

- **Meta Cloud API**: Inbound messages to `/api/whatsapp/webhook` must contain a valid `X-Hub-Signature-256` header. The payload is hashed against the `META_APP_SECRET` and compared securely using `hmac.compare_digest`.
- **Razorpay**: Inbound payment events to `/api/billing/webhook` must contain a valid `X-Razorpay-Signature` header, hashed against the `RAZORPAY_WEBHOOK_SECRET`. This prevents attackers from simulating successful payment events to steal Pro licenses.

## 3. Database Concurrency & Race Conditions

To prevent malicious users or faulty network retries from bypassing business logic, critical database mutations employ strict locking mechanisms:

- **Feedback Duplication**: Addressed via a hard `UniqueConstraint('cafe_id', 'customer_phone')` on the `Feedback` and `Coupon` tables. The endpoint explicitly catches `IntegrityError` to handle simultaneous submissions idempotently.
- **Coupon Double-Spend**: When a staff member redeems a coupon, the backend uses `with_for_update()` to place a row-level lock on the `Coupon` record. This ensures that if two identical requests arrive at the exact same millisecond, they are processed sequentially, and the second request is correctly rejected with a "Coupon already redeemed" error.

## 4. Multi-Tenant Isolation

All protected routes in `admin.py`, `billing.py`, and `marketing.py` depend on the `get_current_user` dependency. This function extracts the tenant ID directly from the cryptographically verified JWT, making it impossible for Cafe A to pass `?cafe_id=2` in a payload to view Cafe B's data.
