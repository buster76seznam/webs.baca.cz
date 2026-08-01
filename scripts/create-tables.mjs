import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://tpmagqetpsesrxmehane.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbWFncWV0cHNlc3J4bWVoYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzEwOTEsImV4cCI6MjA5MzUwNzA5MX0.sP6Ek6IdWVK83tdWeGo0LYdadChYwPw111J4tISbLLs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTablesExist() {
  console.log('Checking if tables exist...');
  
  const { data: partnersData, error: partnersError } = await supabase
    .from('partners')
    .select('*')
    .limit(1);

  if (partnersError) {
    console.log('partners table error:', partnersError.message);
    if (partnersError.message.includes('does not exist') || partnersError.code === '42P01') {
      console.log('Tables do NOT exist yet.');
      return false;
    }
  } else {
    console.log('partners table EXISTS');
  }

  const { data: clicksData, error: clicksError } = await supabase
    .from('partner_clicks')
    .select('*')
    .limit(1);
  
  if (clicksError) {
    console.log('partner_clicks table error:', clicksError.message);
  } else {
    console.log('partner_clicks table EXISTS');
  }

  const { data: referralsData, error: referralsError } = await supabase
    .from('partner_referrals')
    .select('*')
    .limit(1);
  
  if (referralsError) {
    console.log('partner_referrals table error:', referralsError.message);
  } else {
    console.log('partner_referrals table EXISTS');
  }
  
  return !partnersError;
}

async function tryCreateTablesViaRPC() {
  console.log('\nAttempting to create tables via Supabase RPC...');
  
  // Try creating each missing table via individual INSERT attempts to detect existence
  // Then try exec_sql RPC
  const statements = [
    `CREATE TABLE IF NOT EXISTS partner_clicks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      partner_id TEXT NOT NULL REFERENCES partners(partner_id),
      clicked_at TIMESTAMPTZ DEFAULT NOW(),
      ip_address TEXT,
      user_agent TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS partner_referrals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      partner_id TEXT NOT NULL REFERENCES partners(partner_id),
      client_email TEXT NOT NULL,
      client_name TEXT,
      amount NUMERIC DEFAULT 150,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `ALTER TABLE partner_clicks ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY "Allow anon insert clicks" ON partner_clicks FOR INSERT TO anon WITH CHECK (true)`,
    `CREATE POLICY "Allow anon read clicks" ON partner_clicks FOR SELECT TO anon USING (true)`,
    `CREATE POLICY "Allow anon insert referrals" ON partner_referrals FOR INSERT TO anon WITH CHECK (true)`,
    `CREATE POLICY "Allow anon read referrals" ON partner_referrals FOR SELECT TO anon USING (true)`,
  ];

  for (const sql of statements) {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.log('RPC exec_sql failed for statement:', error.message);
      console.log('Statement:', sql.substring(0, 60) + '...');
      return false;
    }
  }
  
  console.log('Tables created via RPC successfully');
  return true;
}

async function tryCreateTablesViaManagementAPI() {
  console.log('\nAttempting via Supabase Management API...');
  
  const statements = [
    `CREATE TABLE IF NOT EXISTS partner_clicks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), partner_id TEXT NOT NULL REFERENCES partners(partner_id), clicked_at TIMESTAMPTZ DEFAULT NOW(), ip_address TEXT, user_agent TEXT)`,
    `CREATE TABLE IF NOT EXISTS partner_referrals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), partner_id TEXT NOT NULL REFERENCES partners(partner_id), client_email TEXT NOT NULL, client_name TEXT, amount NUMERIC DEFAULT 150, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW())`,
    `ALTER TABLE partner_clicks ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY`,
  ];

  for (const sql of statements) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ query: sql }),
      }
    );
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Management API failed:', response.status, text.substring(0, 200));
      return false;
    }
  }
  
  console.log('Success via Management API');
  return true;
}

async function main() {
  console.log('=== Partner Tables Setup Script ===\n');
  
  const exists = await checkTablesExist();
  
  if (exists) {
    // Check remaining tables too
    const { error: c2 } = await supabase.from('partner_clicks').select('*').limit(1);
    const { error: r2 } = await supabase.from('partner_referrals').select('*').limit(1);
    if (!c2 && !r2) {
      console.log('\n✅ All tables already exist! No action needed.');
      return;
    }
    console.log('\nSome tables are missing, will try to create them...');
  }
  
  console.log('\nTables need to be created.');
  
  const rpcSuccess = await tryCreateTablesViaRPC();
  if (rpcSuccess) {
    console.log('\n✅ Tables created successfully via RPC!');
    return;
  }
  
  const mgmtSuccess = await tryCreateTablesViaManagementAPI();
  if (mgmtSuccess) {
    console.log('\n✅ Tables created successfully via Management API!');
    return;
  }
  
  console.log('\n❌ Could not auto-create tables.');
  console.log('Please create tables manually in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/tpmagqetpsesrxmehane/sql/new');
  console.log('\nSQL migration file is at: supabase/migrations/001_partners.sql');
}

main().catch(console.error);
