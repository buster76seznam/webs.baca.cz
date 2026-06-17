-- Row Level Security politika pro tabulku web_orders
-- Povolí anonymním uživatelům vkládat objednávky

-- Zapnutí RLS na tabulce
ALTER TABLE web_orders ENABLE ROW LEVEL SECURITY;

-- Politika pro vkládání objednávek (anon users)
CREATE POLICY IF NOT EXISTS "Allow anonymous insert"
ON web_orders FOR INSERT
TO anon
WITH CHECK (true);

-- Politika pro čtení objednávek (anon users)
CREATE POLICY IF NOT EXISTS "Allow anonymous select"
ON web_orders FOR SELECT
TO anon
USING (true);
