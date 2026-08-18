'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Phone, Mail, MapPin, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PricingType } from '@/types';

interface NewOrderModalProps {
  salesUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewOrderModal({ salesUserId, onClose, onSuccess }: NewOrderModalProps) {
  const [step, setStep] = useState<'basic' | 'industry_detail'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic fields
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [days, setDays] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  // Industry detail – autoservisy
  const [services, setServices] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSubmit = async () => {
    if (!companyName.trim()) { setError('Vyplň název podniku.'); return; }
    if (!phone.trim()) { setError('Vyplň telefon.'); return; }
    if (!email.trim()) { setError('Vyplň e-mail.'); return; }
    if (!address.trim()) { setError('Vyplň adresu.'); return; }
    if (!days.trim()) { setError('Vyplň pracovní dny.'); return; }
    if (!workingHours.trim()) { setError('Vyplň pracovní dobu.'); return; }
    if (!services.trim()) { setError('Vyplň služby.'); return; }
    if (!websiteUrl.trim()) { setError('Vyplň adresu webu.'); return; }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('orders').insert({
      sales_user_id: salesUserId,
      company_name: companyName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      working_hours: `${days.trim()} ${workingHours.trim()}`,
      industry: 'autoservisy',
      services: services.trim(),
      website_url: websiteUrl.trim(),
      status: 'Čeká ve frontě',
      status_updated_at: new Date().toISOString(),
    });

    if (insertError) {
      setError('Chyba při odesílání. Zkus to znovu.');
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
  };

  const inputClass = `w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-white 
    placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] 
    transition-all duration-300 text-sm`;

  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-none overflow-hidden shadow-2xl"
        >
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Nové zadání</h2>
              </div>
              <button onClick={onClose} className="p-3 rounded-none hover:bg-white/5 transition-colors">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-none bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Název podniku</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    className={`${inputClass} pl-12`}
                    placeholder="Např. Autoservis Rychlý"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Telefon</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      className={`${inputClass} pl-12`}
                      placeholder="+420..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      className={`${inputClass} pl-12`}
                      placeholder="klient@seznam.cz"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Adresa provozovny</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    className={`${inputClass} pl-12`}
                    placeholder="Ulice, město, PSČ"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Pracovní dny</label>
                  <input
                    className={inputClass}
                    placeholder="Např. Po - Pá"
                    value={days}
                    onChange={e => setDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pracovní doba</label>
                  <input
                    className={inputClass}
                    placeholder="Např. 8:00 - 16:00"
                    value={workingHours}
                    onChange={e => setWorkingHours(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Hlavní nabízené služby</label>
                <div className="relative">
                  <Wrench size={16} className="absolute left-5 top-5 text-zinc-600" />
                  <textarea
                    className={`${inputClass} pl-12 h-24 resize-none`}
                    placeholder="Např. diagnostika, pneuservis, opravy motorů..."
                    value={services}
                    onChange={e => setServices(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Preferovaná adresa webu</label>
                <input
                  className={inputClass}
                  placeholder="napr-autoservis.cz"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#7C3AED] text-white py-5 rounded-none font-black text-sm uppercase tracking-wider hover:bg-[#6D28D9] transition-all shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)]"
              >
                {loading ? 'Odesílám...' : 'Odeslat zadání'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
