import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      const headers = new Headers();
      if (options?.headers) {
        const incomingHeaders = options.headers instanceof Headers 
          ? Object.fromEntries(options.headers.entries())
          : options.headers as Record<string, string>;

        const allowedHeaders = ['apikey', 'authorization', 'content-type', 'prefer', 'accept'];

        Object.entries(incomingHeaders).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          if (allowedHeaders.includes(lowerKey)) {
            // PŘÍSNĚ STANDARDNÍ ASCII HLAVIČKY
            headers.set(lowerKey, String(value));
          }
        });
      }
      return fetch(url, { ...options, headers });
    }
  }
});

// SHA-256 hashovaná univerzální hesla → role
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