-- Reset orders table - drop existing tables and create new clean one

-- Drop existing tables
DROP TABLE IF EXISTS web_orders CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create new clean orders table with correct structure
CREATE TABLE orders (
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
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_company_name ON orders(company_name);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_deleted_at ON orders(deleted_at);

-- Add comments
COMMENT ON TABLE orders IS 'Objednávky webů z formuláře /orders';
COMMENT ON COLUMN orders.status IS 'Status objednávky: čeká, vývoj, dokončená';
COMMENT ON COLUMN orders.images IS 'Pole URL nahraných obrázků';
COMMENT ON COLUMN orders.deleted_at IS 'Timestamp pro soft delete (null = nesmazáno, nastaveno = smazáno)';
