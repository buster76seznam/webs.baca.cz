'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, SUFFIX_LENGTH, getRoleByMasterPassword } from '@/lib/supabase';
import Image from 'next/image';
import Dashboard from './components/Dashboard';
import { Role } from './types';

type Screen = 'loading' | 'enter_master' | 'new_user_setup' | 'returning_login' | 'dashboard';

interface UserSession {
  id: string;
  username: string;
  role: Role;
  suffix: string;
}

async function getClientIp(): Promise<string> {
  try {
    const res = await fetch('/api/get-ip');
    const data = await res.json();
    return data.ip ?? '0.0.0.0';
  } catch {
    return '0.0.0.0';
  }
}

const SESSION_KEY = 'wb_session';

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { session: UserSession; expires: number };
    if (Date.now() > parsed.expires) { localStorage.removeItem(SESSION_KEY); return null; }
    return parsed.session;
  } catch { return null; }
}

function saveSession(session: UserSession) {
  const expires = Date.now() + 15 * 24 * 60 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ session, expires }));
}

export default function AgenturaPage() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [clientIp, setClientIp] = useState('');
  const [masterInput, setMasterInput] = useState('');
  const [detectedRole, setDetectedRole] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [suffixInput, setSuffixInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const init = async () => {
      const existing = loadSession();
      if (existing) { setUserSession(existing); setScreen('dashboard'); return; }
      const ip = await getClientIp();
      setClientIp(ip);
      const { data } = await supabase
        .from('agentura_users')
        .select('id, username, role, password_suffix')
        .eq('ip_address', ip)
        .maybeSingle();
      setScreen(data ? 'returning_login' : 'enter_master');
    };
    init();
  }, []);

  const handleMasterSubmit = () => {
    setError('');
    const role = getRoleByMasterPassword(masterInput.trim());
    if (!role) { setError('Nesprávné heslo.'); return; }
    setDetectedRole(role);
    setScreen('new_user_setup');
  };

  const handleNewUserSetup = async () => {
    setError('');
    const username = usernameInput.trim();
    const suffix = suffixInput.trim();
    if (username.length < 2) { setError('Jméno musí mít alespoň 2 znaky.'); return; }
    if (suffix.length !== SUFFIX_LENGTH) { setError(`Koncovka musí mít přesně ${SUFFIX_LENGTH} znaky.`); return; }
    setLoading(true);

    const { data: existing } = await supabase
      .from('agentura_users').select('id').eq('username', username).maybeSingle();
    if (existing) { setError('Toto jméno je již obsazeno.'); setLoading(false); return; }

    const { data, error: insertError } = await supabase
      .from('agentura_users')
      .insert({ username, password_suffix: suffix, role: detectedRole, ip_address: clientIp, last_login: new Date().toISOString() })
      .select('id')
      .single();

    if (insertError || !data) { setError('Chyba při ukládání. Zkus to znovu.'); setLoading(false); return; }

    const session: UserSession = { id: data.id, username, role: detectedRole as Role, suffix };
    saveSession(session);
    setUserSession(session);
    setScreen('dashboard');
    setLoading(false);
  };

  const handleReturningLogin = async () => {
    setError('');
    setLoading(true);
    const fullPassword = loginPassword.trim();
    if (fullPassword.length < SUFFIX_LENGTH + 1) { setError('Zadej heslo i s koncovkou.'); setLoading(false); return; }

    const masterPart = fullPassword.slice(0, -SUFFIX_LENGTH);
    const suffixPart = fullPassword.slice(-SUFFIX_LENGTH);
    const role = getRoleByMasterPassword(masterPart);
    if (!role) { setError('Nesprávné heslo.'); setLoading(false); return; }

    const { data } = await supabase
      .from('agentura_users')
      .select('id, username, role, password_suffix')
      .eq('ip_address', clientIp)
      .eq('password_suffix', suffixPart)
      .maybeSingle();

    if (!data) { setError('Nesprávné heslo nebo koncovka.'); setLoading(false); return; }

    await supabase.from('agentura_users')
      .update({ last_login: new Date().toISOString() })
      .eq('ip_address', clientIp);

    const session: UserSession = { id: data.id, username: data.username, role: data.role as Role, suffix: suffixPart };
    saveSession(session);
    setUserSession(session);
    setScreen('dashboard');
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUserSession(null);
    setMasterInput('');
    setLoginPassword('');
    setSuffixInput('');
    setUsernameInput('');
    setError('');
    setScreen('enter_master');
  };

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.5, ease: 'easeOut' as const },
  };

  const inputClass = `w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white 
    placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 
    focus:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] transition-all duration-300`;

  const Logo = () => (
    <div className="flex flex-col items-center gap-5 mb-10">
      <div className="relative w-20 h-20 overflow-hidden rounded-3xl border-2 border-[#7C3AED] shadow-2xl shadow-[#7C3AED]/30">
        {!logoError ? (
          <Image src="/Logo.jpg" alt="Webs Bača" fill className="object-cover" onError={() => setLogoError(true)} priority />
        ) : (
          <div className="w-full h-full bg-[#7C3AED] flex items-center justify-center">
            <span className="text-white font-black text-3xl">W</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-3xl font-black tracking-tighter uppercase text-white">Webs Bača</div>
        <div className="text-[10px] font-black text-[#7C3AED] tracking-[0.5em] uppercase mt-1">Interní portál</div>
      </div>
    </div>
  );

  /* ── Dashboard ── */
  if (screen === 'dashboard' && userSession) {
    return (
      <Dashboard
        userId={userSession.id}
        username={userSession.username}
        role={userSession.role}
        onLogout={handleLogout}
      />
    );
  }

  /* ── Auth screens ── */
  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.06),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <AnimatePresence mode="wait">

          {/* Obrazovka 1 – Master heslo */}
          {screen === 'enter_master' && (
            <motion.div key="enter_master" {...fadeUp}>
              <Logo />
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <p className="text-zinc-500 text-sm text-center mb-8 font-medium">Zadej přístupové heslo</p>
                <input
                  type="password"
                  value={masterInput}
                  onChange={e => { setMasterInput(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleMasterSubmit()}
                  placeholder="••••••••"
                  className={`${inputClass} text-center text-xl tracking-widest mb-4`}
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs text-center mb-4 font-bold">{error}</p>}
                <button
                  onClick={handleMasterSubmit}
                  className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#5B21B6] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]"
                >
                  Vstoupit
                </button>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <button
                    onClick={() => { setScreen('returning_login'); setError(''); setMasterInput(''); }}
                    className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-bold uppercase tracking-widest"
                  >
                    Už jsem tu byl/a
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Obrazovka 2 – Nový uživatel */}
          {screen === 'new_user_setup' && (
            <motion.div key="new_user_setup" {...fadeUp}>
              <Logo />
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="inline-flex items-center justify-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-2xl px-4 py-2 mb-6 w-full">
                  <span className="text-[#A78BFA] font-black text-xs uppercase tracking-widest">{detectedRole}</span>
                </div>
                <p className="text-zinc-500 text-sm text-center mb-8 font-medium">
                  Vyber si uživatelské jméno a 2znakovou koncovku k heslu
                </p>
                <div className="flex flex-col gap-4 mb-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Uživatelské jméno</label>
                    <input type="text" value={usernameInput} onChange={e => { setUsernameInput(e.target.value); setError(''); }}
                      placeholder="např. Tomáš" className={inputClass} autoFocus />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Koncovka hesla (2 znaky)</label>
                    <input type="text" value={suffixInput}
                      onChange={e => { setSuffixInput(e.target.value.slice(0, 2)); setError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleNewUserSetup()}
                      placeholder="A7" maxLength={2}
                      className={`${inputClass} text-center text-2xl tracking-[0.5em]`} />
                    <p className="text-zinc-700 text-[10px] mt-2 text-center">
                      Tvoje heslo bude: <span className="text-zinc-500 font-mono">master_heslo + {suffixInput || '__'}</span>
                    </p>
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs text-center mb-4 font-bold">{error}</p>}
                <button onClick={handleNewUserSetup} disabled={loading}
                  className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#5B21B6] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] disabled:opacity-50">
                  {loading ? 'Ukládám...' : 'Vytvořit účet'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Obrazovka 3 – Vracející se uživatel */}
          {screen === 'returning_login' && (
            <motion.div key="returning_login" {...fadeUp}>
              <Logo />
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <p className="text-zinc-500 text-sm text-center mb-8 font-medium">Zadej své heslo i s koncovkou</p>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleReturningLogin()}
                  placeholder="••••••••••"
                  className={`${inputClass} text-center text-xl tracking-widest mb-4`}
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs text-center mb-4 font-bold">{error}</p>}
                <button onClick={handleReturningLogin} disabled={loading}
                  className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#5B21B6] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] disabled:opacity-50">
                  {loading ? 'Ověřuji...' : 'Přihlásit se'}
                </button>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <button onClick={() => { setScreen('enter_master'); setError(''); setLoginPassword(''); }}
                    className="w-full text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-bold uppercase tracking-widest">
                    ← Zpět
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
