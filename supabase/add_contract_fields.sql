-- Add contract fields to web_orders table

ALTER TABLE web_orders
  ADD COLUMN IF NOT EXISTS legal_business_name TEXT,
  ADD COLUMN IF NOT EXISTS state_of_incorporation TEXT,
  ADD COLUMN IF NOT EXISTS principal_place_of_business TEXT,
  ADD COLUMN IF NOT EXISTS authorized_signatory TEXT,
  ADD COLUMN IF NOT EXISTS contract_email TEXT;

-- Add comments
COMMENT ON COLUMN web_orders.legal_business_name IS 'Přesný právní název firmy včetně koncovky (např. LLC, Inc.)';
COMMENT ON COLUMN web_orders.state_of_incorporation IS 'Stát, kde je firma registrovaná';
COMMENT ON COLUMN web_orders.principal_place_of_business IS 'Kompletní oficiální adresa sídla firmy';
COMMENT ON COLUMN web_orders.authorized_signatory IS 'Jméno osoby s jednatelským oprávněním (majitel/CEO)';
COMMENT ON COLUMN web_orders.contract_email IS 'E-mail pro výzvy k podpisu a platbám';
