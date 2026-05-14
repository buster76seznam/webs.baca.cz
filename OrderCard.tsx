'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Camera, Wrench, ChevronDown, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES, STATUS_COLORS } from '../types';
import { supabase } from '@/lib/supabase';

interface OrderCardProps {
  order: Order;
  viewerRole: 'Obchodní zástupce' | 'Vývojář';
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
          {viewerRole === 'Vývojář' ? (
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
            <div className="absolute right-0 top-full mt-2 z-20 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[200px]">
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-5 py-3 text-xs font-black uppercase tracking-wider transition-colors
                    ${s === order.status ? 'text-[#A78BFA] bg-[#7C3AED]/10' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick info row */}
      <div className="px-6 pb-4 flex flex-wrap gap-4 text-xs text-zinc-500 font-medium">
        <span className="flex items-center gap-1.5"><Phone size={11} />{order.phone}</span>
        <span className="flex items-center gap-1.5"><Mail size={11} />{order.email}</span>
        <span className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" />{order.address}</span>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors flex items-center justify-center gap-2"
      >
        {expanded ? 'Skrýt detaily' : 'Zobrazit detaily'}
        <ChevronDown size={10} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6 border-t border-white/5 pt-5 grid sm:grid-cols-2 gap-5"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-1"><Camera size={10} />Fotky</p>
            <p className="text-sm font-bold text-white">{order.has_photos ? 'Ano' : 'Ne'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-1"><Globe size={10} />Adresa webu</p>
            <p className="text-sm font-bold text-white">{order.website_url || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-1"><Wrench size={10} />Služby</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{order.services || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Ceník</p>
            <p className="text-sm font-bold text-white">{order.pricing_type === 'dle_domluvy' ? 'Dle domluvy' : order.pricing_type === 'doda' ? 'Dodá' : '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Stav aktualizován</p>
            <p className="text-sm font-bold text-white">{new Date(order.status_updated_at).toLocaleDateString('cs-CZ')}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
