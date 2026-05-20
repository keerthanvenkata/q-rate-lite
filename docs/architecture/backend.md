# Backend Architecture

The Q-Rate Lite backend is built on **FastAPI**. It favors a monolithic, synchronous design to minimize operational complexity and maintain strict compatibility with Vercel's serverless edge functions.

## Serverless Philosophy

The backend avoids heavy asynchronous database drivers (`asyncpg`) in favor of standard synchronous SQLAlchemy. This guarantees stability during edge function cold starts. Any endpoint requiring asynchronous external I/O (like `httpx` calls to the Meta Cloud API) uses `fastapi.concurrency.run_in_threadpool` to safely encapsulate synchronous database queries without blocking the event loop.

## Routing Topology (`backend/routers/`)

The application logic is heavily modularized into distinct FastAPI routers:

1. **`whatsapp.py`**: The core ingress point for the Meta Cloud API. It receives webhook payloads, parses inbound `wa.me` texts, generates short-lived customer JWTs, and fires automated service replies.
2. **`feedback.py`**: The customer-facing endpoint. Validates the JWT, logs the 1-5 star rating, and issues a 6-character coupon code.
3. **`coupon.py`**: The staff-facing endpoint. Validates the staff passcode and executes the redemption state change.
4. **`billing.py`**: Handles Razorpay checkout session generation and processes asynchronous `payment.captured` webhooks to automatically renew subscriptions.
5. **`auth.py`**: Handles local JWT generation for the temporary customer feedback flow.
6. **`admin.py` & `superadmin.py`**: Secure endpoints for retrieving tenant analytics and performing god-mode operations.
7. **`marketing.py`**: Processes bulk template dispatch logic against the Meta API.

## Entrypoint

`main.py` simply mounts all the routers under a unified `FastAPI` instance. During local development, the app runs via Uvicorn. In production, Vercel natively proxies incoming `/api/*` HTTP requests into the ASGI application interface.
