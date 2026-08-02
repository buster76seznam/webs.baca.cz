-- Make user_id nullable so partners can register without a Supabase Auth account
ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_user_id_fkey;
ALTER TABLE partners ALTER COLUMN user_id DROP NOT NULL;
