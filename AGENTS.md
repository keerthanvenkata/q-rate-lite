# Q-Rate Lite: Agent Instructions & Conventions

This document contains rules, guidelines, and context for AI engineers and developers working on the Q-Rate Lite codebase. Read this before making structural or architectural changes.

## 1. Core Principles
* **Boring Tech is Good Tech:** We prefer simple, proven, synchronous workflows when possible. The system is designed to be tightly coupled and monolithic to minimize operational overhead.
* **Minimalist over Clever:** Avoid over-engineering. If a feature can be done without adding a new library or complex abstraction, do it that way.
* **Serverless Compatibility:** The entire system is built to run on Vercel's serverless edge and functions. State must be externalized to the database (Supabase PostgreSQL).

## 2. Backend Conventions (FastAPI)
### Synchronous Database Access vs. Async Endpoints
The application uses the traditional synchronous SQLAlchemy `Session` along with standard SQLite (for local dev) and PostgreSQL (for prod).

**Decision on AsyncSession:** 
We made a conscious architectural decision **NOT** to use SQLAlchemy's `AsyncSession` (`aiosqlite`/`asyncpg`). A full async migration requires heavy boilerplating and complicates the ORM usage for a project of this scale.
Instead, when an endpoint **must** be `async def` (e.g., waiting for external I/O like the WhatsApp API using `httpx`), any synchronous database calls within that endpoint **MUST** be wrapped in `fastapi.concurrency.run_in_threadpool`.

*   **Rule 1:** If an endpoint only does DB access, define it as standard `def route()`. FastAPI will automatically run it in a threadpool, protecting the event loop.
*   **Rule 2:** If an endpoint is `async def`, wrap `db.commit()`, `db.query()`, and any other blocking calls in `run_in_threadpool(my_sync_function, *args)`.

### Error Handling
*   Always wrap `db.commit()` in a `try...except` block.
*   Always execute `db.rollback()` in the `except` block to avoid polluted sessions.
*   Raise explicit `HTTPException`s after a rollback.

## 3. Frontend Conventions (React/Vite/Tailwind)
### Design Systems
The frontend leverages two distinct design systems based on context:

*   **Marketing (Aurora/Papyrus):** The `LandingPage` uses a cinematic, hardware-accelerated animated background. Do not let these global animations leak into the dashboard.
*   **Dashboard (Ultra-Minimalist):** All authenticated and interactive routes (`/feedback`, `/admin`, `/staff`, `/superadmin`) must use the "Vercel-style" dashboard UI. This implies:
    *   **Colors:** Pure white backgrounds (`bg-white`), pure black text (`text-black`), extremely subtle grey borders (`border-neutral-200`).
    *   **Accents:** A single, sharp accent color (e.g., pure black buttons, or a very subtle blue/indigo for primary actions) rather than heavy gradients.
    *   **Shadows:** Minimal, crisp shadows. No heavy blurs.
    *   **Structure:** High contrast, lots of whitespace, dense data presentation without clutter.

## 4. Git Workflow
*   **Atomic Commits:** Break down work into single-responsibility, logical subtasks and commit frequently.
*   **Clear Messages:** Use descriptive commit messages explaining *what* and *why*.
