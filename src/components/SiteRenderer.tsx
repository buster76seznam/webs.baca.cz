'use client';

import { MapPin, Phone, Mail, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import HeroVariant1Split from '@/components/templates/hero/HeroVariant1Split';
import HeroVariant2Centered from '@/components/templates/hero/HeroVariant2Centered';
import HeroVariant3Minimal from '@/components/templates/hero/HeroVariant3Minimal';
import ServicesVariant1Grid from '@/components/templates/services/ServicesVariant1Grid';
import ServicesVariant2List from '@/components/templates/services/ServicesVariant2List';

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; cta_text: string };
  about: { title: string; content: string };
  services: Array<{ title: string; description: string; icon: string }>;
  advantages: Array<{ title: string; description: string }>;
  contact: { email: string; phone: string; address: string };
  theme: { primary_color: string; secondary_color: string; font_style: string };
  layout?: {
    hero_variant?: 'variant_1' | 'variant_2' | 'variant_3';
    services_variant?: 'grid' | 'list';
  };
}

interface OrderRow {
  id: string;
  company_name: string;
  status: string;
  primary_color: string | null;
  language: string | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
}

interface Props {
  data: GeneratedSiteJson;
  order: OrderRow;
  isPaid: boolean;
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

export default function SiteRenderer({ data, order, isPaid }: Props) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const primaryColor = data.theme?.primary_color || order.primary_color || '#7C3AED';
  const secondaryColor = data.theme?.secondary_color || '#10B981';

  const heroVariant = data.layout?.hero_variant || 'variant_1';
  const servicesVariant = data.layout?.services_variant || 'grid';

  const { hero, about, services, advantages, contact } = data;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaid) return;
  };

  const handleApproveClick = () => {
    alert('Stripe Checkout integration coming soon!');
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
    <div className="min-h-screen bg-white text-gray-900 font-sans" style={cssVars}>
      {/* ─── STICKY DEMO BANNER ─── */}
      {!isPaid && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 md:px-8 py-3 shadow-lg"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-yellow-400 text-lg flex-shrink-0">👁️</span>
            <span className="text-white text-sm font-medium truncate">
              Náhled vašeho webu (Demo version)
            </span>
          </div>
          <button
            onClick={handleApproveClick}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <CheckCircle size={16} />
            <span className="hidden sm:inline">Schválit &amp; Aktivovat web na vlastní doméně</span>
            <span className="sm:hidden">Aktivovat web</span>
          </button>
        </div>
      )}
      {!isPaid && <div className="h-14" />}

      {/* ─── HERO ─── */}
      {heroVariant === 'variant_2' ? (
        <HeroVariant2Centered hero={hero} companyName={order.company_name} />
      ) : heroVariant === 'variant_3' ? (
        <HeroVariant3Minimal hero={hero} companyName={order.company_name} />
      ) : (
        <HeroVariant1Split hero={hero} companyName={order.company_name} />
      )}

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: primaryColor }}
              >
                O nás
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-gray-900">
                {about?.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {about?.content}
              </p>
            </div>
            <div
              className="rounded-3xl p-10 flex flex-col gap-6"
              style={{ backgroundColor: hexAlpha(primaryColor, 0.08), border: `1px solid ${hexAlpha(primaryColor, 0.2)}` }}
            >
              {contact?.address && (
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 flex-shrink-0" size={22} style={{ color: primaryColor }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Adresa</p>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
              )}
              {(contact?.phone || order.company_phone) && (
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 flex-shrink-0" size={22} style={{ color: primaryColor }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Telefon</p>
                    <p className="text-gray-600">{contact?.phone || order.company_phone}</p>
                  </div>
                </div>
              )}
              {(contact?.email || order.company_email) && (
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 flex-shrink-0" size={22} style={{ color: primaryColor }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-600">{contact?.email || order.company_email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      {services && services.length > 0 && (
        servicesVariant === 'list'
          ? <ServicesVariant2List services={services} />
          : <ServicesVariant1Grid services={services} />
      )}

      {/* ─── ADVANTAGES ─── */}
      {advantages && advantages.length > 0 && (
        <section id="advantages" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: primaryColor }}
              >
                Proč my
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                Naše výhody
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {advantages.map((adv, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-2xl"
                  style={{ backgroundColor: hexAlpha(primaryColor, 0.06), border: `1px solid ${hexAlpha(primaryColor, 0.15)}` }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Star size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-2">{adv.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── MAP ─── */}
      <section
        id="map"
        className="py-24 px-6"
        style={{ backgroundColor: '#f8f8f8' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Lokalita
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
              Kde nás najdete
            </h2>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-md">
            {!isPaid && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-3xl">
                <MapPin size={40} className="text-white mb-4 opacity-70" />
                <p className="text-white font-bold text-lg mb-1">Interaktivní mapa</p>
                <span
                  className="px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: primaryColor }}
                >
                  Demo verze
                </span>
              </div>
            )}
            {order.google_maps_url && isPaid ? (
              <iframe
                src={order.google_maps_url.replace('/maps/place/', '/maps/embed?q=').replace('https://www.google.com/maps/', 'https://www.google.com/maps/embed?q=')}
                width="100%"
                height="400"
                className="block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa"
              />
            ) : (
              <div
                className="h-80 w-full flex items-center justify-center"
                style={{ backgroundColor: hexAlpha(primaryColor, 0.08) }}
              >
                <div className="text-center">
                  <MapPin size={48} style={{ color: primaryColor }} className="mx-auto mb-3 opacity-40" />
                  <p className="text-gray-400 font-medium">{contact?.address || order.company_address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Kontakt
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
              Napište nám
            </h2>
            <p className="text-gray-500">Máte dotaz nebo zájem o spolupráci? Ozvěte se nám.</p>
          </div>

          {!isPaid && (
            <div
              className="mb-8 p-4 rounded-2xl flex items-start gap-3"
              style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
            >
              <span className="text-2xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-bold text-amber-900 text-sm mb-0.5">Demo verze</p>
                <p className="text-amber-800 text-sm">
                  Formulář bude aktivní po zakoupení webu
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleContactSubmit}
            className={`space-y-5 ${!isPaid ? 'opacity-70 pointer-events-none select-none' : ''}`}
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jméno</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Vaše jméno"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 transition-all"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                disabled={!isPaid}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="vas@email.cz"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 transition-all"
                disabled={!isPaid}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Zpráva</label>
              <textarea
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Jak vám můžeme pomoci?"
                rows={5}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 transition-all resize-none"
                disabled={!isPaid}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-white font-black text-base tracking-wide transition-all"
              style={{ backgroundColor: primaryColor }}
              disabled={!isPaid}
            >
              {isPaid ? 'Odeslat zprávu' : 'Demo verze – formulář bude aktivní po zakoupení webu'}
            </button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-12 px-6 text-white"
        style={{ backgroundColor: '#111' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-black text-xl mb-1">{order.company_name}</p>
              {contact?.address && (
                <p className="text-gray-400 text-sm">{contact.address}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {order.facebook_url && (
                <a
                  href={isPaid ? order.facebook_url : '#'}
                  onClick={e => !isPaid && e.preventDefault()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80 font-black text-sm"
                  style={{ backgroundColor: hexAlpha(primaryColor, 0.3), color: primaryColor }}
                  aria-label="Facebook"
                >
                  f
                </a>
              )}
              {order.instagram_url && (
                <a
                  href={isPaid ? order.instagram_url : '#'}
                  onClick={e => !isPaid && e.preventDefault()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80 font-black text-sm"
                  style={{ backgroundColor: hexAlpha(primaryColor, 0.3), color: primaryColor }}
                  aria-label="Instagram"
                >
                  ig
                </a>
              )}
            </div>
          </div>
          <div
            className="mt-8 pt-6 text-center text-xs text-gray-600"
            style={{ borderTop: '1px solid #222' }}
          >
            {!isPaid && (
              <p
                className="mb-3 px-4 py-2 rounded-lg inline-block text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: hexAlpha(primaryColor, 0.2), color: primaryColor }}
              >
                Demo verze – pouze náhled
              </p>
            )}
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} {order.company_name}. Všechna práva vyhrazena.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
