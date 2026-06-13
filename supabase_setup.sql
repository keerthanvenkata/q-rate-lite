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
