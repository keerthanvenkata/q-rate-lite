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

1. **Feedback**: Scan QR -> WhatsApp Auth (Stub/Gupshup) -> Feedback Form -> Coupon Issued.
2. **Redemption**: Staff Page -> Enter Coupon Code -> Mark Redeemed.

## Code Standards

- **Keep it Simple**: No abstract base classes unless absolutely necessary.
- **Explicit**: Better to repeat a line of code than create a complex dependency.
- **Monolith**: No microservices.
