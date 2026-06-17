-- Row Level Security politika pro tabulku web_orders
-- Povolí anonymním uživatelům vkládat objednávky

-- Zapnutí RLS na tabulce
ALTER TABLE web_orders ENABLE ROW LEVEL SECURITY;

-- Odstranění existujících politik (pokud existují)
DROP POLICY IF EXISTS "Allow anonymous insert" ON web_orders;
DROP POLICY IF EXISTS "Allow anonymous select" ON web_orders;

-- Politika pro vkládání objednávek (anon users)
CREATE POLICY "Allow anonymous insert"
ON web_orders FOR INSERT
TO anon
WITH CHECK (true);

-- Politika pro čtení objednávek (anon users)
CREATE POLICY "Allow anonymous select"
ON web_orders FOR SELECT
TO anon
USING (true);
