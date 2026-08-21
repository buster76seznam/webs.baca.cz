-- Migration: Add feedback_history column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS feedback_history JSONB DEFAULT '[]'::jsonb;
