-- RLS politika pro tabulku orders pro admin panel

-- Zapnutí RLS na tabulce orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politika pro vkládání (anon users - pro veřejný formulář)
CREATE POLICY IF NOT EXISTS "Allow anonymous insert"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Politika pro čtení (authenticated users - pro admin panel)
CREATE POLICY IF NOT EXISTS "Allow authenticated select"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Politika pro aktualizaci (authenticated users - pro admin panel)
CREATE POLICY IF NOT EXISTS "Allow authenticated update"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Politika pro čtení (anon users - pro veřejný formulář)
CREATE POLICY IF NOT EXISTS "Allow anonymous select"
ON orders FOR SELECT
TO anon
USING (true);
