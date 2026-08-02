'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, BarChart3, Award, ArrowLeft, LogOut,
  ChevronRight, Eye, RefreshCw, Search, CheckCircle, XCircle,
  ExternalLink, Copy, Clock, DollarSign
} from 'lucide-react';
import Image from 'next/image';

// ------- TYPY -------
interface PartnerSummary {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  verified: boolean;
  active: boolean;
  socialLinks: string | null;
  createdAt: string;
  totalClicks: number;
  activeClients: number;
  tier: 1 | 2 | 3;
  tierName: string;
  commissionPercent: number;
  monthlyRevenue: number;
  monthlyPayout: number;
  referralLink: string;
}

interface Totals {
  totalPartners: number;
  totalClicks: number;
  totalActiveClients: number;
  totalRevenue: number;
  totalPayouts: number;
}

interface PartnerDetail extends PartnerSummary {
  payoutMethod: { type: string } | null;
  recentClicks: { clicked_at: string; ip_address: string; user_agent: string }[];
  referrals: { client_email: string; client_name: string; amount: number; status: string; created_at: string }[];
}

// ------- POMOCNÉ FUNKCE -------
function formatCZK(amount: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amount);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const TIER_COLORS: Record<number, string> = {
  1: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
  2: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
  3: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
};

// ------- PŘIHLAŠOVACÍ FORMULÁŘ -------
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.error || 'Nesprávné heslo');
      }
    } catch {
      setError('Chyba připojení');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/20 border-2 border-brand/30 mb-6">
            <Image src="/Logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Affiliate Admin</h1>
          <p className="text-zinc-500 font-bold mt-2">websbaca.cz/affiliate</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
              Heslo
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand transition font-mono font-bold"
              placeholder="••••••••••"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400 font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// ------- DETAIL PARTNERA -------
function PartnerDetailView({ partnerId, onBack }: { partnerId: string; onBack: () => void }) {
  const [data, setData] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliate/partners/${partnerId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-zinc-400 py-20">
        <p className="font-bold">Partner nenalezen.</p>
        <button onClick={onBack} className="mt-4 text-brand underline font-bold">Zpět</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.35 }}
    >
      {/* Zpět + refresh */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition font-bold"
        >
          <ArrowLeft size={18} /> Zpět na přehled
        </button>
        <button
          onClick={fetchDetail}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand transition font-bold text-sm"
        >
          <RefreshCw size={16} /> Obnovit
        </button>
      </div>

      {/* Hlavičkový profil */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-white">{data.name}</h2>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black border ${TIER_COLORS[data.tier]}`}>
                {data.tierName}
              </span>
              {data.verified ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400">
                  <CheckCircle size={12} /> Ověřen
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black bg-red-500/10 border border-red-500/20 text-red-400">
                  <XCircle size={12} /> Neověřen
                </span>
              )}
            </div>
            <p className="text-zinc-400 font-bold">{data.email}</p>
            {data.socialLinks && (
              <p className="text-zinc-500 text-sm font-bold mt-1">{data.socialLinks}</p>
            )}
            <p className="text-zinc-600 text-xs font-bold mt-2">Registrován: {formatDate(data.createdAt)}</p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between gap-2">
              <code className="text-xs text-zinc-300 font-mono">{data.referralCode}</code>
              <button onClick={copyLink} className="text-zinc-400 hover:text-brand transition">
                <Copy size={14} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-400 font-bold">✓ Zkopírováno!</p>}
            <a
              href={data.referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-brand hover:underline font-bold"
            >
              <ExternalLink size={12} /> {data.referralLink}
            </a>
          </div>
        </div>
      </div>

      {/* Statistiky */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Celkem kliků', value: data.totalClicks.toLocaleString('cs-CZ'), icon: TrendingUp, color: 'blue' },
          { label: 'Aktivní klienti', value: data.activeClients.toString(), icon: Users, color: 'green' },
          { label: 'Měs. obrat (klientů)', value: formatCZK(data.monthlyRevenue), icon: BarChart3, color: 'purple' },
          { label: 'Měs. výplata', value: formatCZK(data.monthlyPayout), icon: DollarSign, color: 'amber' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
              <stat.icon size={18} className={`text-${stat.color}-500`} />
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1 font-bold">{data.commissionPercent}% provize</p>
          </div>
        ))}
      </div>

      {/* Referraly */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Seznam klientů */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <Users size={20} className="text-brand" /> Klienti ({data.referrals.length})
          </h3>
          {data.referrals.length === 0 ? (
            <p className="text-zinc-500 font-bold text-sm text-center py-8">Žádní klienti zatím</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-white">{r.client_name || '—'}</p>
                    <p className="text-xs text-zinc-400">{r.client_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-400">{formatCZK(r.amount)}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posledních 50 kliků */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
            <Clock size={20} className="text-brand" /> Poslední kliky ({data.totalClicks})
          </h3>
          {data.recentClicks.length === 0 ? (
            <p className="text-zinc-500 font-bold text-sm text-center py-8">Žádné kliky zatím</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.recentClicks.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-xs text-zinc-300 font-mono">{c.ip_address || '—'}</p>
                    <p className="text-xs text-zinc-600 truncate max-w-[160px]">{c.user_agent || '—'}</p>
                  </div>
                  <p className="text-xs text-zinc-400 font-bold">{c.clicked_at ? formatDate(c.clicked_at) : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ------- DASHBOARD PŘEHLED -------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/affiliate/partners');
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setPartners(json.partners || []);
        setTotals(json.totals || null);
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = partners.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.referralCode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await fetch('/api/affiliate/logout', { method: 'POST' });
    onLogout();
  };

  if (selectedPartnerId) {
    return (
      <div className="min-h-screen bg-[#030303] px-4 sm:px-6 md:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <PartnerDetailView
              key={selectedPartnerId}
              partnerId={selectedPartnerId}
              onBack={() => setSelectedPartnerId(null)}
            />
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303]">
      {/* Navigace */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl border-2 border-brand bg-brand/10 overflow-hidden">
              {!logoError ? (
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-brand flex items-center justify-center">
                  <span className="text-white font-black text-xs">W</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none">WEBS BAČA</p>
              <p className="text-zinc-500 font-bold text-xs">Affiliate Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-zinc-400 hover:text-brand transition font-bold text-sm px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Obnovit</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg transition font-bold text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Odhlásit</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
        {/* Nadpis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Affiliate <span className="text-brand">přehled</span>
          </h1>
          <p className="text-zinc-400 font-bold">Statistiky všech partnerů / influencerů v jednom přehledu.</p>
        </motion.div>

        {/* Celkové statistiky */}
        {totals && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: 'Partneři celkem', value: totals.totalPartners.toString(), icon: Users, color: 'text-brand' },
              { label: 'Celkem kliků', value: totals.totalClicks.toLocaleString('cs-CZ'), icon: TrendingUp, color: 'text-blue-400' },
              { label: 'Aktivní klienti', value: totals.totalActiveClients.toString(), icon: CheckCircle, color: 'text-green-400' },
              { label: 'Celkový obrat', value: formatCZK(totals.totalRevenue), icon: BarChart3, color: 'text-purple-400' },
              { label: 'Celkem výplaty', value: formatCZK(totals.totalPayouts), icon: Award, color: 'text-amber-400' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Vyhledávání */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat podle jména, e-mailu nebo kódu..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand transition font-bold"
          />
        </div>

        {/* Tabulka partnerů */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <RefreshCw className="animate-spin text-brand" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-zinc-500 py-20 font-bold">
            {search ? 'Žádný partner nevyhovuje hledání.' : 'Zatím žádní registrovaní partneři.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedPartnerId(partner.referralCode)}
                className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-brand/40 rounded-2xl p-5 cursor-pointer transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Levá část – info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/20 flex items-center justify-center shrink-0">
                      <span className="text-brand font-black text-sm">{(partner.name || '?')[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-black">{partner.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${TIER_COLORS[partner.tier]}`}>
                          T{partner.tier}
                        </span>
                        {partner.verified ? (
                          <CheckCircle size={14} className="text-green-400" />
                        ) : (
                          <XCircle size={14} className="text-zinc-500" />
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm font-bold truncate">{partner.email}</p>
                      <code className="text-zinc-600 text-xs font-mono">{partner.referralCode}</code>
                    </div>
                  </div>

                  {/* Prostřední – statistiky */}
                  <div className="grid grid-cols-4 gap-4 text-center md:flex md:gap-6">
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Kliky</p>
                      <p className="text-white font-black">{partner.totalClicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Klienti</p>
                      <p className="text-white font-black">{partner.activeClients}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Provize %</p>
                      <p className="text-white font-black">{partner.commissionPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Výplata/m</p>
                      <p className="text-brand font-black">{formatCZK(partner.monthlyPayout)}</p>
                    </div>
                  </div>

                  {/* Šipka */}
                  <ChevronRight
                    size={20}
                    className="text-zinc-600 group-hover:text-brand transition shrink-0 hidden md:block"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ------- HLAVNÍ KOMPONENTA -------
export default function AffiliatePage() {
  const [authState, setAuthState] = useState<'loading' | 'login' | 'dashboard'>('loading');

  useEffect(() => {
    // Zkontrolovat cookie přes API
    fetch('/api/affiliate/logout')
      .then((r) => r.json())
      .then((d) => {
        setAuthState(d.authenticated ? 'dashboard' : 'login');
      })
      .catch(() => setAuthState('login'));
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <RefreshCw className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (authState === 'login') {
    return <LoginForm onLogin={() => setAuthState('dashboard')} />;
  }

  return <Dashboard onLogout={() => setAuthState('login')} />;
}
