# Q-Rate Lite

**Catch feedback before it hits Google.**

A "boring," reliable SaaS for independent cafés to collect private feedback and reward customers.

## Philosophy

- **WhatsApp-First**: Identity and communication via WhatsApp.
- **QR-First**: No staff involvement for feedback entry.
- **Reliable**: Simple flows, no overengineering.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Alembic, Supabase (Postgres).
- **Frontend**: React, Vite, Tailwind CSS, PWA.
- **Infra**: Monorepo.

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

- [Manual](docs/manual.md): Operational guide.
- [Technical Docs](docs/documentation.md): Architecture and patterns.
