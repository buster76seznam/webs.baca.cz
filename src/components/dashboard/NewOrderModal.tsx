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

  // Industry detail – autoservisy
  const [hasPhotos, setHasPhotos] = useState<boolean | null>(null);
  const [services, setServices] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pricingType, setPricingType] = useState<PricingType | null>(null);

  const handleBasicNext = () => {
    if (!companyName.trim()) { setError('Vyplň název podniku.'); return; }
    if (!phone.trim()) { setError('Vyplň telefon.'); return; }
    if (!email.trim()) { setError('Vyplň e-mail.'); return; }
    if (!address.trim()) { setError('Vyplň adresu.'); return; }
    setError('');
    setStep('industry_detail');
  };

  const handleSubmit = async () => {
    if (hasPhotos === null) { setError('Zvol zda má klient fotky.'); return; }
    if (!services.trim()) { setError('Vyplň služby.'); return; }
    if (!websiteUrl.trim()) { setError('Vyplň adresu webu.'); return; }
    if (!pricingType) { setError('Zvol typ ceníku.'); return; }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('orders').insert({
      sales_user_id: salesUserId,
      company_name: companyName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      industry: 'autoservisy',
      has_photos: hasPhotos,
      services: services.trim(),
      website_url: websiteUrl.trim(),
      pricing_type: pricingType,
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

  const inputClass = `w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white 
    placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] 
    transition-all duration-300 text-sm`;

  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block';

  const ToggleBtn = ({ value, current, label, onClick }: {
    value: string | boolean; current: string | boolean | null; label: string; onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider border transition-all duration-300
        ${current === value
          ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-[0_0_20px_-5px_rgba(124,58,237,0.6)]'
          : 'bg-white/[0.02] border-white/10 text-zinc-500 hover:border-white/20'}`}
    >
      {label}
    </button>
  );

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
          className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Nové zadání</h2>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-1">
                  Krok {step === 'basic' ? '1' : '2'} z 2
                </p>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {step === 'basic' ? (
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

                <button
                  onClick={handleBasicNext}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-zinc-200 transition-all mt-4"
                >
                  Další krok
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Má klient kvalitní fotky?</label>
                  <div className="flex gap-4">
                    <ToggleBtn value={true} current={hasPhotos} label="Ano" onClick={() => setHasPhotos(true)} />
                    <ToggleBtn value={false} current={hasPhotos} label="Ne" onClick={() => setHasPhotos(false)} />
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

                <div>
                  <label className={labelClass}>Typ ceníku</label>
                  <div className="flex gap-4">
                    <ToggleBtn value="doda" current={pricingType} label="Dodá klient" onClick={() => setPricingType('doda')} />
                    <ToggleBtn value="dle_domluvy" current={pricingType} label="Dle domluvy" onClick={() => setPricingType('dle_domluvy')} />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep('basic')}
                    className="flex-1 border border-white/5 bg-white/[0.02] text-zinc-500 py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-white/5 transition-all"
                  >
                    Zpět
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-[#7C3AED] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-[#6D28D9] transition-all shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)]"
                  >
                    {loading ? 'Odesílám...' : 'Odeslat zadání'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
