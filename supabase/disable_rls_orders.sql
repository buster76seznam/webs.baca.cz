-- Disable RLS for orders table (for admin panel)
-- This allows the API routes to bypass RLS restrictions
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
