-- Add status_updated_at column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ DEFAULT NOW();
