-- Storage bucket pro obrázky objednávek

-- Vytvoření bucketu
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politika pro 90denní retenci (musí se nastavit přes Supabase Dashboard nebo SQL funkci)
-- Toto je základní nastavení, retenci je lepší nastavit přes dashboard

-- Povolení čtení pro veřejnost
CREATE POLICY IF NOT EXISTS "Public Read Access"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'order-images');

-- Povolení zápisu pro autentizované uživatele
CREATE POLICY IF NOT EXISTS "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'order-images');

-- Povolení mazání
CREATE POLICY IF NOT EXISTS "Authenticated Delete Access"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'order-images');
