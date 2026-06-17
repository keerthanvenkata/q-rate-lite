# Q-Rate Lite: System Architecture & Technical Documentation

Q-Rate Lite is designed as a "boring," ultra-reliable monolithic application. It eschews microservices in favor of a tightly coupled, highly maintainable frontend and backend that can be deployed entirely for free on serverless infrastructure.

## 1. High-Level Topology

The system is split into two primary layers, both hosted within the same Git repository (`c:\dev\q-rate-lite`).

*   **Frontend (SPA)**: A React Single Page Application built with Vite and Tailwind CSS. Features a dynamic unified branding system (Light/Dark Aurora modes) spanning both marketing sites and product dashboards.
*   **Backend (API)**: A Python FastAPI application providing RESTful JSON endpoints.
*   **Database**: PostgreSQL (hosted on Supabase), managed via SQLAlchemy ORM and Alembic migrations.

### Deployment Architecture
*   **Hosting**: Vercel
*   **Routing**: The `vercel.json` configuration routes all traffic hitting `/api/*` to the FastAPI serverless function (`api/index.py`), while all other traffic serves the compiled React static files.

## 2. Core Modules & Endpoints

The backend is modularized via FastAPI Routers:

| Router | Purpose | Key Integrations |
| :--- | :--- | :--- |
| `/whatsapp` | Listens to inbound Meta Webhooks. Parses incoming `wa.me` messages and dispatches automated template/text replies. | Meta Cloud API |
| `/auth` | Generates secure JWT session tokens embedding the customer's phone number and `cafe_id`. | `python-jose` (JWT) |
| `/contact` | Processes inbound public contact form submissions and stores them in the database. | N/A |
| `/feedback` | Validates JWT tokens, saves ratings/comments, and automatically issues unique 6-character alphanumeric coupons. | SQLAlchemy |
| `/coupon` | Used by cafe staff to verify coupon validity and mark them as "redeemed." | SQLAlchemy |
| `/admin` | Tenant dashboard. Returns real-time feedback aggregates (avg stars, total count) and recent customer comments. | |
| `/superadmin` | "God mode" dashboard. Lists all tenant cafes. Allows manual override of subscriptions. Logs all actions immutably. | `AuditLog` Model |
| `/marketing` | Broadcast engine. Calculates opted-in audience size and dispatches bulk Meta templates using prepaid credits. | Meta Cloud API |
| `/billing` | Handles Razorpay checkout sessions and listens for `payment.captured` webhooks to automatically renew subscriptions. | Razorpay API |

## 3. Data Models (Entity-Relationship)

- **Café**: The tenant. Contains configuration (e.g., `google_maps_link`, `reward_text`) and tracks billing.
- **Feedback**: Linked to a `Cafe`. Stores `customer_phone`, `rating`, `comment`, and `marketing_opt_in`. Constraint: One feedback submission per customer per cafe (lifetime).
- **Coupon**: Linked to a `Cafe`. Issued upon successful feedback. Has a `status` (`issued` or `redeemed`).
- **AuditLog**: A generic, append-only ledger tracking all high-level system actions (e.g., "Marketing Blast Sent", "Subscription Upgraded by Razorpay").

## 4. The WhatsApp State Machine (Inbound Flow)

1.  **Trigger**: User scans a physical QR code containing a deep link: `wa.me/91XXXXXXXXXX?text=RateMyVisit`.
2.  **Meta Webhook**: Meta POSTs the inbound message to `/whatsapp/webhook`.
3.  **Parsing**: The router intercepts the text. If it contains "Rate" or "Visit", it generates a JWT token for that phone number.
4.  **Auto-Reply**: The router calls Meta's `/messages` API to send a "Service Reply" (which is free) containing the secure `https://qrate-lite.vercel.app/feedback?token=XYZ` link.

## 5. User Roles & Access

The system enforces a strict 4-tier role hierarchy:
1. **Super Admin**: Bound by the `SUPERADMIN_EMAIL` environment variable. Grants god-mode access to view all tenants, override subscriptions, and view immutable audit logs.
2. **Admin (Café Owner/Manager)**: Authenticated via Supabase. Grants full access to a specific tenant's dashboard, including real-time analytics and customer feedback.
3. **Staff**: Restricted access to the staff page. Staff can only verify and redeem customer coupons.
4. **Customer**: Interacts solely via WhatsApp and the unauthenticated, token-secured feedback web page. No traditional accounts are created.

## 6. Security Principles

*   **Stateless Sessions**: The customer flow relies entirely on short-lived JWT tokens passed in the URL. No cookies or sessions are stored on the customer's device.
*   **Immutable Logging**: Every action taken by the system (Razorpay) or an admin (Super Admin overrides) is permanently recorded in the `AuditLog`.

## 7. Code Standards

- **Keep it Simple**: No abstract base classes unless absolutely necessary.
- **Explicit**: Better to repeat a line of code than create a complex dependency.
- **Monolith**: No microservices.

