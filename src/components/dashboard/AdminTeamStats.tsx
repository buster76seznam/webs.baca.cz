'use client';

import { useMemo } from 'react';
import { BarChart3, Package, CheckCircle } from 'lucide-react';
import { Order, AgenturaUser } from '@/types';

type AdminTeamStatsProps = {
  orders: Order[];
  users: AgenturaUser[];
};

function thisMonthCount(orders: Order[]) {
  const now = new Date();
  return orders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export default function AdminTeamStats({ orders, users }: AdminTeamStatsProps) {
  const byUser = useMemo(() => {
    return users
      .filter(u => u.role !== 'Správce')
      .map(u => {
        const userOrders =
          u.role === 'Obchodní zástupce'
            ? orders.filter(o => o.sales_user_id === u.id)
            : orders;
        const paid = userOrders.filter(o => o.status === 'Platí').length;
        return {
          user: u,
          total: userOrders.length,
          month: thisMonthCount(userOrders),
          paid,
        };
      });
  }, [orders, users]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black uppercase italic tracking-tight mb-2">Statistiky týmu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {byUser.map(({ user, total, month, paid }) => (
          <div
            key={user.id}
            className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="mb-4">
              <p className="font-black text-white">{user.username}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{user.role}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-[#7C3AED]/10">
                <Package size={16} className="mx-auto mb-1 text-[#A78BFA]" />
                <p className="text-lg font-black">{total}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">Celkem</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-500/10">
                <BarChart3 size={16} className="mx-auto mb-1 text-blue-400" />
                <p className="text-lg font-black">{month}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">Měsíc</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/10">
                <CheckCircle size={16} className="mx-auto mb-1 text-emerald-400" />
                <p className="text-lg font-black">{paid}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">Platí</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
