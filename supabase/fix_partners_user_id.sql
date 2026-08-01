-- Fix partners table: make user_id nullable and drop FK constraint to auth.users
-- This allows registering partners without a Supabase Auth account (email-based registration)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tpmagqetpsesrxmehane/sql/new

-- Step 1: Drop the foreign key constraint (partners_user_id_fkey -> auth.users)
ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_user_id_fkey;

-- Step 2: Make user_id nullable
ALTER TABLE partners ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Enable RLS on partners if not already enabled
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Step 4: Add RLS policies for anon access (wrapped to avoid duplicate errors)
DO $$
BEGIN
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
