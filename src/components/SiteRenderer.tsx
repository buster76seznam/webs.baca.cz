 'use client';

import { MapPin, Phone, Mail, CheckCircle, Star, ArrowRight, Clock } from 'lucide-react';
import { useState } from 'react';

import HeroVariant1Split from '@/components/templates/hero/HeroVariant1Split';
import HeroVariant2Centered from '@/components/templates/hero/HeroVariant2Centered';
import HeroVariant3Minimal from '@/components/templates/hero/HeroVariant3Minimal';
import ServicesVariant1Grid from '@/components/templates/services/ServicesVariant1Grid';
import ServicesVariant2List from '@/components/templates/services/ServicesVariant2List';

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; ctaText: string };
  about: { title: string; text: string };
  services: Array<{ title: string; description: string }>;
  contact: { address: string; phone: string; hours: string };
  theme: { primaryColor: string; secondaryColor: string };
}

interface OrderRow {
  id: string;
  company_name: string;
  status: string;
  domain?: string | null;
  primary_color: string | null;
  language: string | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  working_hours: string | null;
}

interface Props {
  data: GeneratedSiteJson;
  order: OrderRow;
  isPaid: boolean;
  onApprove?: () => void;
}

/** Convert a hex color to CSS rgba with the given opacity (0–1). */
function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
  return `rgba(${r},${g},${b},${alpha})`;
}

const translations = {
  cs: {
    aboutTitle: 'O nás',
    address: 'Adresa',
    successMessage: 'Zpráva byla úspěšně odeslána!',
    errorMessage: 'Něco se nepovedlo. Zkuste to prosím znovu.',
    phone: 'Telefon',
    email: 'Email',
    hours: 'Otevírací doba',
    location: 'Lokalita',
    findUs: 'Kde nás najdete',
    contact: 'Kontakt',
    writeToUs: 'Napište nám',
    contactPrompt: 'Máte dotaz nebo zájem o spolupráci? Ozvěte se nám.',
    nameLabel: 'Jméno',
    namePlaceholder: 'Vaše jméno',
    emailPlaceholder: 'vas@email.cz',
    messageLabel: 'Zpráva',
    messagePlaceholder: 'Jak vám můžeme pomoci?',
    sendButton: 'Odeslat zprávu',
    demoBadge: 'Demo verze',
    demoMap: 'Interaktivní mapa',
    demoForm: 'Formulář bude aktivní po zakoupení webu',
    demoSite: 'Náhled vašeho webu (Demo version)',
    approveButton: 'Schválit & Aktivovat web na vlastní doméně',
    approveButtonMobile: 'Aktivovat web',
    rights: 'Všechna práva vyhrazena.',
    servicesTitle: 'Služby',
    servicesSubtitle: 'Co nabízíme',
  },
  en: {
    aboutTitle: 'About Us',
    address: 'Address',
    successMessage: 'Message sent successfully!',
    errorMessage: 'Something went wrong. Please try again.',
    phone: 'Phone',
    email: 'Email',
    hours: 'Opening Hours',
    location: 'Location',
    findUs: 'Where to find us',
    contact: 'Contact',
    writeToUs: 'Write to us',
    contactPrompt: 'Have a question or interested in working together? Get in touch.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help you?',
    sendButton: 'Send message',
    demoBadge: 'Demo version',
    demoMap: 'Interactive map',
    demoForm: 'The form will be active after purchasing the website',
    demoSite: 'Preview of your website (Demo version)',
    approveButton: 'Approve & Activate website on your own domain',
    approveButtonMobile: 'Activate website',
    rights: 'All rights reserved.',
    servicesTitle: 'Services',
    servicesSubtitle: 'What we offer',
  }
};

export default function SiteRenderer({ data, order, isPaid, onApprove }: Props) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const lang = order.language === 'en' ? 'en' : 'cs';
  const t = translations[lang];

  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: order.company_name,
    description: data.about?.text || '',
    url: order.domain ? `https://${order.domain}` : '',
    telephone: order.company_phone || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: order.company_address || '',
    },
    openingHours: order.working_hours || '',
    image: '/Logo.png',
  };

  const primaryColor = data.theme?.primaryColor || order.primary_color || '#7C3AED';
  const secondaryColor = data.theme?.secondaryColor || '#10B981';

  const heroVariant: string = 'variant_1';
  const servicesVariant: string = 'grid';

  const { hero, about, services, contact } = data;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaid || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          to: order.company_email,
          companyName: order.company_name
        }),
      });

      if (res.ok) {
        setStatus('success');
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove();
    }
  };

  /**
   * CSS custom properties injected on the root wrapper so all child
   * template components can consume var(--color-primary) etc.
   */
  const cssVars = {
    '--color-primary': primaryColor,
    '--color-secondary': secondaryColor,
    '--color-primary-06': hexAlpha(primaryColor, 0.06),
    '--color-primary-08': hexAlpha(primaryColor, 0.08),
    '--color-primary-10': hexAlpha(primaryColor, 0.1),
    '--color-primary-12': hexAlpha(primaryColor, 0.12),
    '--color-primary-15': hexAlpha(primaryColor, 0.15),
    '--color-primary-20': hexAlpha(primaryColor, 0.2),
    '--color-secondary-10': hexAlpha(secondaryColor, 0.1),
    '--color-secondary-12': hexAlpha(secondaryColor, 0.12),
    '--color-secondary-20': hexAlpha(secondaryColor, 0.2),
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans w-full max-w-full overflow-hidden relative anti-overflow-container" style={cssVars}>
      {/* SEO: JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── STICKY DEMO BANNER ─── */}
      {!isPaid && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 md:px-8 py-3 shadow-lg"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-yellow-400 text-lg flex-shrink-0">👁️</span>
            <span className="text-white text-sm font-medium truncate">
              {t.demoSite}
            </span>
          </div>
          <button
            onClick={handleApproveClick}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
            style={{ backgroundColor: primaryColor }}
          >
            <CheckCircle size={16} />
            <span className="hidden sm:inline">{t.approveButton}</span>
            <span className="sm:hidden">{t.approveButtonMobile}</span>
          </button>
        </div>
      )}
      {!isPaid && <div className="h-14" />}

      {/* ─── HERO ─── */}
      <div className="anti-overflow-container">
        {heroVariant === 'variant_2' ? (
          <HeroVariant2Centered hero={hero} companyName={order.company_name} />
        ) : heroVariant === 'variant_3' ? (
          <HeroVariant3Minimal hero={hero} companyName={order.company_name} />
        ) : (
          <HeroVariant1Split hero={hero} companyName={order.company_name} />
        )}
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 md:py-32 px-6 bg-white overflow-hidden w-full max-w-full relative anti-overflow-container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div
                className="text-xs font-black uppercase tracking-[0.3em] mb-6 inline-block px-4 py-1.5 rounded-full"
                style={{ backgroundColor: hexAlpha(primaryColor, 0.1), color: primaryColor }}
              >
                {t.aboutTitle}
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 text-gray-900 leading-[1.1]">
                {about?.title}
              </h2>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full mb-8" />
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                {about?.text}
              </p>
            </div>
            <div
              className="rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col gap-8 md:gap-10 shadow-2xl backdrop-blur-md bg-white/50 border border-slate-200/60 hover:shadow-primary-10 transition-all duration-500 hover:-translate-y-1"
            >
              {(contact?.address || order.company_address) && (
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={24} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">{t.address}</p>
                    <p className="text-gray-900 font-bold text-lg">{contact?.address || order.company_address}</p>
                  </div>
                </div>
              )}
              {(contact?.phone || order.company_phone) && (
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone size={24} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">{t.phone}</p>
                    <p className="text-gray-900 font-bold text-lg">{contact?.phone || order.company_phone}</p>
                  </div>
                </div>
              )}
              {order.company_email && (
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={24} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">{t.email}</p>
                    <p className="text-gray-900 font-bold text-lg">{order.company_email}</p>
                  </div>
                </div>
              )}
              {(contact?.hours || order.working_hours) && (
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Clock size={24} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">{t.hours}</p>
                    <p className="text-gray-900 font-bold text-lg">{contact?.hours || order.working_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      {services && services.length > 0 && (
        <div className="anti-overflow-container">
          <ServicesVariant1Grid services={services} />
        </div>
      )}

      {/* ─── MAP ─── */}
      <section
        id="map"
        className="py-32 px-6 relative overflow-hidden w-full max-w-full anti-overflow-container"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="text-xs font-black uppercase tracking-[0.3em] mb-4 inline-block px-4 py-1.5 rounded-full bg-white shadow-sm"
              style={{ color: primaryColor }}
            >
              {t.location}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-6">
              {t.findUs}
            </h2>
          </div>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
            {!isPaid && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md rounded-[2.5rem]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                  <MapPin size={32} style={{ color: primaryColor }} />
                </div>
                <p className="text-white font-black text-2xl mb-4 tracking-tight">{t.demoMap}</p>
                <span
                  className="px-6 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t.demoBadge}
                </span>
              </div>
            )}
            {order.company_address && isPaid ? (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(order.company_address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="400"
                className="block border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.findUs}
              />
            ) : (
              <div
                className="h-[500px] w-full flex items-center justify-center bg-slate-100"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6 opacity-50">
                    <MapPin size={32} style={{ color: primaryColor }} />
                  </div>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">{contact?.address || order.company_address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" className="py-32 px-6 bg-white relative overflow-hidden w-full max-w-full anti-overflow-container" >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="text-xs font-black uppercase tracking-[0.3em] mb-4 inline-block px-4 py-1.5 rounded-full"
              style={{ backgroundColor: hexAlpha(primaryColor, 0.1), color: primaryColor }}
            >
              {t.contact}
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 mb-6">
              {t.writeToUs}
            </h2>
            <p className="text-gray-500 text-lg font-medium">{t.contactPrompt}</p>
          </div>

          {status === 'success' && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-center">
              {t.successMessage}
            </div>
          )}
          {status === 'error' && (
            <div className="mb-8 p-6 rounded-2xl bg-red-50 border border-red-100 text-red-800 font-bold text-center">
              {t.errorMessage}
            </div>
          )}

          {!isPaid && (
            <div
              className="mb-12 p-6 rounded-[2rem] flex items-center gap-4 bg-amber-50 border border-amber-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <p className="font-black text-amber-900 text-sm tracking-tight">{t.demoBadge}</p>
                <p className="text-amber-800 text-sm font-medium">
                  {t.demoForm}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleContactSubmit}
            className={`space-y-6 ${!isPaid ? 'opacity-70 pointer-events-none select-none' : ''}`}
          >
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">{t.nameLabel}</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder={t.namePlaceholder}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-none focus:bg-white focus:ring-2 text-gray-900 transition-all shadow-inner font-bold placeholder:text-gray-300"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                disabled={!isPaid || status === 'loading'}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">{t.email}</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder={t.emailPlaceholder}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-none focus:bg-white focus:ring-2 text-gray-900 transition-all shadow-inner font-bold placeholder:text-gray-300"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                disabled={!isPaid || status === 'loading'}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">{t.phone}</label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+420 123 456 789"
                className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-none focus:bg-white focus:ring-2 text-gray-900 transition-all shadow-inner font-bold placeholder:text-gray-300"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                disabled={!isPaid || status === 'loading'}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">{t.messageLabel}</label>
              <textarea
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder={t.messagePlaceholder}
                rows={5}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-none focus:bg-white focus:ring-2 text-gray-900 transition-all resize-none shadow-inner font-bold placeholder:text-gray-300"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                disabled={!isPaid || status === 'loading'}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-6 rounded-[1.5rem] text-white font-black text-lg tracking-tight transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
              disabled={!isPaid || status === 'loading'}
            >
              {status === 'loading' ? '...' : (isPaid ? t.sendButton : t.demoBadge)}
            </button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-24 px-6 text-white relative overflow-hidden anti-overflow-container"
        style={{ backgroundColor: '#000' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
            <div className="text-center md:text-left">
              <p className="font-black text-3xl mb-3 tracking-tighter uppercase">{order.company_name}</p>
              {contact?.address && (
                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">{contact.address}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              {order.facebook_url && (
                <a
                  href={isPaid ? order.facebook_url : '#'}
                  onClick={e => !isPaid && e.preventDefault()}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-white hover:text-black font-black text-sm border border-white/10 shadow-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
              {order.instagram_url && (
                <a
                  href={isPaid ? order.instagram_url : '#'}
                  onClick={e => !isPaid && e.preventDefault()}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-white hover:text-black font-black text-sm border border-white/10 shadow-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
            </div>
          </div>
          <div
            className="pt-12 text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {!isPaid && (
              <p
                className="mb-8 px-6 py-2 rounded-full inline-block text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                style={{ backgroundColor: hexAlpha(primaryColor, 0.2), color: primaryColor, border: `1px solid ${hexAlpha(primaryColor, 0.3)}` }}
              >
                {t.demoBadge} – {t.demoSite}
              </p>
            )}
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px]">
              &copy; {new Date().getFullYear()} {order.company_name}. {t.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
