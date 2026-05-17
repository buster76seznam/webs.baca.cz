'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2, Save, X, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AgenturaUser, Role } from '@/types';
import { ROLES, isUserOnline } from '@/lib/roles';

type UserManagementPanelProps = {
  currentUserId: string;
};

type EditState = {
  username: string;
  role: Role;
  password_suffix: string;
};

export default function UserManagementPanel({ currentUserId }: UserManagementPanelProps) {
  const [users, setUsers] = useState<AgenturaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({ username: '', role: 'Obchodní zástupce', password_suffix: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('agentura_users')
      .select('*')
      .order('username');

    if (!err && data) setUsers(data as AgenturaUser[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function startEdit(u: AgenturaUser) {
    setEditingId(u.id);
    setEdit({ username: u.username, role: u.role, password_suffix: u.password_suffix });
    setError('');
  }

  async function saveEdit(id: string) {
    setError('');
    const username = edit.username.trim();
    const suffix = edit.password_suffix.trim();

    if (username.length < 2) {
      setError('Jméno musí mít alespoň 2 znaky.');
      return;
    }
    if (suffix.length !== 2) {
      setError('Koncovka hesla musí mít přesně 2 znaky.');
      return;
    }

    setSaving(true);
    const { error: err } = await supabase
      .from('agentura_users')
      .update({ username, role: edit.role, password_suffix: suffix })
      .eq('id', id);

    setSaving(false);
    if (err) {
      setError('Uložení se nezdařilo. Zkontrolujte oprávnění v Supabase.');
      return;
    }
    setEditingId(null);
    fetchUsers();
  }

  async function deleteUser(id: string, username: string) {
    if (id === currentUserId) {
      setError('Nemůžete smazat vlastní účet.');
      return;
    }
    if (!confirm(`Opravdu smazat uživatele „${username}"? Tuto akci nelze vrátit.`)) return;

    const { error: err } = await supabase.from('agentura_users').delete().eq('id', id);
    if (err) {
      setError('Smazání se nezdařilo.');
      return;
    }
    fetchUsers();
  }

  if (loading) {
    return <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest py-12 text-center">Načítám uživatele…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield size={18} className="text-[#A78BFA]" />
        <h2 className="text-lg font-black uppercase italic tracking-tight">Správa uživatelů</h2>
      </div>

      {error && (
        <p className="text-red-400 text-xs font-bold p-4 rounded-2xl bg-red-500/10 border border-red-500/20">{error}</p>
      )}

      <div className="overflow-x-auto rounded-[2rem] border border-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="p-4">Jméno</th>
              <th className="p-4">Role</th>
              <th className="p-4">Koncovka hesla</th>
              <th className="p-4">Stav</th>
              <th className="p-4">Poslední přihlášení</th>
              <th className="p-4 text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const isEditing = editingId === u.id;
              const online = isUserOnline(u.last_seen, u.last_login);

              return (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    {isEditing ? (
                      <input
                        value={edit.username}
                        onChange={e => setEdit({ ...edit, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                      />
                    ) : (
                      <span className="font-bold">{u.username}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={edit.role}
                        onChange={e => setEdit({ ...edit, role: e.target.value as Role })}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r} className="bg-[#111]">
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-400">{u.role}</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-400">
                    {isEditing ? (
                      <input
                        value={edit.password_suffix}
                        maxLength={2}
                        onChange={e => setEdit({ ...edit, password_suffix: e.target.value.slice(0, 2) })}
                        className="w-16 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center"
                      />
                    ) : (
                      `••••••${u.password_suffix}`
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase ${
                        online ? 'text-emerald-400' : 'text-zinc-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-zinc-600'}`}
                      />
                      {online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-zinc-500">
                    {u.last_login ? new Date(u.last_login).toLocaleString('cs-CZ') : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(u.id)}
                            disabled={saving}
                            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            title="Uložit"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                            title="Zrušit"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(u)}
                            className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-[#A78BFA]"
                            title="Upravit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUser(u.id, u.username)}
                            disabled={u.id === currentUserId}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30"
                            title="Smazat"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-zinc-600 font-bold">
        Změna koncovky = nové osobní heslo (master heslo role + nová 2znaková koncovka). IP adresa zůstává vázaná na
        zařízení uživatele.
      </p>
    </div>
  );
}
