# Q-Rate Lite

**Catch feedback before it hits Google.**

A "boring," reliable SaaS for independent cafés to collect private feedback and reward customers.

## Philosophy

- **WhatsApp-First**: Identity and communication via WhatsApp.
- **QR-First**: No staff involvement for feedback entry.
- **Reliable**: Simple flows, no overengineering.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Alembic, Supabase (Postgres). Vercel Serverless entrypoint (`api/index.py`).
- **Frontend**: React, Vite, Tailwind CSS, PWA.
- **External APIs**: Direct Meta WhatsApp Cloud API, Razorpay Subscriptions.
- **Infra**: Vercel (Frontend & Backend), Supabase.

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation

See [docs/](docs/) for detailed guides.

### Architecture
- [System Overview](docs/architecture.md) — High-level topology, flows, and roles.
- [Backend](docs/architecture/backend.md) — FastAPI structure, serverless conventions, and router map.
- [Database](docs/architecture/database.md) — Schema, models, triggers, and connection management.
- [Frontend](docs/architecture/frontend.md) — React app structure and design systems.
- [Security](docs/architecture/security.md) — Auth layers, token lifecycle, and threat model.
- [API Reference](docs/architecture/api-reference.md) — All endpoints, request/response schemas, and error codes.

### Operations
- [Deployment Guide](docs/operations/deployment.md) — Step-by-step production setup.
- [Runbook](docs/operations/runbook.md) — Incident response, monitoring, and daily ops.
- [Keep-Alive Edge Function](docs/operations/keep-alive.md) — Supabase DB keep-alive cron setup.

### Design
- [Aurora Design](docs/design/aurora-design.md) — Dark-mode cinematic theme spec.
- [Papyrus Design](docs/design/papyrus-design.md) — Light-mode theme spec.
- [Minimalist Dashboard](docs/design/minimalist-design.md) — Dashboard UI spec.

### Legal
- [Compliance](docs/legal/compliance.md) — Privacy, WhatsApp policy, and legal checklist.
