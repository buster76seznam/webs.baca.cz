-- Add preview_url and feedback_history to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS preview_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS feedback_history JSONB DEFAULT '[]'::jsonb;

-- Update status check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('draft', 'queued', 'development', 'completed', 'generated', 'preview_ready', 'revision_requested', 'approved', 'paid', 'active', 'failed_email'));
