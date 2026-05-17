import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpmagqetpsesrxmehane.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbWFncWV0cHNlc3J4bWVoYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzEwOTEsImV4cCI6MjA5MzUwNzA5MX0.sP6Ek6IdWVK83tdWeGo0LYdadChYwPw111J4tISbLLs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SHA-256 hashovaná univerzální hesla → role
// Hesla: 'Wb3x9Kp' (Obchodní zástupce), 'Rv5mT2n' (Vývojář), 'Sm8vK4x' (Správce)
const MASTER_PASSWORD_HASHES: Record<string, string> = {
  'd4f3ea7996fa7c8cfc0ee0f7a3e5f40a251b35fecd577b22ff54df860e8d496c': 'Obchodní zástupce',
  '38ac96b66b940a91ea3f7aee0ceea1d69325b5bfbe52deddf5f304ff9bad7b32': 'Vývojář',
  '8709390823cf947718bb38ea7355b84965b1f4917095905ea47e07582a75a567': 'Správce',
};

export const SUFFIX_LENGTH = 2;

export async function verifyMasterPassword(password: string): Promise<string | null> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return MASTER_PASSWORD_HASHES[hashHex] ?? null;
}

export function getRoleByMasterPassword(password: string): string | null {
  return MASTER_PASSWORD_HASHES[password] ?? null;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}