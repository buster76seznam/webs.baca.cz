'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, LogOut, RefreshCw, Package } from 'lucide-react';
import { useAgenturaPresence } from '@/hooks/useAgenturaPresence';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Order, Role } from '@/types';
import OrderCard from './OrderCard';
import NewOrderModal from './NewOrderModal';
import StatsPanel from './StatsPanel';

interface DashboardProps {
  userId: string;
  username: string;
  role: Role;
  onLogout: () => void;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard({ userId, username, role, onLogout }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useAgenturaPresence(userId);

  const fetchOrders = useCallback(async () => {
    setRefreshing(true);

    let query = supabase
      .from('orders')
      .select('*, sales_user:agentura_users!orders_sales_user_id_fkey(username)')
      .order('created_at', { ascending: false });

    if (role === 'Obchodní zástupce') {
      query = query.eq('sales_user_id', userId);
    }

    const { data, error } = await query;

    if (!error && data) {
      const sorted = [...data].sort((a, b) => {
        const aUrgent = a.status === 'Čekám na podklady' && daysSince(a.status_updated_at) >= 14;
        const bUrgent = b.status === 'Čekám na podklady' && daysSince(b.status_updated_at) >= 14;
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        return 0;
      });
      setOrders(sorted as Order[]);
    }

    setLoading(false);
    setRefreshing(false);
  }, [role, userId]);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  const isSales = role === 'Obchodní zástupce';

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05),transparent_60%)] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-[#7C3AED]/40">
              {!logoError ? (
                <Image src="/Logo.png" alt="Webs Bača" fill className="object-contain p-1 bg-[#1a0b2e]" onError={() => setLogoError(true)} />
              ) : (
                <div className="w-full h-full bg-[#7C3AED] flex items-center justify-center">
                  <span className="text-white font-black text-sm">W</span>
                </div>
              )}
            </div>
            <div>
              <span className="font-black text-sm tracking-tight uppercase">Webs Bača</span>
              <span className="text-zinc-600 text-xs ml-2">/ Interní portál</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{username}</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter leading-none">{role}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 text-zinc-400 hover:text-white"
              title="Odhlásit se"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <StatsPanel orders={orders} role={role} userId={userId} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight mb-1 uppercase italic">Správa objednávek</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {loading ? 'Načítám data...' : `Celkem ${orders.length} záznamů`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOrders()}
              className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white transition-all duration-500
                ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} />
            </button>
            {isSales && (
              <button
                onClick={() => setShowNewOrder(true)}
                className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-500 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(124,58,237,0.5)] active:scale-95"
              >
                <Plus size={18} />
                Nové zadání
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-700">
            <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Načítám databázi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                viewerRole={role}
                viewerUserId={userId}
                onUpdate={fetchOrders}
              />
            ))}
            {orders.length === 0 && (
              <div className="col-span-full py-32 rounded-[3rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
                <Package size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest italic">Zatím žádné objednávky</p>
              </div>
            )}
          </div>
        )}
      </main>

      {showNewOrder && (
        <NewOrderModal
          salesUserId={userId}
          onClose={() => setShowNewOrder(false)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
