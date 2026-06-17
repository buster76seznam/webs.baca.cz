'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowUpRight, X, Image as ImageIcon, Share2, Camera, MapPin, Search, Palette, Globe } from 'lucide-react';
import { useCountry } from '@/contexts/CountryContext';
import { translations } from '@/lib/translations';
import dynamic from 'next/dynamic';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
  loading: () => <div className="w-full h-12 bg-white/[0.03] border border-white/8 rounded-2xl animate-pulse" />,
});
import 'react-phone-number-input/style.css';

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
    workingDays: 'mon-fri',
    workingTime: '9-17',
    workingHours: '',
    primaryColor: '#7C3AED',
    secondaryColor: '#10B981',
    language: 'cs',
    facebookUrl: '',
    instagramUrl: '',
    googleMapsUrl: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  const colorPalette = [
    '#7C3AED', '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#EC4899',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6',
  ];

  const languages = [
    { code: 'cs', name: 'Čeština', native: 'Čeština' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
    { code: 'pl', name: 'Polish', native: 'Polski' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'uk', name: 'Ukrainian', native: 'Українська' },
    { code: 'hu', name: 'Hungarian', native: 'Magyar' },
    { code: 'ro', name: 'Romanian', native: 'Română' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands' },
    { code: 'sv', name: 'Swedish', native: 'Svenska' },
    { code: 'da', name: 'Danish', native: 'Dansk' },
    { code: 'fi', name: 'Finnish', native: 'Suomi' },
    { code: 'no', name: 'Norwegian', native: 'Norsk' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.native.toLowerCase().includes(languageSearch.toLowerCase())
  );

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
    
    // Format working hours for display
    let formattedWorkingHours = '';
    const dayLabels: Record<string, { cs: string; en: string }> = {
      'mon-fri': { cs: 'Po-Pá', en: 'Mon-Fri' },
      'mon-sat': { cs: 'Po-So', en: 'Mon-Sat' },
      'mon-sun': { cs: 'Po-Ne', en: 'Mon-Sun' },
      'tue-sat': { cs: 'Út-So', en: 'Tue-Sat' },
      'tue-sun': { cs: 'Út-Ne', en: 'Tue-Sun' },
    };
    const timeLabels: Record<string, string> = {
      '8-16': '8:00-16:00',
      '9-17': '9:00-17:00',
      '10-18': '10:00-18:00',
      '8-17': '8:00-17:00',
      '9-18': '9:00-18:00',
    };
    
    if (formData.workingTime === 'custom') {
      formattedWorkingHours = formData.workingHours;
    } else {
      const dayLabel = dayLabels[formData.workingDays]?.[language] || formData.workingDays;
      const timeLabel = timeLabels[formData.workingTime] || formData.workingTime;
      formattedWorkingHours = `${dayLabel} ${timeLabel}`;
    }
    
    // Validation - all fields required except owner section and price list
    if (!formData.companyName.trim() || !formData.companyPhone.trim() || 
        !formData.companyEmail.trim() || !formData.companyAddress.trim() ||
        !formData.industry || !formData.domain.trim() || 
        !formData.description.trim() || !formData.advantage.trim() ||
        !formattedWorkingHours.trim()) {
      setErrorMsg(isEnglish ? 'Please fill in all required fields.' : 'Vyplňte prosím všechna povinná pole.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Only send fields that the API expects, exclude workingDays and workingTime
        if (key !== 'workingDays' && key !== 'workingTime' && (key !== 'workingHours' || formData.workingTime === 'custom')) {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append('workingHours', formattedWorkingHours);
      images.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file);
      });

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('API Error:', data);
        setErrorMsg(data.error || (isEnglish ? 'Error submitting.' : 'Chyba při odesílání.'));
        setStatus('error');
        return;
      }

      setStatus('success');
      setFormData({
        companyName: '', companyPhone: '', companyEmail: '', companyAddress: '',
        industry: '', ownerName: '', ownerPhone: '', ownerEmail: '',
        domain: '', description: '', advantage: '', priceList: '',
        workingDays: 'mon-fri', workingTime: '9-17', workingHours: '',
        primaryColor: '#7C3AED', secondaryColor: '#10B981', language: 'cs',
        facebookUrl: '', instagramUrl: '', googleMapsUrl: '',
      });
      setImages([]);
    } catch {
      setErrorMsg(isEnglish ? 'Failed to submit. Try again.' : 'Nepodařilo se odeslat. Zkus to znovu.');
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
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder={isEnglish ? 'Novak s.r.o.' : 'Novák s.r.o.'} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{isEnglish ? 'Phone *' : 'Telefon *'}</label>
                <PhoneInput
                  value={formData.companyPhone}
                  onChange={(value) => setFormData({ ...formData, companyPhone: value || '' })}
                  placeholder={isEnglish ? 'Enter phone number' : 'Zadejte telefonní číslo'}
                  className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm [&_input]:bg-transparent [&_input]:text-white [&_input]:placeholder-zinc-700 [&_select]:bg-[#0A0A0A] [&_select]:text-white [&_select]:border-white/10"
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{isEnglish ? 'Email *' : 'Email *'}</label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} placeholder={isEnglish ? 'info@company.com' : 'info@firma.cz'} className={inputClass} required />
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
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder={isEnglish ? 'Jan Novak' : 'Jan Novák'} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{isEnglish ? 'Phone' : 'Telefon'}</label>
                <PhoneInput
                  value={formData.ownerPhone}
                  onChange={(value) => setFormData({ ...formData, ownerPhone: value || '' })}
                  placeholder={isEnglish ? 'Enter phone number' : 'Zadejte telefonní číslo'}
                  className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm [&_input]:bg-transparent [&_input]:text-white [&_input]:placeholder-zinc-700 [&_select]:bg-[#0A0A0A] [&_select]:text-white [&_select]:border-white/10"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{isEnglish ? 'Email' : 'Email'}</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} placeholder={isEnglish ? 'jan@company.com' : 'jan@firma.cz'} className={inputClass} />
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
              <input type="text" name="domain" value={formData.domain} onChange={handleInputChange} placeholder={isEnglish ? 'mydomain.com' : 'mojedomena.cz'} className={inputClass} required />
            </div>

            <div className="mb-4">
              <label className={labelClass}>{isEnglish ? 'What do you want *' : 'Co chcete *'}</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder={isEnglish ? 'Describe what you want...' : 'Popište co chcete...'} rows={4} className={`${inputClass} resize-none`} required />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    name="workingDays"
                    value={formData.workingDays || 'mon-fri'}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="mon-fri">{isEnglish ? 'Monday - Friday' : 'Pondělí - Pátek'}</option>
                    <option value="mon-sat">{isEnglish ? 'Monday - Saturday' : 'Pondělí - Sobota'}</option>
                    <option value="mon-sun">{isEnglish ? 'Monday - Sunday' : 'Pondělí - Neděle'}</option>
                    <option value="tue-sat">{isEnglish ? 'Tuesday - Saturday' : 'Úterý - Sobota'}</option>
                    <option value="tue-sun">{isEnglish ? 'Tuesday - Sunday' : 'Úterý - Neděle'}</option>
                  </select>
                </div>
                <div>
                  <select
                    name="workingTime"
                    value={formData.workingTime || '9-17'}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="8-16">{isEnglish ? '8:00 - 16:00' : '8:00 - 16:00'}</option>
                    <option value="9-17">{isEnglish ? '9:00 - 17:00' : '9:00 - 17:00'}</option>
                    <option value="10-18">{isEnglish ? '10:00 - 18:00' : '10:00 - 18:00'}</option>
                    <option value="8-17">{isEnglish ? '8:00 - 17:00' : '8:00 - 17:00'}</option>
                    <option value="9-18">{isEnglish ? '9:00 - 18:00' : '9:00 - 18:00'}</option>
                    <option value="custom">{isEnglish ? 'Custom hours' : 'Vlastní hodiny'}</option>
                  </select>
                </div>
              </div>
              {(formData.workingTime === 'custom') && (
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  placeholder={isEnglish ? 'e.g. 8:00-12:00, 13:00-17:00' : 'např. 8:00-12:00, 13:00-17:00'}
                  className={`${inputClass} mt-4`}
                  required
                />
              )}
            </div>
          </motion.div>

          {/* Design */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-xl font-black mb-6 text-brand uppercase tracking-wider">{isEnglish ? 'Design' : 'Design'}</h2>
            
            <div className="mb-6">
              <label className={labelClass}>{isEnglish ? 'Primary Color' : 'Primární barva'}</label>
              <div className="flex flex-wrap gap-3">
                {colorPalette.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryColor: color })}
                    className={`w-12 h-12 rounded-xl border-2 transition-all ${
                      formData.primaryColor === color 
                        ? 'border-white scale-110 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.primaryColor === color && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>{isEnglish ? 'Secondary Color' : 'Sekundární barva'}</label>
              <div className="flex flex-wrap gap-3">
                {colorPalette.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, secondaryColor: color })}
                    className={`w-12 h-12 rounded-xl border-2 transition-all ${
                      formData.secondaryColor === color 
                        ? 'border-white scale-110 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.secondaryColor === color && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>{isEnglish ? 'Website Language' : 'Jazyk webu'}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  placeholder={isEnglish ? 'Search language...' : 'Hledat jazyk...'}
                  className={`${inputClass} pl-12`}
                />
              </div>
              <div className="mt-3 max-h-48 overflow-y-auto bg-[#0A0A0A] border border-white/5 rounded-2xl">
                {filteredLanguages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, language: lang.code });
                      setLanguageSearch('');
                    }}
                    className={`w-full px-5 py-3 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors ${
                      formData.language === lang.code ? 'bg-white/[0.05]' : ''
                    }`}
                  >
                    <span className="text-white text-sm">{lang.native}</span>
                    {formData.language === lang.code && (
                      <div className="w-4 h-4 bg-brand rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-xl font-black mb-6 text-zinc-400 uppercase tracking-wider">{isEnglish ? 'Social Media' : 'Sociální sítě'} <span className="text-zinc-600 normal-case">({isEnglish ? '(optional)' : '(nepovinné)'})</span></h2>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Share2 size={18} />
                </div>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                  className={`${inputClass} pl-12`}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Camera size={18} />
                </div>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourprofile"
                  className={`${inputClass} pl-12`}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <MapPin size={18} />
                </div>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                  className={`${inputClass} pl-12`}
                />
              </div>
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
