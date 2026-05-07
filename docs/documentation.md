# Q-Rate Lite: Technical Documentation

## Architecture

**Monolith**: Single repository containing `backend/` and `frontend/`.

- **Backend**: FastAPI app serving JSON APIs.
- **Frontend**: Single Page Application (React) served as a PWA.

## Data Models

- **Café**: The tenant.
- **Feedback**: A single submission from a customer.
- **Coupon**: A reward issued for feedback.

## Key Flows

1. **Feedback**: Scan `wa.me` QR -> Auto-Reply Webhook (Service Conversation) -> Feedback PWA -> Coupon Issued.
2. **Redemption**: Staff Page -> Enter Cafe Passcode -> Redeem Coupon.
3. **Super Admin**: Sudo Auth -> View Audit Logs & Manage Subscriptions.
4. **Marketing**: Cafe Owner Auth -> Broadcast Meta Approved Templates to Opted-in Users.

## Advanced Features
- **Vercel Serverless**: The FastAPI backend is deployed natively via `api/index.py` using Vercel's Serverless environment.
- **Audit Logs**: An immutable `audit_logs` table records all major system events (Super Admin overrides, Razorpay webhooks, Marketing blasts).
- **Direct Meta API**: The system bypasses BSPs completely and hooks directly into the Meta WhatsApp Cloud API for dispatching templates and receiving webhooks.

## Code Standards

- **Keep it Simple**: No abstract base classes unless absolutely necessary.
- **Explicit**: Better to repeat a line of code than create a complex dependency.
- **Monolith**: No microservices.
