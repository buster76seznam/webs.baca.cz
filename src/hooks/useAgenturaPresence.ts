'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/** Aktualizuje last_seen každých 30 s (sloupec volitelný — při chybě tichý fallback). */
export function useAgenturaPresence(userId: string) {
  useEffect(() => {
    const ping = async () => {
      const now = new Date().toISOString();
      await supabase.from('agentura_users').update({ last_seen: now }).eq('id', userId);
    };

    void ping();
    const t = setInterval(() => void ping(), 30_000);
    return () => clearInterval(t);
  }, [userId]);
}
