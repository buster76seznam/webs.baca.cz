-- Migration script to add new columns to existing web_orders table
-- Run this in Supabase SQL Editor to update your database

-- Add new columns for design and social media
ALTER TABLE web_orders 
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS secondary_color TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Add comments for new columns
COMMENT ON COLUMN web_orders.primary_color IS 'Primary color for website design';
COMMENT ON COLUMN web_orders.secondary_color IS 'Secondary color for website design';
COMMENT ON COLUMN web_orders.language IS 'Website language code (e.g., cs, en, de)';
COMMENT ON COLUMN web_orders.facebook_url IS 'Facebook page URL';
COMMENT ON COLUMN web_orders.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN web_orders.google_maps_url IS 'Google Maps location URL';
