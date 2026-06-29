-- Q-Rate Lite: Supabase Authentication Setup Script
-- Last updated: 2026-06-29
--
-- ARCHITECTURE NOTE (IMPORTANT):
-- Cafe tenant creation is now handled exclusively by the FastAPI backend
-- via POST /api/auth/sync. The Supabase trigger approach has been retired
-- for the following reasons:
--
--   1. It was broken in local development (Supabase creates records in its
--      own PostgreSQL; the backend was talking to a local SQLite).
--   2. It bypassed all backend domain logic (audit logs, slug generation,
--      trial setup, welcome emails, etc.).
--   3. It created two competing sources of truth for Cafe records.
--
-- HOW TO MIGRATE (one-time):
--   1. Run the DROP TRIGGER and DROP FUNCTION statements below to remove
--      the old trigger from your Supabase project.
--   2. Ensure your frontend calls POST /api/auth/sync after every
--      successful Supabase Auth signup or login.

-- ==========================================================================
-- 1. Remove the old trigger-based user provisioning
-- ==========================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Replace the function with a no-op stub so any accidental re-run of older
-- migration scripts doesn't recreate the trigger silently.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- DEPRECATED: Cafe creation is now handled by POST /api/auth/sync.
  -- This function intentionally does nothing.
  RAISE LOG 'handle_new_user trigger called but is a no-op. Use POST /api/auth/sync instead.';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================================================
-- 2. Schema: ensure all required columns and indexes exist
-- ==========================================================================

-- auth_id column on cafes (needed for Supabase Auth <-> backend mapping)
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS auth_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS ix_cafes_auth_id ON public.cafes (auth_id);

-- onboarding_completed flag
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- contact_messages table (landing page contact form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    company     TEXT,
    phone       TEXT,
    message     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'unread',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS ix_contact_messages_id ON public.contact_messages (id);

-- processed_webhooks table (WhatsApp message deduplication)
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
    message_id  TEXT PRIMARY KEY,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS ix_processed_webhooks_message_id ON public.processed_webhooks (message_id);

-- audit_logs table (if not created by SQLAlchemy migration)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id             SERIAL PRIMARY KEY,
    actor          TEXT NOT NULL,
    action         TEXT NOT NULL,
    target_cafe_id INTEGER,
    details        TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS ix_audit_logs_target_cafe_id ON public.audit_logs (target_cafe_id);

-- ==========================================================================
-- 3. Enable Row Level Security (RLS) on all tables
-- The frontend uses only the anon key, so RLS prevents direct DB access.
-- The FastAPI backend connects with the service role key and bypasses RLS.
-- ==========================================================================
ALTER TABLE public.cafes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_webhooks  ENABLE ROW LEVEL SECURITY;
