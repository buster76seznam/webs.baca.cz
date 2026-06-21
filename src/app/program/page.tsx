'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, Clock, CheckCircle, X, LogOut, Play, Mail, Server, Activity, Users, FileText, AlertCircle } from 'lucide-react';
import { Order } from '@/types';

const CORRECT_PASSWORD = 'Kx9Pm2Qz7R';

export default function ProgramPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'čeká' | 'vývoj' | 'dokončená'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'trash' | 'outreach'>('orders');

  // Outreach state
  const [stats, setStats] = useState({ contacted: 0, blacklisted: 0, replies: 0, drafts: 0 });
  const [domains, setDomains] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('program_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  // Refetch orders when switching between orders and trash tabs
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'orders' || activeTab === 'trash')) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Fetch outreach data when outreach tab is active
  useEffect(() => {
    if (activeTab === 'outreach' && isAuthenticated) {
      fetchOutreachData();
    }
  }, [activeTab, isAuthenticated]);

  // Auto-refresh log every 30 seconds
  useEffect(() => {
    if (activeTab === 'outreach' && isAuthenticated) {
      const interval = setInterval(() => {
        fetchLog();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const trashParam = activeTab === 'trash' ? 'trash=true' : '';
      const res = await fetch(`/api/orders?${trashParam}`);
      const data = await res.json();
      console.log('Fetched orders:', data);
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Fetch error:', data.error);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('program_authenticated', 'true');
      setError('');
      fetchOrders();
    } else {
      setError('Nesprávné heslo');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('program_authenticated');
    setPassword('');
    setOrders([]);
    setActiveTab('orders');
  };

  const fetchOutreachData = async () => {
    setLoadingStats(true);
    setLoadingDomains(true);
    setLoadingContacts(true);
    setLoadingReplies(true);
    setLoadingLog(true);

    try {
      const [statsRes, domainsRes, contactsRes, repliesRes, logRes] = await Promise.all([
        fetch('/api/mail/stats'),
        fetch('/api/mail/domains'),
        fetch('/api/mail/contacts'),
        fetch('/api/mail/replies'),
        fetch('/api/mail/log'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (domainsRes.ok) {
        const domainsData = await domainsRes.json();
        setDomains(domainsData.domains || []);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      if (repliesRes.ok) {
        const repliesData = await repliesRes.json();
        setReplies(repliesData.replies || []);
      }

      if (logRes.ok) {
        const logData = await logRes.json();
        setLog(logData.log || []);
      }
    } catch (err) {
      console.error('Error fetching outreach data:', err);
    } finally {
      setLoadingStats(false);
      setLoadingDomains(false);
      setLoadingContacts(false);
      setLoadingReplies(false);
      setLoadingLog(false);
    }
  };

  const fetchLog = async () => {
    try {
      const res = await fetch('/api/mail/log');
      if (res.ok) {
        const data = await res.json();
        setLog(data.log || []);
      }
    } catch (err) {
      console.error('Error fetching log:', err);
    }
  };

  const handleRunAction = async (action: 'outreach' | 'replies') => {
    setActionLoading(action);
    try {
      const res = await fetch('/api/mail/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: `${action === 'outreach' ? 'Outreach' : 'Zpracování odpovědí'} úspěšně spuštěno` });
        // Refresh data after a delay
        setTimeout(() => fetchOutreachData(), 2000);
      } else {
        setNotification({ type: 'error', message: 'Chyba při spouštění akce' });
      }
    } catch (err) {
      console.error('Error running action:', err);
      setNotification({ type: 'error', message: 'Chyba při spouštění akce' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'čeká' | 'vývoj' | 'dokončená') => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      console.log('Status change response:', data);
      if (res.ok) {
        await fetchOrders(); // Refetch from database to get persisted status
        showNotification('success', 'Status byl změněn.');
      } else {
        showNotification('error', data.error || 'Chyba při změně statusu.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification('error', 'Chyba při změně statusu.');
    }
  };

  const handleDelete = async (orderId: string, permanent = false) => {
    if (!confirm(permanent ? 'Opravdu chcete trvale smazat tuto objednávku? Tato akce je nevratná.' : 'Opravdu chcete přesunout tuto objednávku do koše?')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permanent }),
      });
      const data = await res.json();
      console.log('Delete response:', data);
      if (res.ok) {
        if (permanent) {
          setOrders(orders.filter(order => order.id !== orderId));
          setSelectedOrder(null);
        } else {
          await fetchOrders(); // Refetch to get updated data
        }
        showNotification('success', permanent ? 'Objednávka byla trvale smazána.' : 'Objednávka byla přesunuta do koše.');
      } else {
        showNotification('error', data.error || 'Chyba při mazání objednávky.');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      showNotification('error', 'Chyba při mazání objednávky.');
    }
  };

  const handleRestore = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      const data = await res.json();
      console.log('Restore response:', data);
      if (res.ok) {
        await fetchOrders(); // Refetch to get updated data
        showNotification('success', 'Objednávka byla obnovena z koše.');
      } else {
        showNotification('error', data.error || 'Chyba při obnově objednávky.');
      }
    } catch (err) {
      console.error('Error restoring order:', err);
      showNotification('error', 'Chyba při obnově objednávky.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-6">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12 max-w-md w-full">
          <h1 className="text-2xl font-black mb-2 tracking-tight uppercase">Program</h1>
          <p className="text-zinc-500 text-sm mb-8">Zadejte heslo pro přístup</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm mb-4"
            />
            {error && (
              <p className="text-red-400 text-sm font-bold mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)]"
            >
              Otevřít
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black uppercase tracking-tight">Program</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase transition-all ${
                  activeTab === 'orders'
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
                }`}
              >
                Objednávky
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase transition-all ${
                  activeTab === 'trash'
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
                }`}
              >
                Koš
              </button>
              <button
                onClick={() => setActiveTab('outreach')}
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase transition-all ${
                  activeTab === 'outreach'
                    ? 'bg-brand text-white'
                    : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
                }`}
              >
                Přehled domén
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold"
          >
            <LogOut size={16} />
            Odhlásit
          </button>
        </div>
      </div>

      {notification && (
        <div className={`fixed top-20 right-6 px-6 py-4 rounded-2xl text-sm font-black z-50 ${
          notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          {/* Search and Filter */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hledat podle názvu podniku..."
                  className="w-full bg-white/[0.03] border border-white/8 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
              >
                <option value="all">Všechny statusy</option>
                <option value="čeká">Čeká</option>
                <option value="vývoj">Vývoj</option>
                <option value="dokončená">Dokončená</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 mt-4">Načítání...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500">Žádné objednávky</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-brand/20 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black">{order.company_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            order.status === 'čeká' ? 'bg-amber-500/10 text-amber-400' :
                            order.status === 'vývoj' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-sm mb-2">{order.industry}</p>
                        <p className="text-zinc-600 text-xs">{new Date(order.created_at).toLocaleDateString('cs-CZ')}</p>
                      </div>
                      {order.images.length > 0 && (
                        <div className="flex items-center gap-2 text-zinc-500">
                          <ImageIcon size={16} />
                          <span className="text-xs">{order.images.length}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Trash Tab */}
      {activeTab === 'trash' && (
        <>
          {/* Search */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hledat v koši..."
                className="w-full bg-white/[0.03] border border-white/8 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Trash List */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 mt-4">Načítání...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500">Koš je prázdný</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0A0A] border border-red-500/20 rounded-3xl p-6 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-zinc-400">{order.company_name}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500/10 text-red-400">
                            Smazáno
                          </span>
                        </div>
                        <p className="text-zinc-500 text-sm mb-2">{order.industry}</p>
                        <p className="text-zinc-600 text-xs">Smazáno: {order.deleted_at ? new Date(order.deleted_at).toLocaleDateString('cs-CZ') : '-'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Outreach Tab */}
      {activeTab === 'outreach' && (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-brand" size={20} />
                <span className="text-zinc-500 text-xs font-black uppercase">Kontaktováno</span>
              </div>
              <p className="text-3xl font-black">{loadingStats ? '-' : stats.contacted}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-zinc-500 text-xs font-black uppercase">Blacklist</span>
              </div>
              <p className="text-3xl font-black">{loadingStats ? '-' : stats.blacklisted}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-blue-400" size={20} />
                <span className="text-zinc-500 text-xs font-black uppercase">Odpovědi</span>
              </div>
              <p className="text-3xl font-black">{loadingStats ? '-' : stats.replies}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-amber-400" size={20} />
                <span className="text-zinc-500 text-xs font-black uppercase">Koncepty</span>
              </div>
              <p className="text-3xl font-black">{loadingStats ? '-' : stats.drafts}</p>
            </div>
          </div>

          {/* Domain Overview */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Server size={20} className="text-brand" />
              Přehled domén
            </h2>
            {loadingDomains ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">Zatím žádné domény</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-zinc-500 text-xs font-black uppercase">
                      <th className="pb-3">Doména</th>
                      <th className="pb-3">Stav</th>
                      <th className="pb-3">Odesláno celkem</th>
                      <th className="pb-3">Dnes odesláno</th>
                      <th className="pb-3">Deliverability %</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {domains.map((domain, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3 font-medium">{domain.domain}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                            domain.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                            domain.status === 'warming' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {domain.status === 'active' ? 'Aktivní' : domain.status === 'warming' ? 'Warming' : 'Pozastaveno'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400">{domain.total_sent || 0}</td>
                        <td className="py-3 text-zinc-400">{domain.today_sent || 0}</td>
                        <td className="py-3 text-zinc-400">{domain.deliverability || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => handleRunAction('outreach')}
              disabled={actionLoading === 'outreach'}
              className="flex-1 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)] flex items-center justify-center gap-2"
            >
              {actionLoading === 'outreach' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={18} />
                  Spustit Outreach
                </>
              )}
            </button>
            <button
              onClick={() => handleRunAction('replies')}
              disabled={actionLoading === 'replies'}
              className="flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 border border-white/10 flex items-center justify-center gap-2"
            >
              {actionLoading === 'replies' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Mail size={18} />
                  Zpracovat odpovědi
                </>
              )}
            </button>
          </div>

          {/* Log Viewer */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Activity size={20} className="text-brand" />
              Poslední log
            </h2>
            <div className="bg-[#050505] rounded-xl p-4 font-mono text-xs text-emerald-400 h-64 overflow-y-auto">
              {loadingLog ? (
                <div className="text-center py-8 text-zinc-500">Načítání...</div>
              ) : log.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">Žádné logy</div>
              ) : (
                log.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))
              )}
            </div>
          </div>

          {/* Last Contacts */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Users size={20} className="text-brand" />
              Poslední kontakty
            </h2>
            {loadingContacts ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">Žádné kontakty</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-zinc-500 text-xs font-black uppercase">
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Firma</th>
                      <th className="pb-3">Stav</th>
                      <th className="pb-3">Čas</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {contacts.map((contact, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3">{contact.email}</td>
                        <td className="py-3 text-zinc-400">{contact.company_name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                            contact.sequence_status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' :
                            contact.sequence_status === 'error' ? 'bg-red-500/10 text-red-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {contact.sequence_status === 'sent' ? 'Odesláno' : contact.sequence_status === 'error' ? 'Chyba' : 'Čeká'}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400">
                          {contact.processed_at ? new Date(contact.processed_at).toLocaleString('cs-CZ') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Last Replies */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Mail size={20} className="text-brand" />
              Zpracované odpovědi
            </h2>
            {loadingReplies ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : replies.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">Žádné odpovědi</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-zinc-500 text-xs font-black uppercase">
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Záměr</th>
                      <th className="pb-3">Koncept</th>
                      <th className="pb-3">Čas</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {replies.map((reply, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3">{reply.sender_email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                            reply.intent === 'ZÁJEM' ? 'bg-blue-500/10 text-blue-400' :
                            reply.intent === 'DOTAZ' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {reply.intent}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400">
                          {reply.draft_saved ? '✓' : '-'}
                        </td>
                        <td className="py-3 text-zinc-400">
                          {reply.timestamp ? new Date(reply.timestamp).toLocaleString('cs-CZ') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/5 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/5 p-6 flex items-center justify-between">
                <h2 className="text-xl font-black">{selectedOrder.company_name}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                    className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
                  >
                    <option value="čeká">Čeká</option>
                    <option value="vývoj">Vývoj</option>
                    <option value="dokončená">Dokončená</option>
                  </select>
                </div>

                {/* Company Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Telefon</label>
                    <p className="text-white">{selectedOrder.company_phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Email</label>
                    <p className="text-white">{selectedOrder.company_email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Adresa</label>
                  <p className="text-white">{selectedOrder.company_address}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Obor</label>
                  <p className="text-white">{selectedOrder.industry}</p>
                </div>

                {/* Owner Info */}
                {(selectedOrder.owner_name || selectedOrder.owner_phone || selectedOrder.owner_email) && (
                  <div className="bg-white/[0.02] rounded-2xl p-4">
                    <h3 className="text-sm font-black mb-3 text-brand uppercase tracking-wider">Majitel/Jednatel</h3>
                    <div className="space-y-2">
                      {selectedOrder.owner_name && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Jméno</label>
                          <p className="text-white text-sm">{selectedOrder.owner_name}</p>
                        </div>
                      )}
                      {selectedOrder.owner_phone && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Telefon</label>
                          <p className="text-white text-sm">{selectedOrder.owner_phone}</p>
                        </div>
                      )}
                      {selectedOrder.owner_email && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Email</label>
                          <p className="text-white text-sm">{selectedOrder.owner_email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Domain */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Doména</label>
                  <p className="text-white">{selectedOrder.domain}</p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Co dělají</label>
                  <p className="text-white text-sm leading-relaxed">{selectedOrder.description}</p>
                </div>

                {/* Advantage */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Výhoda oproti konkurenci</label>
                  <p className="text-white text-sm leading-relaxed">{selectedOrder.advantage}</p>
                </div>

                {/* Price List */}
                {selectedOrder.price_list && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Ceník</label>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-line">{selectedOrder.price_list}</p>
                  </div>
                )}

                {/* Working Hours */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Pracovní doba</label>
                  <p className="text-white">{selectedOrder.working_hours}</p>
                </div>

                {/* Images */}
                {selectedOrder.images.length > 0 && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Obrázky</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedOrder.images.map((url, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={url}
                            alt={`Obrázek ${i + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-white/5"
                          />
                          <a
                            href={url}
                            download
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                          >
                            <span className="text-white text-xs font-black">Stáhnout</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language */}
                {selectedOrder.language && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Jazyk webu</label>
                    <p className="text-white text-sm uppercase">{selectedOrder.language}</p>
                  </div>
                )}

                {/* Colors */}
                {(selectedOrder.primary_color || selectedOrder.secondary_color) && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Zvolené barvy</label>
                    <div className="flex gap-3">
                      {selectedOrder.primary_color && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg border border-white/10"
                            style={{ backgroundColor: selectedOrder.primary_color }}
                          />
                          <span className="text-white text-sm">{selectedOrder.primary_color}</span>
                        </div>
                      )}
                      {selectedOrder.secondary_color && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg border border-white/10"
                            style={{ backgroundColor: selectedOrder.secondary_color }}
                          />
                          <span className="text-white text-sm">{selectedOrder.secondary_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social URLs */}
                {(selectedOrder.facebook_url || selectedOrder.instagram_url || selectedOrder.google_maps_url) && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">URL na sociální sítě</label>
                    <div className="space-y-2">
                      {selectedOrder.facebook_url && (
                        <div>
                          <a
                            href={selectedOrder.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline break-all"
                          >
                            Facebook: {selectedOrder.facebook_url}
                          </a>
                        </div>
                      )}
                      {selectedOrder.instagram_url && (
                        <div>
                          <a
                            href={selectedOrder.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline break-all"
                          >
                            Instagram: {selectedOrder.instagram_url}
                          </a>
                        </div>
                      )}
                      {selectedOrder.google_maps_url && (
                        <div>
                          <a
                            href={selectedOrder.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand text-sm hover:underline break-all"
                          >
                            Google Maps: {selectedOrder.google_maps_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Created At */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-zinc-600 text-xs">
                    Vytvořeno: {new Date(selectedOrder.created_at).toLocaleString('cs-CZ')}
                  </p>
                </div>

                {/* Delete/Restore Actions */}
                <div className="pt-4 border-t border-white/5">
                  {selectedOrder.deleted_at ? (
                    <button
                      onClick={() => handleRestore(selectedOrder.id)}
                      className="w-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500/30 transition-all"
                    >
                      Obnovit z koše
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(selectedOrder.id, false)}
                        className="flex-1 bg-red-500/20 text-red-300 border border-red-500/30 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-500/30 transition-all"
                      >
                        Smazat
                      </button>
                      <button
                        onClick={() => handleDelete(selectedOrder.id, true)}
                        className="bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-500/30 transition-all px-6"
                      >
                        Trvale smazat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
