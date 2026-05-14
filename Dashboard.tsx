'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, RefreshCw, Package } from 'lucide-react';
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
                <Image src="/Logo.jpg" alt="Logo" fill className="object-cover" onError={() => setLogoError(true)} />
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
              <span className="text-xs font-bold text-zinc-400">{username}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1 rounded-full">
                {role}
              </span>
            </div>

            <button
              onClick={fetchOrders}
              disabled={refreshing}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Obnovit"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#7C3AED]' : 'text-zinc-500'} />
            </button>

            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all duration-300"
              title="Odhlásit se"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {isSales ? 'Moje objednávky' : 'Přehled zadání'}
            </h1>
            <p className="text-zinc-600 text-sm mt-1">
              {isSales
                ? 'Přidávej objednávky a sleduj jejich stav'
                : 'Všechna zadání od obchodních zástupců'}
            </p>
          </div>

          {isSales && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewOrder(true)}
              className="flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-[#5B21B6] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]"
            >
              <Plus size={16} />
              Přidat
            </motion.button>
          )}
        </div>

        <StatsPanel orders={orders} role={role} userId={userId} />

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-xl font-black mb-3 tracking-tight">
              {isSales ? 'Zatím žádné objednávky' : 'Žádná zadání'}
            </h3>
            <p className="text-zinc-600 text-sm">
              {isSales ? 'Klikni na "Přidat" a vytvoř první objednávku.' : 'Obchodní zástupci ještě nic nezadali.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                viewerRole={role}
                viewerUserId={userId}
                onUpdate={fetchOrders}
              />
            ))}
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
