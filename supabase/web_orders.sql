-- Tabulka pro objednávky webů

CREATE TABLE IF NOT EXISTS web_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_phone TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_address TEXT NOT NULL,
  industry TEXT NOT NULL,
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  domain TEXT NOT NULL,
  description TEXT NOT NULL,
  advantage TEXT NOT NULL,
  price_list TEXT,
  working_hours TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'čeká' CHECK (status IN ('čeká', 'vývoj', 'dokončená')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  primary_color TEXT,
  secondary_color TEXT,
  language TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_web_orders_status ON web_orders(status);
CREATE INDEX IF NOT EXISTS idx_web_orders_company_name ON web_orders(company_name);
CREATE INDEX IF NOT EXISTS idx_web_orders_created_at ON web_orders(created_at DESC);

-- Komentáře
COMMENT ON TABLE web_orders IS 'Objednávky webů z formuláře /orders';
COMMENT ON COLUMN web_orders.status IS 'Status objednávky: čeká, vývoj, dokončená';
COMMENT ON COLUMN web_orders.images IS 'Pole URL nahraných obrázků';
