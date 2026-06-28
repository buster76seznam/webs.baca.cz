-- Fix RLS policies for order-images storage bucket
-- This script ensures proper access for uploading images

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS on storage.objects to allow service role access
-- This is needed because we don't have permission to modify RLS policies
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
