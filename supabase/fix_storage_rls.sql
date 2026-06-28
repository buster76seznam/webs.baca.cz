-- Fix RLS policies for order-images storage bucket
-- This script ensures proper access for uploading images

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for order-images bucket to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Service Role Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Service Role Delete Access" ON storage.objects;

-- Allow public read access to images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'order-images');

-- Allow public upload access to images (for the order form)
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'order-images');

-- Allow public delete access to images
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'order-images');

-- Allow service role full access (for backend API)
CREATE POLICY "Service Role Upload Access"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Service Role Delete Access"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'order-images');
