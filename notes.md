# Q-Rate Lite: Mental Aligner & Notes

> [!IMPORTANT] > **READ THIS FIRST.**
> This document is the SINGLE SOURCE OF TRUTH for alignment.
> Refer to this before every conversation.
> Keep it CONCISE.

## Core Philosophy

- **Boring & Reliable**: No overengineering. No "just in case".
- **Speed & Correctness**: Ship it. It doesn't need to be elegant, it needs to work.
- **Monolith**: Single repo, single backend app, single frontend app.
- **WhatsApp-First**: Identity and communication via WhatsApp (Gupshup).

## Architecture (Locked)

- **Repo**: Monorepo (`/backend`, `/frontend`).
- **Backend**: FastAPI + SQLAlchemy + Supabase (Postgres).
- **Frontend**: React + Vite (Single App).
- **Routes**:
  - `/` (Customer Feedback - PWA)
  - `/staff` (Staff Operations)
  - `/admin` (Owner/Manager)
  - `/sudo` (Internal/Founder - Killswitches, Global Analytics)

## Invariants

- **Flow**: QR Scan -> WhatsApp Identity -> Feedback -> Coupon -> Next Visit Redemption.
- **Feedback Logic (Option 1)**:
  - 0-3 Stars: Private feedback only.
  - 4-5 Stars: Auto-save, toast "Coupon added", and redirect to Google Maps (if link exists).
  - **Invariant**: ALL valid feedback gets a coupon.
  - **Notification**: WhatsApp message sent with coupon details (async).
- **Sudo Page**: Hardcoded access, zero polish, operational safety only.
- **No Microservices**: Keep it simple.

## Current State

- Backend initialized (FastAPI stub).
- Frontend initialized (React + Vite + Tailwind).
- Configuration files (`.env`, `.gitignore`) being set up.
