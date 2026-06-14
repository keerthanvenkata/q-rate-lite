-- Q-Rate Lite: Supabase Authentication Setup Script
-- Run this script in the Supabase SQL Editor to automatically provision Cafe tenants when a user signs up.

-- 1. Create the function that will insert into the `cafes` table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  v_cafe_name text;
BEGIN
  -- Safely extract name from metadata or fallback
  v_cafe_name := 'My Cafe'; -- Default
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
      v_cafe_name := NEW.raw_user_meta_data->>'full_name';
    ELSIF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
      v_cafe_name := NEW.raw_user_meta_data->>'name';
    END IF;
  END IF;

  IF v_cafe_name = 'My Cafe' AND NEW.email IS NOT NULL THEN
    v_cafe_name := split_part(NEW.email, '@', 1);
  END IF;

  INSERT INTO public.cafes (
    slug, 
    name, 
    hashed_password, 
    auth_id,
    subscription_status, 
    plan_expiry, 
    marketing_credits
  )
  VALUES (
    'cafe-' || NEW.id::text,
    v_cafe_name,
    NULL,
    NEW.id::text,
    'trial',
    NOW() + INTERVAL '14 days',
    0
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If it fails, log the error but don't abort the user signup
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Schema Additions & Missing Tables
-- Add auth_id to cafes if it doesn't exist (added for Google OAuth)
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS auth_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS ix_cafes_auth_id ON public.cafes (auth_id);

-- Create contact_messages table (for landing page contact form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS ix_contact_messages_id ON public.contact_messages (id);

-- Create processed_webhooks table (for WhatsApp integration deduplication)
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
    message_id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS ix_processed_webhooks_message_id ON public.processed_webhooks (message_id);
