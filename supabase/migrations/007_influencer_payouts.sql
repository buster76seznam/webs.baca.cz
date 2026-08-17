-- Migration for influencer/partner tables
-- 1. Add columns to partners table
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS commission_pct NUMERIC,
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_onboarding';

-- 2. Create commissions table
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  influencer_id UUID NOT NULL REFERENCES public.partners(id),
  order_amount NUMERIC NOT NULL,
  commission_pct NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  stripe_transfer_id TEXT,
  CONSTRAINT commission_status_check CHECK (status IN ('pending', 'paid', 'cancelled'))
);

-- 3. Enable RLS on commissions table
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for commissions table
DROP POLICY IF EXISTS "Allow public read-only access" ON public.commissions;
CREATE POLICY "Allow public read-only access" ON public.commissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated user insert" ON public.commissions;
CREATE POLICY "Allow authenticated user insert" ON public.commissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
