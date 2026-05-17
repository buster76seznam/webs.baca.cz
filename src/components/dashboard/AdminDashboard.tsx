'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, LogOut, RefreshCw, Package, LayoutGrid, Users, UserCog, Briefcase, Code2 } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Order, AgenturaUser } from '@/types';
import { useAgenturaPresence } from '@/hooks/useAgenturaPresence';
import OrderCard from './OrderCard';
import NewOrderModal from './NewOrderModal';
import StatsPanel from './StatsPanel';
import OnlineUsersBar from './OnlineUsersBar';
import UserManagementPanel from './UserManagementPanel';
import AdminTeamStats from './AdminTeamStats';

type AdminTab = 'overview' | 'sales' | 'developer' | 'team' | 'users';

interface AdminDashboardProps {
  userId: string;
  username: string;
  onLogout: () => void;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

const TABS: { id: AdminTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Přehled', icon: LayoutGrid },
  { id: 'sales', label: 'Jako obchodní', icon: Briefcase },
  { id: 'developer', label: 'Jako vývojář', icon: Code2 },
  { id: 'team', label: 'Statistiky týmu', icon: Users },
  { id: 'users', label: 'Uživatelé', icon: UserCog },
];

export default function AdminDashboard({ userId, username, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [teamUsers, setTeamUsers] = useState<AgenturaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState<string>('');

  useAgenturaPresence(userId);

  const salesUsers = teamUsers.filter(u => u.role === 'Obchodní zástupce');

  const fetchTeamUsers = useCallback(async () => {
    const { data } = await supabase.from('agentura_users').select('*').order('username');
    if (data) {
      const list = data as AgenturaUser[];
      setTeamUsers(list);
      const sales = list.filter(u => u.role === 'Obchodní zástupce');
      if (sales.length) setSelectedSalesId(prev => prev || sales[0].id);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setRefreshing(true);

    let query = supabase
      .from('orders')
      .select('*, sales_user:agentura_users!orders_sales_user_id_fkey(username)')
      .order('created_at', { ascending: false });

    if (tab === 'sales' && selectedSalesId) {
      query = query.eq('sales_user_id', selectedSalesId);
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
  }, [tab, selectedSalesId]);

  useEffect(() => {
    void fetchTeamUsers();
  }, [fetchTeamUsers]);

  useEffect(() => {
    if (tab === 'users') {
      setLoading(false);
      return;
    }
    if (tab === 'team') {
      setLoading(true);
      void (async () => {
        const { data } = await supabase
          .from('orders')
          .select('*, sales_user:agentura_users!orders_sales_user_id_fkey(username)');
        if (data) setOrders(data as Order[]);
        setLoading(false);
      })();
      return;
    }

    setLoading(true);
    void fetchOrders();

    const channel = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        void fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, tab]);

  const canEditStatus = tab === 'overview' || tab === 'developer';
  const showCreateOrder = tab === 'sales' && !!selectedSalesId;
  const createOrderAsUserId = selectedSalesId;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05),transparent_60%)] pointer-events-none" />

      <nav className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-[#7C3AED]/40">
              {!logoError ? (
                <Image
                  src="/Logo.png"
                  alt="Webs Bača"
                  fill
                  className="object-contain p-1 bg-[#1a0b2e]"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-[#7C3AED] flex items-center justify-center">
                  <span className="text-white font-black text-sm">W</span>
                </div>
              )}
            </div>
            <div>
              <span className="font-black text-sm tracking-tight uppercase">Webs Bača</span>
              <span className="text-amber-400/90 text-xs ml-2 font-black">/ Správce</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{username}</span>
                <span className="text-[9px] font-bold text-amber-400/80 uppercase tracking-tighter leading-none">
                  Správce
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-zinc-400 hover:text-white"
              title="Odhlásit se"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <OnlineUsersBar currentUserId={userId} />

        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                ${tab === id
                  ? 'bg-[#7C3AED] text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.5)]'
                  : 'bg-white/[0.03] border border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'users' && <UserManagementPanel currentUserId={userId} />}

        {tab === 'team' && (
          loading ? (
            <p className="text-center py-20 text-zinc-600 text-xs font-bold uppercase tracking-widest">Načítám…</p>
          ) : (
            <AdminTeamStats orders={orders} users={teamUsers} />
          )
        )}

        {(tab === 'overview' || tab === 'sales' || tab === 'developer') && (
          <>
            {(tab === 'overview' || tab === 'developer') && (
              <StatsPanel orders={orders} role="Vývojář" userId={userId} />
            )}
            {tab === 'sales' && selectedSalesId && (
              <StatsPanel orders={orders} role="Obchodní zástupce" userId={selectedSalesId} />
            )}

            {tab === 'sales' && (
              <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
                  Zobrazit jako obchodní zástupce
                </label>
                <select
                  value={selectedSalesId}
                  onChange={e => setSelectedSalesId(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white"
                >
                  {salesUsers.map(u => (
                    <option key={u.id} value={u.id} className="bg-[#111]">
                      {u.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black tracking-tight mb-1 uppercase italic">
                  {tab === 'overview' && 'Celkový přehled'}
                  {tab === 'sales' && 'Pohled obchodního zástupce'}
                  {tab === 'developer' && 'Pohled vývojáře'}
                </h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  {loading ? 'Načítám…' : `${orders.length} záznamů`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void fetchOrders()}
                  className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white ${refreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw size={18} />
                </button>
                {showCreateOrder && createOrderAsUserId && (
                  <button
                    type="button"
                    onClick={() => setShowNewOrder(true)}
                    className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider"
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
                <p className="text-xs font-black uppercase tracking-[0.3em]">Načítám databázi…</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    viewerRole={canEditStatus ? 'Vývojář' : 'Obchodní zástupce'}
                    viewerUserId={userId}
                    onUpdate={fetchOrders}
                  />
                ))}
                {orders.length === 0 && (
                  <div className="col-span-full py-32 rounded-[3rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest italic">Žádné záznamy</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {showNewOrder && createOrderAsUserId && (
        <NewOrderModal
          salesUserId={createOrderAsUserId}
          onClose={() => setShowNewOrder(false)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
