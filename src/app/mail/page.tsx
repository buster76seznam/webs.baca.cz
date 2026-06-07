'use client';

import { useEffect, useState } from 'react';
import { LogOut, Play, Mail, Users, FileText, AlertCircle, Clock, Globe, Shield, Zap, X } from 'lucide-react';

interface Stats {
  contacted: number;
  blacklisted: number;
  replies: number;
  drafts: number;
}

interface Contact {
  email: string;
  company_name: string;
  address: string;
  sequence_status: string;
  processed_at: string;
}

interface Reply {
  timestamp: string;
  sender_email: string;
  sender_name: string;
  company_name: string;
  intent: string;
  draft_saved: boolean;
  draft_path: string;
}

export default function MailAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchLog, 30000); // Auto-refresh log every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/mail/stats');
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const res = await fetch('/api/mail/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Login failed');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/mail/logout');
    setIsAuthenticated(false);
    setStats(null);
    setContacts([]);
    setReplies([]);
    setLog([]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes, repliesRes, logRes] = await Promise.all([
        fetch('/api/mail/stats'),
        fetch('/api/mail/contacts'),
        fetch('/api/mail/replies'),
        fetch('/api/mail/log'),
      ]);

      const statsData = await statsRes.json();
      const contactsData = await contactsRes.json();
      const repliesData = await repliesRes.json();
      const logData = await logRes.json();

      setStats(statsData);
      setContacts(contactsData.contacts || []);
      setReplies(repliesData.replies || []);
      setLog(logData.log || []);
      setServerOnline(true);
    } catch (error) {
      console.error('Fetch error:', error);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchLog = async () => {
    try {
      const res = await fetch('/api/mail/log');
      const data = await res.json();
      setLog(data.log || []);
      setServerOnline(true);
    } catch (error) {
      setServerOnline(false);
    }
  };

  const handleAction = async (action: 'outreach' | 'replies') => {
    setActionLoading(action);
    setNotification(null);

    try {
      const res = await fetch('/api/mail/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: action === 'outreach' ? 'Outreach spuštěn' : 'Odpovědi zpracovávány' });
        // Refresh data after a delay
        setTimeout(fetchData, 2000);
      } else {
        setNotification({ type: 'error', message: 'Akce se nepodařila' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Akce se nepodařila' });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'Odesláno': { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Odesláno' },
      'Chyba': { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Chyba' },
      'Čeká': { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', label: 'Čeká' },
    };
    const config = statusMap[status] || { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', label: status };
    return <span className={`px-2 py-1 rounded-md text-xs font-bold border ${config.color}`}>{config.label}</span>;
  };

  const getIntentBadge = (intent: string) => {
    const intentMap: Record<string, { color: string; label: string }> = {
      'ZÁJEM': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'ZÁJEM' },
      'DOTAZ': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'DOTAZ' },
      'ODMÍTNUTÍ': { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'ODMÍTNUTÍ' },
    };
    const config = intentMap[intent] || { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', label: intent };
    return <span className={`px-2 py-1 rounded-md text-xs font-bold border ${config.color}`}>{config.label}</span>;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tighter text-white mb-2">WEBS BAČA</h1>
              <p className="text-zinc-500 text-sm font-medium">Outreach Admin Panel</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Heslo</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <p className="text-red-400 text-sm font-bold text-center">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#5B21B6] transition-all duration-300"
              >
                Přihlásit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#1a1a1a]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">WEBS BAČA — OUTREACH</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Trh:</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30">CZ</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Odhlásit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-2xl border ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          } flex items-center justify-between`}>
            <span className="font-bold text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Server Status */}
        {!serverOnline && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold text-sm">Server offline - data nemusí být aktuální</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Celkem kontaktováno" value={stats?.contacted || 0} loading={loading} />
          <StatCard icon={Shield} label="Na blacklistu" value={stats?.blacklisted || 0} loading={loading} />
          <StatCard icon={Mail} label="Zpracovaných odpovědí" value={stats?.replies || 0} loading={loading} />
          <StatCard icon={FileText} label="Konceptů ke kontrole" value={stats?.drafts || 0} loading={loading} />
        </div>

        {/* Domains Overview */}
        <section className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
          <h2 className="text-lg font-black tracking-tight mb-4">Domény</h2>
          <div className="text-center py-12 text-zinc-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Zatím žádné domény</p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionButton
            icon={Play}
            label="Spustit Outreach"
            loading={actionLoading === 'outreach'}
            onClick={() => handleAction('outreach')}
          />
          <ActionButton
            icon={Mail}
            label="Zpracovat odpovědi"
            loading={actionLoading === 'replies'}
            onClick={() => handleAction('replies')}
          />
        </section>

        {/* Log Viewer */}
        <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
          <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#7C3AED]" />
            Poslední log
          </h2>
          <div className="bg-[#050505] rounded-2xl p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-emerald-400 whitespace-pre-wrap">
              {log.length > 0 ? log.join('\n') : 'Žádné logy'}
            </pre>
          </div>
        </section>

        {/* Recent Contacts */}
        <section className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
          <h2 className="text-lg font-black tracking-tight mb-4">Poslední kontakty</h2>
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Email</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Firma</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Stav</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Čas</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-sm font-medium text-white">{contact.email}</td>
                      <td className="py-3 text-sm text-zinc-400">{contact.company_name}</td>
                      <td className="py-3">{getStatusBadge(contact.sequence_status)}</td>
                      <td className="py-3 text-sm text-zinc-500">{new Date(contact.processed_at).toLocaleString('cs-CZ')}</td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500">Žádné kontakty</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Processed Replies */}
        <section className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
          <h2 className="text-lg font-black tracking-tight mb-4">Zpracované odpovědi</h2>
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Email</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Záměr</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Koncept</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 pb-3">Čas</th>
                  </tr>
                </thead>
                <tbody>
                  {replies.map((reply, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-sm font-medium text-white">{reply.sender_email}</td>
                      <td className="py-3">{getIntentBadge(reply.intent)}</td>
                      <td className="py-3 text-sm text-zinc-400">{reply.draft_saved ? 'Uložen' : 'Neuložen'}</td>
                      <td className="py-3 text-sm text-zinc-500">{new Date(reply.timestamp).toLocaleString('cs-CZ')}</td>
                    </tr>
                  ))}
                  {replies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500">Žádné odpovědi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, loading }: { icon: any; label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6 text-[#7C3AED]" />
        <div className={`w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center ${loading ? 'animate-pulse' : ''}`}>
          {loading ? <div className="w-4 h-4 bg-[#7C3AED]/30 rounded" /> : <span className="text-[#7C3AED] font-black text-sm">{value}</span>}
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, loading, onClick }: { icon: any; label: string; loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:border-[#7C3AED]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className={`w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center group-hover:bg-[#7C3AED]/20 transition-all duration-300 ${loading ? 'animate-pulse' : ''}`}>
        {loading ? <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /> : <Icon className="w-6 h-6 text-[#7C3AED]" />}
      </div>
      <div className="text-left">
        <p className="text-sm font-black text-white">{label}</p>
        <p className="text-[10px] font-bold text-zinc-500">{loading ? 'Zpracovávám...' : 'Klikněte pro spuštění'}</p>
      </div>
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-1 h-10 bg-white/5 rounded animate-pulse" />
          <div className="flex-1 h-10 bg-white/5 rounded animate-pulse" />
          <div className="w-24 h-10 bg-white/5 rounded animate-pulse" />
          <div className="w-32 h-10 bg-white/5 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
