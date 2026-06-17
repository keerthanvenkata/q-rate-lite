# Q-Rate Lite: Mental Aligner & Notes

> [!IMPORTANT] > **READ THIS FIRST.**
> This document is the SINGLE SOURCE OF TRUTH for alignment.
> Refer to this before every conversation.
> Keep it CONCISE.

## Core Philosophy

- **Boring & Reliable**: No overengineering. No "just in case".
- **Speed & Correctness**: Ship it. It doesn't need to be elegant, it needs to work.
- **Monolith**: Single repo, single backend app, single frontend app.
- **WhatsApp-First**: Identity and communication via WhatsApp (direct Meta Cloud API).

## Architecture (Locked)

- **Repo**: Monorepo (`/backend`, `/frontend`, `/api`, `/supabase`).
- **Backend**: FastAPI + SQLAlchemy + Supabase (Postgres). Deployed as a single Vercel Serverless Function via `api/index.py`.
- **Frontend**: React 19 + Vite + Tailwind CSS v4. Deployed as Vercel static assets from `frontend/dist`.
- **Auth**: Supabase Auth (Google OAuth) for cafe owners. Custom scoped JWTs for customers. bcrypt passcode for staff coupon redemption.
- **Routes**:
  - `/feedback` (Customer feedback — token-gated, no account)
  - `/staff` (Staff coupon redemption — Supabase session)
  - `/sudo` (Owner dashboard — Supabase session)
  - `/superadmin` (Platform admin — Supabase session, email-gated)
  - `/marketing` (WhatsApp blast — Supabase session, active subscription)

## Invariants

- **Flow**: QR Scan → WhatsApp text "RateMyVisit {cafeId}" → JWT link sent via WhatsApp → Feedback submitted → Coupon issued → Staff redeems at counter.
- **Feedback Logic (Option 1)**:
  - 1-3 Stars: Private feedback + coupon issued.
  - 4-5 Stars: Same, plus redirect to Google Maps (if `google_maps_link` is set on the cafe).
  - **Invariant**: ALL valid feedback gets a coupon (one per customer per cafe, lifetime).
- **Idempotency**: Enforced at the DB level (`UniqueConstraint` on `cafe_id, customer_phone`) and with `SELECT ... FOR UPDATE` row locks.
- **Serverless Compatibility**: `NullPool` (no persistent connections). Sync DB calls in async endpoints wrapped in `run_in_threadpool`.
- **No Microservices**: Single FastAPI app, single Vercel function.

## Current State (Production)

- ✅ App is **LIVE** in production on Vercel.
- ✅ Supabase PostgreSQL connected. Tables provisioned via `supabase_setup.sql`.
- ✅ Meta WhatsApp Cloud API integrated and approved.
- ✅ Razorpay payment capture webhook live and signature-verified.
- ✅ Google OAuth (Supabase Auth) working. New signups auto-provision a `Cafe` row via SQL trigger `handle_new_user`.
- ✅ Supabase Edge Function `keep-alive` deployed (prevents free-tier DB pause).
- ⚠️ Razorpay `create-order` returns a dummy order ID — actual order creation is Phase 2.

## Router Map

| Prefix | File | Purpose |
|---|---|---|
| `/api/auth` | `routers/auth.py` | Generate & verify customer feedback JWT |
| `/api/feedback` | `routers/feedback.py` | Submit rating, issue coupon |
| `/api/coupon` | `routers/coupon.py` | Staff coupon redemption |
| `/api/admin` | `routers/admin.py` | Owner dashboard |
| `/api/superadmin` | `routers/superadmin.py` | Platform admin |
| `/api/billing` | `routers/billing.py` | Razorpay billing |
| `/api/whatsapp` | `routers/whatsapp.py` | Meta webhook + config |
| `/api/marketing` | `routers/marketing.py` | WhatsApp broadcast blast |
| `/api/contact` | `routers/contact.py` | Public contact form |
