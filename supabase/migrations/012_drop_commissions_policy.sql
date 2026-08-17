DROP POLICY IF EXISTS "Allow public read-only access" ON public.commissions;
CREATE POLICY "Allow public read-only access" ON public.commissions FOR SELECT USING (true);