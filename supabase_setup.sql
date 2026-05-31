-- Q-Rate Lite: Supabase Authentication Setup Script
-- Run this script in the Supabase SQL Editor to automatically provision Cafe tenants when a user signs up.

-- 1. Create the function that will insert into the `cafes` table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  v_cafe_name text;
BEGIN
  -- Extract name from metadata if it exists, otherwise use email prefix or default
  v_cafe_name := COALESCE(
    NEW.raw_user_meta_data->>'name', 
    split_part(NEW.email, '@', 1),
    'My Cafe'
  );

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
    'cafe-' || NEW.id, -- temporary unique slug based on UUID
    v_cafe_name,
    NULL, -- No longer using legacy password
    NEW.id, -- Link to Supabase auth.users
    'trial',
    NOW() + INTERVAL '14 days',
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
