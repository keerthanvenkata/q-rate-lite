-- 1. Add onboarding_completed
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Make hashed_password nullable (as intended for Supabase auth fallback)
ALTER TABLE public.cafes ALTER COLUMN hashed_password DROP NOT NULL;

-- 3. Add check constraint on subscription_status
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_status'
    ) THEN
        ALTER TABLE public.cafes 
        ADD CONSTRAINT check_valid_status 
        CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due'));
    END IF;
END $$;

-- 4. Add unique constraint to feedbacks
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uix_cafe_customer_feedback'
    ) THEN
        ALTER TABLE public.feedbacks 
        ADD CONSTRAINT uix_cafe_customer_feedback UNIQUE (cafe_id, customer_phone);
    END IF;
END $$;

-- 5. Add unique constraint to coupons
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uix_cafe_customer_coupon'
    ) THEN
        ALTER TABLE public.coupons 
        ADD CONSTRAINT uix_cafe_customer_coupon UNIQUE (cafe_id, customer_phone);
    END IF;
END $$;
