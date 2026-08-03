-- Přidání sloupce company_country do tabulky orders

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS company_country TEXT;

COMMENT ON COLUMN orders.company_country IS 'Kód země zákazníka (ISO 3166-1 alpha-2), např. CZ, SK, DE';
