import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error('Service role key from env: NOT SET');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. This is required for admin operations.');
}

console.log('Using service role key: ...'); // Do not log the key itself

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SHA-256 hashovaná univerzální hesla → role
export const MASTER_PASSWORD_HASHES: Record<string, string> = {
  'd4f3ea7996fa7c8cfc0ee0f7a3e5f40a251b35fecd577b22ff54df860e8d496c': 'Obchodní zástupce',
  '38ac96b66b940a91ea3f7aee0ceea1d69325b5bfbe52deddf5f304ff9bad7b32': 'Vývojář',
  '8709390823cf947718bb38ea7355b84965b1f4917095905ea47e07582a75a567': 'Správce',
};

// Délka koncovky (2 znaky)
export const SUFFIX_LENGTH = 2;

export async function getRoleByMasterPassword(password: string): Promise<string | null> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return MASTER_PASSWORD_HASHES[hashHex] ?? null;
}
