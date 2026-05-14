# Q-Rate Lite: Session Summary (Handoff)

This document summarizes the architectural decisions, code changes, and refactoring efforts completed in this session to assist the next agent taking over the project.

## 1. Architectural Decisions & Rules established (`AGENTS.md`)
*   **Boring Tech & Monolith Preference**: The project intentionally avoids over-engineering. It is designed as a tightly coupled, synchronous-first monolithic backend (FastAPI) and a React (Vite) frontend.
*   **Async/Sync Policy**: To avoid full `asyncpg` boilerplate, the application uses standard synchronous SQLAlchemy sessions. If a database call needs to happen inside an `async def` endpoint (e.g., due to `httpx` async calls to Meta APIs), the synchronous database calls **MUST** be wrapped in `fastapi.concurrency.run_in_threadpool`.
*   **Dual Theme Design System**: The UI utilizes two strictly separated design paradigms:
    *   **Marketing (Cinematic)**: Uses the `Aurora` (dark mode) and `Papyrus` (light mode) animated, hardware-accelerated layouts.
    *   **Dashboard (Ultra-Minimalist)**: Uses a pure white/black high-contrast "Vercel-like" UI for all app routes (`/feedback`, `/admin`, `/staff`, `/superadmin`).

## 2. Backend Scalability Optimizations
*   **Connection Pooling**: Updated `database.py` to include `pool_size`, `max_overflow`, `pool_timeout`, and `pool_recycle` when connecting to PostgreSQL. This is critical for serverless deployments.
*   **Database Indexing**: Updated `models.py` to add `index=True` to heavily queried foreign keys (e.g., `cafe_id`, `target_cafe_id`, `customer_phone`, `slug`).
*   **Event Loop Blocking Resolved**: Refactored major backend endpoints (`marketing.py`, `billing.py`, `superadmin.py`) to correctly use `run_in_threadpool` for DB operations, fixing critical event loop starvation issues.
*   **Transaction Safety**: Enforced atomic commits by wrapping `db.commit()` inside `try...except` blocks with a mandatory `db.rollback()` in the `except` clause across multiple routers.

## 3. Frontend UI Overhaul
*   **Utility Abstraction (`index.css`)**: Created an abstract set of utility classes for the Minimalist Dashboard theme (`.dashboard-bg`, `.dashboard-card`, `.dashboard-btn-primary`, `.dashboard-input`).
*   **Route Theming**: Refactored `AdminPage.tsx`, `SuperAdminPage.tsx`, `StaffPage.tsx`, `FeedbackPage.tsx`, and `MarketingPage.tsx` to completely remove old Tailwind color slates and apply the new high-contrast abstract `.dashboard-*` utilities.

## 4. Supabase Setup Automation & Deployment
*   **Raw SQL Generation**: Generated the initial DDL statements for the entire SQLAlchemy schema.
*   **Setup Script Location**: The raw SQL to instantly provision a new production database is located at `supabase/migrations/0000_init_schema.sql`.
*   **Deployment Guide**: Refined and updated `DEPLOY.md` to reflect the current deployment strategy (Vercel Frontend + Backend, Supabase DB via SQL execution rather than Alembic).

## Next Steps for New Agent
*   Verify the latest deployments to Vercel work flawlessly.
*   Follow the exact guidelines listed in `AGENTS.md` and `docs/design-system.md` for any further backend additions or frontend route expansions.
