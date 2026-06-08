'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, Clock, CheckCircle, X, LogOut } from 'lucide-react';

const CORRECT_PASSWORD = 'Kx9Pm2Qz7R';

interface Order {
  id: string;
  company_name: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  industry: string;
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  domain: string;
  description: string;
  advantage: string;
  price_list: string | null;
  working_hours: string;
  status: 'čeká' | 'vývoj' | 'dokončená';
  images: string[];
  created_at: string;
}

export default function ProgramPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'čeká' | 'vývoj' | 'dokončená'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('program_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('program_authenticated', 'true');
      setError('');
      fetchOrders();
    } else {
      setError('Nesprávné heslo');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('program_authenticated');
    setPassword('');
    setOrders([]);
  };

  const handleStatusChange = async (orderId: string, newStatus: 'čeká' | 'vývoj' | 'dokončená') => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-6">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12 max-w-md w-full">
          <h1 className="text-2xl font-black mb-2 tracking-tight uppercase">Program</h1>
          <p className="text-zinc-500 text-sm mb-8">Zadejte heslo pro přístup</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm mb-4"
            />
            {error && (
              <p className="text-red-400 text-sm font-bold mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)]"
            >
              Otevřít
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black uppercase tracking-tight">Objednávky</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold"
          >
            <LogOut size={16} />
            Odhlásit
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hledat podle názvu podniku..."
              className="w-full bg-white/[0.03] border border-white/8 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
          >
            <option value="all">Všechny statusy</option>
            <option value="čeká">Čeká</option>
            <option value="vývoj">Vývoj</option>
            <option value="dokončená">Dokončená</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-zinc-500 mt-4">Načítání...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Žádné objednávky</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-brand/20 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black">{order.company_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        order.status === 'čeká' ? 'bg-amber-500/10 text-amber-400' :
                        order.status === 'vývoj' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm mb-2">{order.industry}</p>
                    <p className="text-zinc-600 text-xs">{new Date(order.created_at).toLocaleDateString('cs-CZ')}</p>
                  </div>
                  {order.images.length > 0 && (
                    <div className="flex items-center gap-2 text-zinc-500">
                      <ImageIcon size={16} />
                      <span className="text-xs">{order.images.length}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-white/5 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/5 p-6 flex items-center justify-between">
                <h2 className="text-xl font-black">{selectedOrder.company_name}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                    className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#7C3AED]/60 transition-all duration-300 text-sm"
                  >
                    <option value="čeká">Čeká</option>
                    <option value="vývoj">Vývoj</option>
                    <option value="dokončená">Dokončená</option>
                  </select>
                </div>

                {/* Company Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Telefon</label>
                    <p className="text-white">{selectedOrder.company_phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Email</label>
                    <p className="text-white">{selectedOrder.company_email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Adresa</label>
                  <p className="text-white">{selectedOrder.company_address}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Obor</label>
                  <p className="text-white">{selectedOrder.industry}</p>
                </div>

                {/* Owner Info */}
                {(selectedOrder.owner_name || selectedOrder.owner_phone || selectedOrder.owner_email) && (
                  <div className="bg-white/[0.02] rounded-2xl p-4">
                    <h3 className="text-sm font-black mb-3 text-brand uppercase tracking-wider">Majitel/Jednatel</h3>
                    <div className="space-y-2">
                      {selectedOrder.owner_name && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Jméno</label>
                          <p className="text-white text-sm">{selectedOrder.owner_name}</p>
                        </div>
                      )}
                      {selectedOrder.owner_phone && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Telefon</label>
                          <p className="text-white text-sm">{selectedOrder.owner_phone}</p>
                        </div>
                      )}
                      {selectedOrder.owner_email && (
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Email</label>
                          <p className="text-white text-sm">{selectedOrder.owner_email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Domain */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Doména</label>
                  <p className="text-white">{selectedOrder.domain}</p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Co dělají</label>
                  <p className="text-white text-sm leading-relaxed">{selectedOrder.description}</p>
                </div>

                {/* Advantage */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Výhoda oproti konkurenci</label>
                  <p className="text-white text-sm leading-relaxed">{selectedOrder.advantage}</p>
                </div>

                {/* Price List */}
                {selectedOrder.price_list && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Ceník</label>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-line">{selectedOrder.price_list}</p>
                  </div>
                )}

                {/* Working Hours */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Pracovní doba</label>
                  <p className="text-white">{selectedOrder.working_hours}</p>
                </div>

                {/* Images */}
                {selectedOrder.images.length > 0 && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Obrázky</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedOrder.images.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Obrázek ${i + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-white/5"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Created At */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-zinc-600 text-xs">
                    Vytvořeno: {new Date(selectedOrder.created_at).toLocaleString('cs-CZ')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
