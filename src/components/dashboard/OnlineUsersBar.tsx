'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AgenturaUser } from '@/types';
import { isUserOnline } from '@/lib/roles';

type OnlineUsersBarProps = {
  currentUserId: string;
};

export default function OnlineUsersBar({ currentUserId }: OnlineUsersBarProps) {
  const [users, setUsers] = useState<AgenturaUser[]>([]);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('agentura_users')
      .select('id, username, role, last_login, last_seen')
      .order('username');

    if (data) setUsers(data as AgenturaUser[]);
  }, []);

  useEffect(() => {
    fetchUsers();
    const t = setInterval(fetchUsers, 30_000);
    return () => clearInterval(t);
  }, [fetchUsers]);

  const online = users.filter(u => isUserOnline(u.last_seen, u.last_login));

  return (
    <div className="mb-8 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Právě online ({online.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {online.length === 0 ? (
          <span className="text-xs text-zinc-600 font-bold">Nikdo další není aktivní</span>
        ) : (
          online.map(u => (
            <span
              key={u.id}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border
                ${u.id === currentUserId ? 'border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#A78BFA]' : 'border-white/10 bg-white/[0.03] text-zinc-300'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              {u.username}
              <span className="text-zinc-600 font-bold normal-case">{u.role}</span>
            </span>
          ))
        )}
      </div>
      {users.length > online.length && (
        <p className="text-[9px] text-zinc-600 mt-3 font-bold uppercase tracking-wider">
          Offline:{' '}
          {users
            .filter(u => !isUserOnline(u.last_seen, u.last_login))
            .map(u => u.username)
            .join(', ') || '—'}
        </p>
      )}
    </div>
  );
}
