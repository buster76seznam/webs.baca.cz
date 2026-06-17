-- Přidání nových sloupců do tabulky orders pro design a sociální sítě

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS secondary_color TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS owner_phone TEXT,
ADD COLUMN IF NOT EXISTS owner_email TEXT,
ADD COLUMN IF NOT EXISTS advantage TEXT,
ADD COLUMN IF NOT EXISTS price_list TEXT,
ADD COLUMN IF NOT EXISTS working_hours TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Komentáře
COMMENT ON COLUMN orders.primary_color IS 'Primary color for website design';
COMMENT ON COLUMN orders.secondary_color IS 'Secondary color for website design';
COMMENT ON COLUMN orders.language IS 'Website language code (e.g., cs, en, de)';
COMMENT ON COLUMN orders.facebook_url IS 'Facebook page URL';
COMMENT ON COLUMN orders.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN orders.google_maps_url IS 'Google Maps location URL';
COMMENT ON COLUMN orders.images IS 'Array of uploaded image URLs';
COMMENT ON COLUMN orders.owner_name IS 'Owner/Manager name';
COMMENT ON COLUMN orders.owner_phone IS 'Owner/Manager phone';
COMMENT ON COLUMN orders.owner_email IS 'Owner/Manager email';
COMMENT ON COLUMN orders.advantage IS 'Advantage over competition';
COMMENT ON COLUMN orders.price_list IS 'Price list information';
COMMENT ON COLUMN orders.working_hours IS 'Working hours';
COMMENT ON COLUMN orders.notes IS 'Admin notes for the order';
