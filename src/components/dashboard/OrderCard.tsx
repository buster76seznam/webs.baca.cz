'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Camera, Wrench, ChevronDown, AlertTriangle, Palette, Share2, Languages } from 'lucide-react';
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
  const [notes, setNotes] = useState(order.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  // Debug: log order data
  console.log('Order data:', order);
  console.log('Order fields:', {
    phone: order.phone,
    email: order.email,
    address: order.address,
    website_url: order.website_url,
    services: order.services,
    primary_color: order.primary_color,
    secondary_color: order.secondary_color,
    language: order.language,
    facebook_url: order.facebook_url,
    instagram_url: order.instagram_url,
    google_maps_url: order.google_maps_url,
    images: order.images,
    owner_name: order.owner_name,
    owner_phone: order.owner_phone,
    owner_email: order.owner_email,
    advantage: order.advantage,
    price_list: order.price_list,
    working_hours: order.working_hours,
    notes: order.notes,
    deleted_at: order.deleted_at,
  });

  const isUrgent =
    order.status === 'čeká' &&
    order.status_updated_at &&
    daysSince(order.status_updated_at) >= 14;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    alert(`Changing status to: ${newStatus}`);
    console.log('Changing status:', order.id, newStatus);
    setUpdating(true);
    setStatusOpen(false);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, developer_id: viewerUserId }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Error updating status:', data);
        alert(`Error updating status: ${JSON.stringify(data)}`);
      } else {
        console.log('Status updated successfully');
        alert('Status updated successfully');
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error updating status: ${error}`);
    }
    setUpdating(false);
  };

  const handleNotesSave = async () => {
    console.log('Saving notes:', order.id, notes);
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Error saving notes:', data);
      } else {
        console.log('Notes saved successfully');
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
    setSavingNotes(false);
  };

  const handleDelete = async (permanent = false) => {
    if (!confirm(permanent ? 'Opravdu chcete trvale smazat tuto objedn├ívku? Tato akce je nevratn├í.' : 'Opravdu chcete p┼Öesunout tuto objedn├ívku do ko┼íe?')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permanent }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Error deleting order:', data);
        alert(`Chyba p┼Öi maz├ín├ş: ${data.error}`);
      } else {
        alert(permanent ? 'Objedn├ívka byla trvale smaz├ína.' : 'Objedn├ívka byla p┼Öesunuta do ko┼íe.');
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Chyba p┼Öi maz├ín├ş objedn├ívky.');
    }
  };

  const handleRestore = async () => {
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error('Error restoring order:', data);
        alert(`Chyba p┼Öi obnov─Ť: ${data.error}`);
      } else {
        alert('Objedn├ívka byla obnovena z ko┼íe.');
        onUpdate();
      }
    } catch (error) {
      console.error('Error restoring order:', error);
      alert('Chyba p┼Öi obnov─Ť objedn├ívky.');
    }
  };

  const statusColor = STATUS_COLORS[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-none border transition-all duration-500 overflow-hidden
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
            ─îek├í na podklady ji┼ż {daysSince(order.status_updated_at)} dn├ş ÔÇö kontaktuj klienta s upom├şnkou!
          </p>
        </div>
      )}

      {/* Card header */}
      <div className="p-6 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="text-lg font-black tracking-tight truncate">{order.company_name}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1 rounded-none">
              {order.industry}
            </span>
          </div>
          <p className="text-zinc-600 text-xs font-bold">
            Zad├íno {new Date(order.created_at).toLocaleDateString('cs-CZ')}
            {order.sales_user && ` ÔÇó ${order.sales_user.username}`}
          </p>
        </div>

        {/* Status badge / dropdown */}
        <div className="relative shrink-0">
          {canChangeOrderStatus(viewerRole) ? (
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              disabled={updating}
              className={`flex items-center gap-2 px-4 py-2 rounded-none border text-xs font-black uppercase tracking-wider transition-all duration-300 ${statusColor}`}
            >
              {updating ? '...' : order.status}
              <ChevronDown size={12} className={`transition-transform duration-300 ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <span className={`px-4 py-2 rounded-none border text-xs font-black uppercase tracking-wider ${statusColor}`}>
              {order.status}
            </span>
          )}

          {statusOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/10 rounded-none overflow-hidden shadow-2xl z-50">
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors
                    ${order.status === s ? 'text-[#7C3AED]' : 'text-zinc-300'}`}
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
          <span className="text-xs font-bold">{order.phone || 'Nen├ş uvedeno'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <Mail size={14} className="shrink-0" />
          <span className="text-xs font-bold truncate">{order.email || 'Nen├ş uvedeno'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <MapPin size={14} className="shrink-0" />
          <span className="text-xs font-bold truncate">{order.address || 'Nen├ş uvedeno'}</span>
        </div>
      </div>

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-[#7C3AED] hover:bg-white/[0.02] transition-all"
      >
        {expanded ? 'Zav┼Ö├şt detaily' : 'Zobrazit detaily projektu'}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="p-6 bg-black/40 space-y-6 border-t border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#7C3AED]">
              <Wrench size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Slu┼żby a zam─Ť┼Öen├ş</span>
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
                {order.has_photos ? 'K dispozici' : 'Nem├í / zajist├şme'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-zinc-500">
                <Globe size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Dom├ęna</span>
              </div>
              <span className="text-xs font-bold text-zinc-300">{order.website_url}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Cen├şk na webu</div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-none bg-white/5 border border-white/10 text-zinc-300">
              {order.pricing_type === 'doda' ? 'Dod├í klient' : 'Dle domluvy (1700 pau┼í├íl)'}
            </span>
          </div>

          {/* Design section */}
          {(order.primary_color || order.secondary_color || order.language) && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#7C3AED]">
                <Palette size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Design</span>
              </div>
              <div className="space-y-2">
                {order.primary_color && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: order.primary_color }} />
                    <span className="text-xs text-zinc-400">Prim├írn├ş barva</span>
                  </div>
                )}
                {order.secondary_color && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: order.secondary_color }} />
                    <span className="text-xs text-zinc-400">Sekund├írn├ş barva</span>
                  </div>
                )}
                {order.language && (
                  <div className="flex items-center gap-3">
                    <Languages size={16} className="text-zinc-500" />
                    <span className="text-xs text-zinc-400">Jazyk: {order.language.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Images section */}
          {order.images && order.images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#7C3AED]">
                <Camera size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Nahran├ę obr├ízky</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {order.images.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-white/5 border border-white/10 rounded overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <img src={url} alt={`Obr├ízek ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social media section */}
          {(order.facebook_url || order.instagram_url || order.google_maps_url) && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#7C3AED]">
                <Share2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Soci├íln├ş s├şt─Ť</span>
              </div>
              <div className="space-y-2">
                {order.facebook_url && (
                  <a
                    href={order.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {order.instagram_url && (
                  <a
                    href={order.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {order.google_maps_url && (
                  <a
                    href={order.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Google Maps
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Owner section */}
          {(order.owner_name || order.owner_phone || order.owner_email) && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Majitel/Jednatel</div>
              <div className="space-y-1">
                {order.owner_name && <p className="text-xs text-zinc-300">{order.owner_name}</p>}
                {order.owner_phone && <p className="text-xs text-zinc-400">{order.owner_phone}</p>}
                {order.owner_email && <p className="text-xs text-zinc-400">{order.owner_email}</p>}
              </div>
            </div>
          )}

          {/* Additional info */}
          {(order.advantage || order.price_list || order.working_hours) && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Dal┼í├ş informace</div>
              <div className="space-y-2">
                {order.advantage && (
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 mb-1">V├Żhoda oproti konkurenci</div>
                    <p className="text-xs text-zinc-300">{order.advantage}</p>
                  </div>
                )}
                {order.price_list && (
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 mb-1">Cen├şk</div>
                    <p className="text-xs text-zinc-300 whitespace-pre-wrap">{order.price_list}</p>
                  </div>
                )}
                {order.working_hours && (
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 mb-1">Pracovn├ş doba</div>
                    <p className="text-xs text-zinc-300">{order.working_hours}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes section */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Pozn├ímky</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesSave}
              disabled={savingNotes}
              placeholder="P┼Öidejte pozn├ímku..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 resize-none h-20"
            />
            {savingNotes && (
              <p className="text-[10px] text-zinc-500 mt-1">Ukl├íd├ím...</p>
            )}
          </div>

          {/* Delete/Restore section */}
          <div className="flex gap-2 pt-4 border-t border-white/5">
            {order.deleted_at ? (
              <button
                onClick={handleRestore}
                className="flex-1 py-2 px-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-black uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
              >
                Obnovit z ko┼íe
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleDelete(false)}
                  className="flex-1 py-2 px-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs font-black uppercase tracking-wider hover:bg-red-500/30 transition-colors"
                >
                  Smazat
                </button>
                <button
                  onClick={() => handleDelete(true)}
                  className="py-2 px-4 bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 rounded text-xs font-black uppercase tracking-wider hover:bg-zinc-500/30 transition-colors"
                >
                  Trvale smazat
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
