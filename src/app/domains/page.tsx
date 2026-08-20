'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { Order } from '@/types';
import { CheckCircle, XCircle, Globe, Building2, Loader2, Lock } from 'lucide-react';

export default function DomainsManagementPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const REQUIRED_PASSWORD = 'Filip_23.2010';

  useEffect(() => {
    const saved = localStorage.getItem('domains_auth');
    if (saved === REQUIRED_PASSWORD) {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('domains_auth', password);
      setError(null);
      fetchOrders();
    } else {
      setError('Nesprávné heslo');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending_domain')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setOrders(data || []);
    } catch (err: any) {
      setError('Chyba při načítání objednávek');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainBought = async (order: Order) => {
    setActionLoading(order.id);
    try {
      const response = await fetch('/api/domains/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          action: 'bought',
          password: REQUIRED_PASSWORD
        }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (err) {
      setError('Chyba při aktualizaci');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDomainUnavailable = async (order: Order) => {
    setActionLoading(order.id);
    try {
      const response = await fetch('/api/domains/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          action: 'unavailable',
          password: REQUIRED_PASSWORD
        }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (err) {
      setError('Chyba při aktualizaci');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Domain Management</h1>
            <p className="text-slate-400 text-center mt-2">Zadejte heslo pro přístup do interní sekce</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
            {error && <p className="text-rose-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Přihlásit se
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Správa domén</h1>
            <p className="text-slate-400 mt-1">Přehled objednávek čekajících na registraci domény</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Obnovit'}
          </button>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Načítám objednávky...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold">Vše vyřízeno!</h3>
            <p className="text-slate-400 mt-2">Momentálně nejsou žádné objednávky čekající na doménu.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{order.company_name}</h3>
                      <p className="text-slate-400 text-sm">ID: {order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-3 py-1.5 rounded-full w-fit border border-emerald-400/20">
                    <Globe className="w-4 h-4" />
                    <span className="font-mono font-medium">{order.domain}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDomainBought(order)}
                    disabled={!!actionLoading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/20"
                  >
                    {actionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Doména koupena
                  </button>
                  
                  <button
                    onClick={() => handleDomainUnavailable(order)}
                    disabled={!!actionLoading}
                    className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 px-5 py-2.5 rounded-xl font-semibold transition-all"
                  >
                    {actionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Doména nedostupná
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
