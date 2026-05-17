'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Camera, Wrench, ChevronDown, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES, STATUS_COLORS, Role } from '@/types';
import { canChangeOrderStatus } from '@/lib/roles';
import { supabase } from '@/lib/supabase';

interface OrderCardProps {
  order: Order;
  viewerRole: Role;
  viewerUserId: string;
  onUpdate: () => void;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function OrderCard({ order, viewerRole, viewerUserId, onUpdate }: OrderCardProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isUrgent =
    order.status === 'Čekám na podklady' &&
    daysSince(order.status_updated_at) >= 14;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true);
    setStatusOpen(false);
    await supabase
      .from('orders')
      .update({
        status: newStatus,
        status_updated_at: new Date().toISOString(),
        developer_id: viewerUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);
    setUpdating(false);
    onUpdate();
  };

  const statusColor = STATUS_COLORS[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border transition-all duration-500 overflow-hidden
        ${isUrgent
          ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]'
          : 'border-white/5 bg-[#0A0A0A]'
        }`}
    >
      {/* Urgent banner */}
      {isUrgent && (
        <div className="flex items-center gap-3 px-6 py-3 bg-amber-500/10 border-b border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs font-black uppercase tracking-wider">
            Čeká na podklady již {daysSince(order.status_updated_at)} dní — kontaktuj klienta s upomínkou!
          </p>
        </div>
      )}

      {/* Card header */}
      <div className="p-6 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="text-lg font-black tracking-tight truncate">{order.company_name}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1 rounded-full">
              {order.industry}
            </span>
          </div>
          <p className="text-zinc-600 text-xs font-bold">
            Zadáno {new Date(order.created_at).toLocaleDateString('cs-CZ')}
            {order.sales_user && ` • ${order.sales_user.username}`}
          </p>
        </div>

        {/* Status badge / dropdown */}
        <div className="relative shrink-0">
          {canChangeOrderStatus(viewerRole) ? (
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              disabled={updating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-300 ${statusColor}`}
            >
              {updating ? '...' : order.status}
              <ChevronDown size={12} className={`transition-transform duration-300 ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <span className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider ${statusColor}`}>
              {order.status}
            </span>
          )}

          {statusOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors
                    ${order.status === s ? 'text-[#7C3AED]' : 'text-zinc-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Basic contact info */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-center gap-3 text-zinc-400">
          <Phone size={14} className="shrink-0" />
          <span className="text-xs font-bold">{order.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <Mail size={14} className="shrink-0" />
          <span className="text-xs font-bold truncate">{order.email}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <MapPin size={14} className="shrink-0" />
          <span className="text-xs font-bold truncate">{order.address}</span>
        </div>
      </div>

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-[#7C3AED] hover:bg-white/[0.02] transition-all"
      >
        {expanded ? 'Zavřít detaily' : 'Zobrazit detaily projektu'}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="p-6 bg-black/40 space-y-6 border-t border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#7C3AED]">
              <Wrench size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Služby a zaměření</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{order.services}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-zinc-500">
                <Camera size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Fotky</span>
              </div>
              <span className={`text-xs font-bold ${order.has_photos ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {order.has_photos ? 'K dispozici' : 'Nemá / zajistíme'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-zinc-500">
                <Globe size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Doména</span>
              </div>
              <span className="text-xs font-bold text-zinc-300">{order.website_url}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Ceník na webu</div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
              {order.pricing_type === 'doda' ? 'Dodá klient' : 'Dle domluvy (1700 paušál)'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
