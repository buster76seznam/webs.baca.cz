CREATE INDEX idx_commissions_influencer_id ON commissions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_orders_ref_code ON orders(ref_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);