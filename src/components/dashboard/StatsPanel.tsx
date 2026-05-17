'use client';

import { useMemo } from 'react';
import { BarChart3, Clock, CheckCircle, Package } from 'lucide-react';
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
    return orders;
  }, [orders, role, userId]);

  const monthOrders = useMemo(() => thisMonthOrders(myOrders), [myOrders]);
  const monthPaid = useMemo(() => monthOrders.filter(o => o.status === 'Platí'), [monthOrders]);
  const avgDays = useMemo(() => avgDaysToComplete(myOrders), [myOrders]);

  const statCards = role === 'Vývojář' || role === 'Správce'
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
          icon: Clock,
          label: 'Měsíční cíl',
          value: `${monthOrders.length}/10`,
          sub: 'nových zadání',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
        },
      ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {statCards.map((card, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all duration-500">
          <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${card.color}`}>
            <card.icon size={80} />
          </div>
          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4 ${card.color}`}>
            <card.icon size={20} />
          </div>
          <div className="text-2xl font-black mb-1">{card.value}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{card.label}</div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
