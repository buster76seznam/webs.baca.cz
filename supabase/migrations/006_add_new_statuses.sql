ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check CHECK (status IN ('čeká', 'vývoj', 'dokončená', 'generated', 'preview_ready', 'paid', 'active'));
