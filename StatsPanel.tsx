'use client';

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Package, AlertTriangle } from 'lucide-react';
import { Order, Role } from '@/types';

interface StatsPanelProps {
  orders: Order[];
  role: Role;
  userId: string;
}

function avgDaysToComplete(orders: Order[]): string {
  const completed = orders.filter(o => o.status === 'Platí');
  if (!completed.length) return '—';
  const total = completed.reduce((sum, o) => {
    const created = new Date(o.created_at).getTime();
    const updated = new Date(o.status_updated_at).getTime();
    return sum + (updated - created) / (1000 * 60 * 60 * 24);
  }, 0);
  return `${Math.round(total / completed.length)} dní`;
}

function thisMonthOrders(orders: Order[]): Order[] {
  const now = new Date();
  return orders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export default function StatsPanel({ orders, role, userId }: StatsPanelProps) {
  const myOrders = useMemo(() => {
    if (role === 'Obchodní zástupce') {
      return orders.filter(o => o.sales_user_id === userId);
    }
    return orders; // Vývojář vidí vše
  }, [orders, role, userId]);

  const monthOrders = useMemo(() => thisMonthOrders(myOrders), [myOrders]);
  const monthPaid = useMemo(() => monthOrders.filter(o => o.status === 'Platí'), [monthOrders]);
  const waitingPodklady = useMemo(() => myOrders.filter(o => o.status === 'Čekám na podklady'), [myOrders]);
  const avgDays = useMemo(() => avgDaysToComplete(myOrders), [myOrders]);

  const statCards = role === 'Vývojář'
    ? [
        {
          icon: Package,
          label: 'Celkem zadání',
          value: myOrders.length.toString(),
          sub: 'všechna zadání',
          color: 'text-[#A78BFA]',
          bg: 'bg-[#7C3AED]/10',
        },
        {
          icon: BarChart3,
          label: 'Tento měsíc',
          value: monthOrders.length.toString(),
          sub: 'nových objednávek',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
        },
        {
          icon: CheckCircle,
          label: 'Platí tento měsíc',
          value: monthPaid.length.toString(),
          sub: 'dokončených webů',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
        },
        {
          icon: Clock,
          label: 'Průměrná doba',
          value: avgDays,
          sub: 'od zadání do „Platí"',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
        },
      ]
    : [
        {
          icon: Package,
          label: 'Moje objednávky',
          value: myOrders.length.toString(),
          sub: 'celkem zadáno',
          color: 'text-[#A78BFA]',
          bg: 'bg-[#7C3AED]/10',
        },
        {
          icon: BarChart3,
          label: 'Tento měsíc',
          value: monthOrders.length.toString(),
          sub: 'nových objednávek',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
        },
        {
          icon: CheckCircle,
          label: 'Platí',
          value: myOrders.filter(o => o.status === 'Platí').length.toString(),
          sub: 'dokončených webů',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
        },
        {
          icon: TrendingUp,
          label: 'Průměrná rychlost',
          value: avgDays,
          sub: 'od zadání do splnění',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
        },
      ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className={`text-3xl font-black tracking-tight mb-1 ${card.color}`}>{card.value}</div>
            <div className="text-xs font-black uppercase tracking-widest text-zinc-400">{card.label}</div>
            <div className="text-[10px] text-zinc-600 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Urgent alert summary */}
      {waitingPodklady.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs font-bold">
            {waitingPodklady.length === 1
              ? '1 objednávka čeká na podklady'
              : `${waitingPodklady.length} objednávky čekají na podklady`}
            {' '}— zkontroluj karty níže.
          </p>
        </div>
      )}
    </div>
  );
}
