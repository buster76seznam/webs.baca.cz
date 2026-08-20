import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL and Service Role Key must be defined in environment variables for admin operations.');
}

const globalSupabaseConfig = {
  global: {
    fetch: (url: any, options: any) => {
      const headers = new Headers();
      
      // PŘÍSNĚ STANDARDNÍ ASCII HLAVIČKY PRO SUPABASE
      if (options?.headers) {
        const incomingHeaders = options.headers instanceof Headers 
          ? Object.fromEntries(options.headers.entries())
          : options.headers as Record<string, string>;

        const allowedHeaders = ['apikey', 'authorization', 'content-type', 'prefer', 'accept'];
        
        Object.entries(incomingHeaders).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          if (allowedHeaders.includes(lowerKey)) {
            headers.set(lowerKey, String(value));
          }
        });
      }
      return fetch(url, { ...options, headers });
    }
  }
};

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  ...globalSupabaseConfig
});
