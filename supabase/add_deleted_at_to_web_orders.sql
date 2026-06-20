-- Add deleted_at column to web_orders table for soft delete functionality

ALTER TABLE web_orders 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

COMMENT ON COLUMN web_orders.deleted_at IS 'Timestamp for soft delete (null = not deleted, set = deleted)';
