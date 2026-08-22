-- Add payout tracking fields to partner_referrals
-- Run this in Supabase SQL Editor

ALTER TABLE partner_referrals ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE partner_referrals ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT;