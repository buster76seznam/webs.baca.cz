-- RLS politika pro tabulku orders pro admin panel

-- Zapnutí RLS na tabulce orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Odstranění existujících politik (pokud existují)
DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
DROP POLICY IF EXISTS "Allow authenticated select" ON orders;
DROP POLICY IF EXISTS "Allow authenticated update" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select" ON orders;

-- Politika pro vkládání (anon users - pro veřejný formulář)
CREATE POLICY "Allow anonymous insert"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Politika pro čtení (authenticated users - pro admin panel)
CREATE POLICY "Allow authenticated select"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Politika pro aktualizaci (authenticated users - pro admin panel)
CREATE POLICY "Allow authenticated update"
ON orders FOR UPDATE
TO authenticated
USING (true);

-- Politika pro čtení (anon users - pro veřejný formulář)
CREATE POLICY "Allow anonymous select"
ON orders FOR SELECT
TO anon
USING (true);
