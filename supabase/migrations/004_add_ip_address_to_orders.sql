-- Add ip_address column to orders table for rate limiting
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ip_address TEXT;
