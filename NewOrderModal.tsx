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
    value: string; current: string | boolean | null; label: string; onClick: () => void;
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-[#0A0A0A] border border-white/8 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5 sticky top-0 bg-[#0A0A0A] z-10">
            <div>
              <h2 className="text-xl font-black tracking-tight">Nová objednávka</h2>
              <p className="text-zinc-600 text-xs mt-1 font-bold uppercase tracking-widest">
                {step === 'basic' ? 'Základní informace' : 'Autoservisy – detaily'}
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">

              {/* STEP 1 – Základní info */}
              {step === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label className={labelClass}><Building2 size={10} className="inline mr-1" />Název podniku</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Auto Novák s.r.o." className={inputClass} autoFocus />
                  </div>
                  <div>
                    <label className={labelClass}><Phone size={10} className="inline mr-1" />Telefon</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+420 777 123 456" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><Mail size={10} className="inline mr-1" />E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@autonovak.cz" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><MapPin size={10} className="inline mr-1" />Adresa</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Hlavní 1, 110 00 Praha" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}><Wrench size={10} className="inline mr-1" />Obor</label>
                    <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-2xl px-5 py-4 flex items-center gap-3">
                      <Wrench size={16} className="text-[#7C3AED]" />
                      <span className="text-white font-black text-sm uppercase tracking-wider">Autoservisy</span>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

                  <button
                    onClick={handleBasicNext}
                    className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#5B21B6] transition-all duration-300 mt-2"
                  >
                    Pokračovat →
                  </button>
                </motion.div>
              )}

              {/* STEP 2 – Autoservisy detaily */}
              {step === 'industry_detail' && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col gap-6"
                >
                  {/* Fotky */}
                  <div>
                    <label className={labelClass}>Fotky</label>
                    <div className="flex gap-3">
                      <ToggleBtn value={true as unknown as string} current={hasPhotos} label="Ano" onClick={() => setHasPhotos(true)} />
                      <ToggleBtn value={false as unknown as string} current={hasPhotos} label="Ne" onClick={() => setHasPhotos(false)} />
                    </div>
                  </div>

                  {/* Služby */}
                  <div>
                    <label className={labelClass}>Služby</label>
                    <textarea
                      value={services}
                      onChange={e => setServices(e.target.value)}
                      placeholder="Pneuservis, výměna oleje, STK příprava..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Adresa webu */}
                  <div>
                    <label className={labelClass}>Adresa webu</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="autoservisnovak.cz"
                      className={inputClass}
                    />
                  </div>

                  {/* Ceník */}
                  <div>
                    <label className={labelClass}>Ceník</label>
                    <div className="flex gap-3">
                      <ToggleBtn value="dle_domluvy" current={pricingType} label="Dle domluvy" onClick={() => setPricingType('dle_domluvy')} />
                      <ToggleBtn value="doda" current={pricingType} label="Dodá" onClick={() => setPricingType('doda')} />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => { setStep('basic'); setError(''); }}
                      className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-white/5 hover:bg-white/10 transition-all duration-300 text-zinc-400"
                    >
                      ← Zpět
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-2 flex-grow-[2] bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-[#5B21B6] transition-all duration-300 disabled:opacity-50 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]"
                    >
                      {loading ? 'Odesílám...' : 'Odeslat na vývoj 🚀'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
