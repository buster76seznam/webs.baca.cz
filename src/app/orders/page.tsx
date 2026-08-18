'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, X, Search, Palette } from 'lucide-react';
import { useCountry } from '@/contexts/CountryContext';
import { translations } from '@/lib/translations';
import dynamic from 'next/dynamic';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Turnstile } from '@marsidev/react-turnstile';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
  loading: () => <div className="w-full h-12 bg-white/[0.03] border border-white/8 rounded-2xl animate-pulse" />,
});
import 'react-phone-number-input/style.css';

export default function OrdersPage() {
  const [currentLanguage, setCurrentLanguage] = useState<'cs' | 'en' | 'en-gb' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'nl' | 'pt'>('en');
  const isEnglish = currentLanguage === 'en' || currentLanguage === 'en-gb';
  const t = translations[currentLanguage as keyof typeof translations];
  const industries = t.industries;
  
  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode as 'cs' | 'en' | 'en-gb' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'nl' | 'pt');
  };
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    companyCountry: '',
    industry: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    domain: '',
    description: '',
    advantage: '',
    workingDays: 'mon-fri',
    workingTime: '9-17',
    workingHours: '',
    primaryColor: '#7C3AED',
    secondaryColor: '#10B981',
    language: 'cs',
    legalBusinessName: '',
    stateOfIncorporation: '',
    principalPlaceOfBusiness: '',
    authorizedSignatory: '',
    contractEmail: '',
    priceList: '',
    facebookUrl: '',
    instagramUrl: '',
    googleMapsUrl: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<{ owner: boolean }>({ owner: false });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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

  const countries = [
    { code: 'CZ', name: 'Česká republika', en: 'Czech Republic' },
    { code: 'SK', name: 'Slovensko', en: 'Slovakia' },
    { code: 'PL', name: 'Polsko', en: 'Poland' },
    { code: 'DE', name: 'Německo', en: 'Germany' },
    { code: 'AT', name: 'Rakousko', en: 'Austria' },
    { code: 'HU', name: 'Maďarsko', en: 'Hungary' },
    { code: 'RO', name: 'Rumunsko', en: 'Romania' },
    { code: 'HR', name: 'Chorvatsko', en: 'Croatia' },
    { code: 'SI', name: 'Slovinsko', en: 'Slovenia' },
    { code: 'GB', name: 'Velká Británie', en: 'United Kingdom' },
    { code: 'US', name: 'USA', en: 'United States' },
    { code: 'FR', name: 'Francie', en: 'France' },
    { code: 'IT', name: 'Itálie', en: 'Italy' },
    { code: 'ES', name: 'Španělsko', en: 'Spain' },
    { code: 'NL', name: 'Nizozemsko', en: 'Netherlands' },
    { code: 'BE', name: 'Belgie', en: 'Belgium' },
    { code: 'CH', name: 'Švýcarsko', en: 'Switzerland' },
    { code: 'SE', name: 'Švédsko', en: 'Sweden' },
    { code: 'DK', name: 'Dánsko', en: 'Denmark' },
    { code: 'NO', name: 'Norsko', en: 'Norway' },
    { code: 'FI', name: 'Finsko', en: 'Finland' },
    { code: 'PT', name: 'Portugalsko', en: 'Portugal' },
    { code: 'GR', name: 'Řecko', en: 'Greece' },
    { code: 'UA', name: 'Ukrajina', en: 'Ukraine' },
    { code: 'RU', name: 'Rusko', en: 'Russia' },
    { code: 'TR', name: 'Turecko', en: 'Turkey' },
    { code: 'AE', name: 'Spojené arabské emiráty', en: 'United Arab Emirates' },
    { code: 'CA', name: 'Kanada', en: 'Canada' },
    { code: 'AU', name: 'Austrálie', en: 'Australia' },
    { code: 'OTHER', name: 'Jiná', en: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format working hours for display
    let formattedWorkingHours = '';
    const dayLabels: Record<string, { cs: string; en: string; 'en-gb': string; es: string; de: string; fr: string; it: string; pl: string; nl: string; pt: string }> = {
      'mon-fri': { cs: 'Po-Pá', en: 'Mon-Fri', 'en-gb': 'Mon-Fri', es: 'Lun-Vie', de: 'Mo-Fr', fr: 'Lun-Ven', it: 'Lun-Ven', pl: 'Pon-Pt', nl: 'Ma-Vr', pt: 'Seg-Sex' },
      'mon-sat': { cs: 'Po-So', en: 'Mon-Sat', 'en-gb': 'Mon-Sat', es: 'Lun-Sáb', de: 'Mo-Sa', fr: 'Lun-Sam', it: 'Lun-Sab', pl: 'Pon-Sob', nl: 'Ma-Za', pt: 'Seg-Sáb' },
      'mon-sun': { cs: 'Po-Ne', en: 'Mon-Sun', 'en-gb': 'Mon-Sun', es: 'Lun-Dom', de: 'Mo-So', fr: 'Lun-Dim', it: 'Lun-Dom', pl: 'Pon-Niedz', nl: 'Ma-Zo', pt: 'Seg-Dom' },
      'tue-sat': { cs: 'Út-So', en: 'Tue-Sat', 'en-gb': 'Tue-Sat', es: 'Mar-Sáb', de: 'Di-Sa', fr: 'Mar-Sam', it: 'Mar-Sab', pl: 'Wt-Sob', nl: 'Di-Za', pt: 'Ter-Sáb' },
      'tue-sun': { cs: 'Út-Ne', en: 'Tue-Sun', 'en-gb': 'Tue-Sun', es: 'Mar-Dom', de: 'Di-So', fr: 'Mar-Dim', it: 'Mar-Dom', pl: 'Wt-Niedz', nl: 'Di-Zo', pt: 'Ter-Dom' },
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
      const dayLabel = dayLabels[formData.workingDays]?.[currentLanguage] || formData.workingDays;
      const timeLabel = timeLabels[formData.workingTime] || formData.workingTime;
      formattedWorkingHours = `${dayLabel} ${timeLabel}`;
    }
    
    // Validation - all required fields (contract fields removed)
    if (!formData.companyName.trim() || !formData.companyPhone.trim() || 
        !formData.companyEmail.trim() || !formData.companyAddress.trim() ||
        !formData.companyCountry || !formData.industry || !formData.domain.trim() || 
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
      formDataToSend.append('turnstileToken', turnstileToken || '');

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
        companyCountry: '', industry: '', ownerName: '', ownerPhone: '', ownerEmail: '',
        domain: '', description: '', advantage: '', priceList: '',
        workingDays: 'mon-fri', workingTime: '9-17', workingHours: '',
        primaryColor: '#7C3AED', secondaryColor: '#10B981', language: 'cs',
        facebookUrl: '', instagramUrl: '', googleMapsUrl: '',
        legalBusinessName: '', stateOfIncorporation: '', principalPlaceOfBusiness: '',
        authorizedSignatory: '', contractEmail: '',
      });
      setCurrentStep(1);
    } catch {
      setErrorMsg(isEnglish ? 'Failed to submit. Try again.' : 'Nepodařilo se odeslat. Zkus to znovu.');
      setStatus('error');
    }
  };

  const inputClass = `w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm [&_option]:text-black`;
  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-white mb-2 block';

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-6">
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
    <div className="min-h-screen bg-[#1a1a1a] text-white py-24 px-6 flex items-center justify-center">
      <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} />
      <div className="max-w-4xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                  currentStep >= step
                    ? 'bg-brand text-white'
                    : 'bg-white/10 text-white/50'
                }`}>
                  {step}
                </div>
                <span className={`text-xs mt-2 text-center whitespace-nowrap text-ellipsis transition-all ${
                  currentStep === step
                    ? 'text-brand font-black'
                    : currentStep > step
                    ? 'text-white/60'
                    : 'text-white/30'
                }`}>
                  {step === 1 ? isEnglish ? 'Company' : 'Podnik' :
                   step === 2 ? isEnglish ? 'Website' : 'Web' :
                   step === 3 ? isEnglish ? 'Design' : 'Design' :
                   isEnglish ? 'Submit' : 'Odeslat'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-brand rounded-full transition-all duration-300`} style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
            {isEnglish ? 'Website Order' : 'Objednávka webu'}
          </h1>
          <p className="text-zinc-400 text-lg">
            {isEnglish ? 'Fill out the form and we will contact you within 60 minutes.' : 'Vyplňte formulář a my se vám ozveme do 60 minut.'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: Company */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
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
              <div>
                <label className={labelClass}>{isEnglish ? 'Country *' : 'Země *'}</label>
                <select name="companyCountry" value={formData.companyCountry} onChange={handleInputChange} className={inputClass} required>
                  <option value="">{isEnglish ? 'Select country' : 'Vyberte zemi'}</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{isEnglish ? c.en : c.name}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Website Details */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
              <h2 className="text-xl font-black mb-6 text-brand uppercase tracking-wider">{isEnglish ? 'Website' : 'Web'}</h2>

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
          )}

          {/* STEP 3: Design */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12">
              <h2 className="text-xl font-black mb-6 text-brand uppercase tracking-wider">{isEnglish ? 'Design' : 'Design'}</h2>
              
              <div className="mb-8">
                <label className={labelClass}>{isEnglish ? 'Primary Color' : 'Primární barva'}</label>
                <div className="flex flex-wrap gap-3 mb-6">
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
                {/* Color Preview */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest font-black">{isEnglish ? 'Preview' : 'Náhled'}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: formData.primaryColor + '20', borderColor: formData.primaryColor, borderWidth: '1px' }}>
                      <div className="text-2xl font-black" style={{ color: formData.primaryColor }}>Aa</div>
                      <p className="text-xs text-zinc-500 mt-2">{isEnglish ? 'Primary' : 'Primární'}</p>
                    </div>
                    <button type="button" disabled className="px-4 py-3 rounded-lg font-black text-white text-sm transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: formData.primaryColor }}>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className={labelClass}>{isEnglish ? 'Secondary Color' : 'Sekundární barva'}</label>
                <div className="flex flex-wrap gap-3 mb-6">
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
                {/* Color Preview */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest font-black">{isEnglish ? 'Preview' : 'Náhled'}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: formData.secondaryColor + '20', borderColor: formData.secondaryColor, borderWidth: '1px' }}>
                      <div className="text-2xl font-black" style={{ color: formData.secondaryColor }}>Aa</div>
                      <p className="text-xs text-zinc-500 mt-2">{isEnglish ? 'Secondary' : 'Sekundární'}</p>
                    </div>
                    <button type="button" disabled className="px-4 py-3 rounded-lg font-black text-white text-sm transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: formData.secondaryColor }}>
                    </button>
                  </div>
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
          )}

          {/* STEP 4: Optional Sections */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Owner/Manager - Collapsible */}
              <motion.div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSections({ ...expandedSections, owner: !expandedSections.owner })}
                  className="w-full p-8 md:p-12 flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                >
                  <h2 className="text-xl font-black text-zinc-400 uppercase tracking-wider">{isEnglish ? 'Owner/Manager' : 'Majitel/Jednatel'} <span className="text-zinc-600 normal-case text-sm">({isEnglish ? '(optional)' : '(nepovinné)'})</span></h2>
                  <div className={`transition-transform ${expandedSections.owner ? 'rotate-180' : ''}`}>▼</div>
                </button>
                {expandedSections.owner && (
                  <div className="px-8 md:px-12 pb-8 md:pb-12 border-t border-white/5">
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
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-black mb-4 text-brand uppercase">{isEnglish ? 'Ready to submit?' : 'Připraveni na odeslání?'}</h2>
              <p className="text-zinc-400 mb-8">{isEnglish ? 'Review your details above. Click submit to send your order.' : 'Zkontrolujte vaše údaje výše. Klikněte na odeslat pro odeslání vaší objednávky.'}</p>
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} onSuccess={setTurnstileToken} />
            </motion.div>
          )}

          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
              <p className="text-red-400 text-sm font-bold">{errorMsg}</p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
            >
              {isEnglish ? '← Back' : '← Zpět'}
            </button>
            <div className="flex gap-2">
              {currentStep === 4 ? (
                <button type="submit" className="px-8 py-3 bg-brand text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)] disabled:opacity-60 flex items-center gap-2">
                  {status === 'loading' ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEnglish ? 'Sending...' : 'Odesílám...'}</>) : (isEnglish ? <>Submit <ArrowUpRight size={16} /></> : <>Odeslat <ArrowUpRight size={16} /></>)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="px-8 py-3 bg-brand text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)]"
                >
                  {isEnglish ? 'Next →' : 'Dál →'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
