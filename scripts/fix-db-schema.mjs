import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSchema() {
  console.log('🚀 Attempting to fix DB schema via exec_sql RPC...');
  
  const statements = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS preview_url TEXT;",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS feedback_history JSONB DEFAULT '[]'::jsonb;",
    "ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;",
    "ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('draft', 'queued', 'development', 'completed', 'generated', 'preview_ready', 'revision_requested', 'approved', 'paid', 'active', 'pending_domain', 'failed_email'));"
  ];

  for (const sql of statements) {
    console.log(`Executing: ${sql}`);
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.error(`❌ RPC exec_sql failed: ${error.message}`);
    } else {
      console.log('✅ Success');
    }
  }
  
  console.log('\nSchema fix attempt finished.');
}

fixSchema();
