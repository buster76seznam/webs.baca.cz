import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpmagqetpsesrxmehane.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbWFncWV0cHNlc3J4bWVoYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzEwOTEsImV4cCI6MjA5MzUwNzA5MX0.sP6Ek6IdWVK83tdWeGo0LYdadChYwPw111J4tISbLLs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Univerzální registrační hesla → role
export const MASTER_PASSWORDS: Record<string, string> = {
  'Wb3x9Kp': 'Obchodní zástupce',
  'Rv5mT2n': 'Vývojář',
};

// Délka koncovky (2 znaky)
export const SUFFIX_LENGTH = 2;

export function getRoleByMasterPassword(password: string): string | null {
  return MASTER_PASSWORDS[password] ?? null;
}
