-- Partner Program Tables Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tpmagqetpsesrxmehane/sql/new

-- Step 1: Add missing columns to existing partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS social_links TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS verification_token TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Step 2: Create partner_clicks table (uses partners.id UUID as FK)
CREATE TABLE IF NOT EXISTS partner_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Step 3: Create partner_referrals table
CREATE TABLE IF NOT EXISTS partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  client_email TEXT NOT NULL,
  client_name TEXT,
  amount NUMERIC DEFAULT 3500,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE partner_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies (wrapped in DO block to avoid errors if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_clicks' AND policyname = 'Allow anon insert clicks') THEN
    CREATE POLICY "Allow anon insert clicks" ON partner_clicks FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_clicks' AND policyname = 'Allow anon read clicks') THEN
    CREATE POLICY "Allow anon read clicks" ON partner_clicks FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_referrals' AND policyname = 'Allow anon insert referrals') THEN
    CREATE POLICY "Allow anon insert referrals" ON partner_referrals FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_referrals' AND policyname = 'Allow anon read referrals') THEN
    CREATE POLICY "Allow anon read referrals" ON partner_referrals FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Allow anon insert partners') THEN
    CREATE POLICY "Allow anon insert partners" ON partners FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Allow anon read partners') THEN
    CREATE POLICY "Allow anon read partners" ON partners FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Allow anon update partners') THEN
    CREATE POLICY "Allow anon update partners" ON partners FOR UPDATE TO anon USING (true);
  END IF;
END $$;
