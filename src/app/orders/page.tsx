'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowUpRight, X, Image as ImageIcon } from 'lucide-react';
import { useCountry } from '@/contexts/CountryContext';
import { translations } from '@/lib/translations';

export default function OrdersPage() {
  const { language } = useCountry();
  const isEnglish = language === 'en';
  const t = translations[language];
  const industries = t.industries;
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    industry: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    domain: '',
    description: '',
    advantage: '',
    priceList: '',
    workingHours: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'image/png' || file.type === 'image/jpeg'
    );
    setImages([...images, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - all fields required except owner section and price list
    if (!formData.companyName.trim() || !formData.companyPhone.trim() || 
        !formData.companyEmail.trim() || !formData.companyAddress.trim() ||
        !formData.industry || !formData.domain.trim() || 
        !formData.description.trim() || !formData.advantage.trim() ||
        !formData.workingHours.trim()) {
      setErrorMsg('Vyplňte prosím všechna povinná pole.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      images.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file);
      });

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Chyba při odesílání.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setFormData({
        companyName: '', companyPhone: '', companyEmail: '', companyAddress: '',
        industry: '', ownerName: '', ownerPhone: '', ownerEmail: '',
        domain: '', description: '', advantage: '', priceList: '', workingHours: '',
      });
      setImages([]);
    } catch {
      setErrorMsg('Nepodařilo se odeslat. Zkus to znovu.');
      setStatus('error');
    }
  };

  const inputClass = `w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm [&_option]:text-black`;
  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-white mb-2 block';

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-16 text-center max-w-lg">
          <div className="text-5xl mb-5">✅</div>
          <h3 className="text-2xl font-black mb-2 tracking-tight">{isEnglish ? 'Order Sent!' : 'Objednávka odeslána!'}</h3>
          <p className="text-zinc-400 font-medium mb-8">{isEnglish ? 'We will contact you as soon as possible.' : 'Ozveme se vám co nejdříve.'}</p>
          <button onClick={() => setStatus('idle')} className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">{isEnglish ? 'Submit another order' : 'Odeslat další objednávku'}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white py-24 px-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
            {isEnglish ? 'Website Order' : 'Objednávka webu'}
          </h1>
          <p className="text-zinc-400 text-lg">
            {isEnglish ? 'Fill out the form and we will contact you within 60 minutes.' : 'Vyplňte formulář a my se vám ozveme do 60 minut.'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Podnik */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-xl font-black mb-6 text-brand uppercase tracking-wider">{isEnglish ? 'Company' : 'Podnik'}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{isEnglish ? 'Company Name *' : 'Název podniku *'}</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder={isEnglish ? 'Novák s.r.o.' : 'Novák s.r.o.'} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{isEnglish ? 'Phone *' : 'Telefon *'}</label>
                <input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} placeholder="+420 777 123 456" className={inputClass} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{isEnglish ? 'Email *' : 'Email *'}</label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} placeholder="info@firma.cz" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{isEnglish ? 'Industry *' : 'Obor *'}</label>
                <select name="industry" value={formData.industry} onChange={handleInputChange} className={inputClass} required>
                  <option value="">{isEnglish ? 'Select industry' : 'Vyberte obor'}</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>{isEnglish ? 'Address *' : 'Adresa *'}</label>
              <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} placeholder={isEnglish ? 'Street 123, 123 45 City' : 'Ulice 123, 123 45 Město'} className={inputClass} required />
            </div>
          </motion.div>

          {/* Majitel/Jednatel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-xl font-black mb-6 text-zinc-400 uppercase tracking-wider">{isEnglish ? 'Owner/Manager' : 'Majitel/Jednatel'} <span className="text-zinc-600 normal-case">({isEnglish ? '(optional)' : '(nepovinné)'})</span></h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{isEnglish ? 'Full Name' : 'Jméno a příjmení'}</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="Jan Novák" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{isEnglish ? 'Phone' : 'Telefon'}</label>
                <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} placeholder="+420 777 123 456" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{isEnglish ? 'Email' : 'Email'}</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} placeholder="jan@firma.cz" className={inputClass} />
            </div>
          </motion.div>

          {/* Web */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-xl font-black mb-6 text-brand uppercase tracking-wider">{isEnglish ? 'Website' : 'Web'}</h2>
            
            <div className="mb-6">
              <label className={labelClass}>{isEnglish ? 'Images (.png, .jpg)' : 'Obrázky (.png, .jpg)'}</label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-brand/30 transition-colors">
                <input type="file" multiple accept=".png,.jpg,.jpeg" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto mb-3 text-zinc-600" />
                  <p className="text-zinc-500 text-sm">{isEnglish ? 'Click to upload images' : 'Klikněte pro nahrání obrázků'}</p>
                  <p className="text-zinc-700 text-xs mt-1">.png, .jpg</p>
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {images.map((file, i) => (
                    <div key={i} className="relative group">
                      <ImageIcon size={16} className="text-brand" />
                      <span className="text-xs text-zinc-400 ml-1">{file.name}</span>
                      <button type="button" onClick={() => removeImage(i)} className="ml-2 text-red-400 hover:text-red-300">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClass}>{isEnglish ? 'Desired domain *' : 'Jakou doménu chcete *'}</label>
              <input type="text" name="domain" value={formData.domain} onChange={handleInputChange} placeholder="mojedomena.cz" className={inputClass} required />
            </div>

            <div className="mb-4">
              <label className={labelClass}>{isEnglish ? 'What you do *' : 'Co dělají *'}</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder={isEnglish ? 'Describe what your company does...' : 'Popište čím se vaše firma zabývá...'} rows={4} className={`${inputClass} resize-none`} required />
            </div>

            <div className="mb-4">
              <label className={labelClass}>{isEnglish ? 'Advantage over competition *' : 'Výhoda oproti konkurenci *'}</label>
              <textarea name="advantage" value={formData.advantage} onChange={handleInputChange} placeholder={isEnglish ? 'What makes you different from others...' : 'Čím se odlišujete od ostatních...'} rows={3} className={`${inputClass} resize-none`} required />
            </div>

            <div className="mb-4">
              <label className={labelClass}>{isEnglish ? 'Price list' : 'Ceník'} <span className="text-zinc-700 normal-case tracking-normal font-normal">({isEnglish ? '(optional)' : '(nepovinné)'})</span></label>
              <textarea name="priceList" value={formData.priceList} onChange={handleInputChange} placeholder={isEnglish ? 'Optionally provide price list...' : 'Volitelně uveďte ceník...'} rows={3} className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>{isEnglish ? 'Working hours *' : 'Pracovní doba *'}</label>
              <input type="text" name="workingHours" value={formData.workingHours} onChange={handleInputChange} placeholder="Po-Pá 8:00-17:00" className={inputClass} required />
            </div>
          </motion.div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
              <p className="text-red-400 text-sm font-bold">{errorMsg}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)] disabled:opacity-60 flex items-center justify-center gap-3">
              {status === 'loading' ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEnglish ? 'Sending...' : 'Odesílám...'}</>) : (isEnglish ? <>Submit <ArrowUpRight size={16} /></> : <>Odeslat <ArrowUpRight size={16} /></>)}
            </button>
            <p className="text-white text-sm text-center mt-4 font-medium">{isEnglish ? 'Have special requirements? Write to us at webs.baca@gmail.com' : 'Máte speciální požadavky? Napište nám na webs.baca@gmail.com'}</p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
