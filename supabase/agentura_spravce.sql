-- Spusťte v Supabase SQL Editoru (jednou), pokud ještě nemáte sloupec last_seen
-- a chcete povolit roli Správce v tabulce uživatelů.

ALTER TABLE agentura_users
  ADD COLUMN IF NOT EXISTS last_seen timestamptz;

-- Pokud máte CHECK na sloupci role, rozšiřte ho (příklad — upravte podle vašeho schématu):
-- ALTER TABLE agentura_users DROP CONSTRAINT IF EXISTS agentura_users_role_check;
-- ALTER TABLE agentura_users ADD CONSTRAINT agentura_users_role_check
--   CHECK (role IN ('Obchodní zástupce', 'Vývojář', 'Správce'));

COMMENT ON COLUMN agentura_users.last_seen IS 'Poslední aktivita v portálu (heartbeat každých 30 s)';
