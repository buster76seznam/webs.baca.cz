-- Migrace pro správce hesla a zabezpečení

-- 1. Přidání sloupce pro hashované heslo správce
ALTER TABLE agentura_users
  ADD COLUMN IF NOT EXISTS password_hash text;

-- 2. Přidání sloupce pro last_seen (heartbeat)
ALTER TABLE agentura_users
  ADD COLUMN IF NOT EXISTS last_seen timestamptz;

-- 3. Vytvoření indexu pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_agentura_users_ip ON agentura_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_agentura_users_username ON agentura_users(username);

-- 4. Komentáře k novým sloupcům
COMMENT ON COLUMN agentura_users.password_hash IS 'SHA-256 hash hesla (master_password + koncovka)';
COMMENT ON COLUMN agentura_users.last_seen IS 'Poslední aktivita v portálu (heartbeat každých 30s)';