-- Add referral_code to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS referral_code TEXT;
