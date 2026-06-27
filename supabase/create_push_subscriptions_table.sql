-- Create table for storing push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription JSONB NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert subscriptions (for simplicity in this case)
CREATE POLICY "Anyone can insert subscriptions" ON push_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read subscriptions
CREATE POLICY "Anyone can read subscriptions" ON push_subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to update subscriptions
CREATE POLICY "Anyone can update subscriptions" ON push_subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Allow anyone to delete subscriptions
CREATE POLICY "Anyone can delete subscriptions" ON push_subscriptions
  FOR DELETE
  TO anon, authenticated
  USING (true);
