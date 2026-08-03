'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, Star, ArrowRight } from 'lucide-react';

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; cta_text: string };
  about: { title: string; content: string };
  services: Array<{ title: string; description: string; icon: string }>;
  advantages: Array<{ title: string; description: string }>;
  contact: { email: string; phone: string; address: string };
  theme: { primary_color: string; secondary_color: string; font_style: string };
}

interface OrderRow {
  id: string;
  company_name: string;
  status: string;
  generated_site_json: GeneratedSiteJson | null;
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
  order: OrderRow;
  siteJson: GeneratedSiteJson;
  isPaid: boolean;
}

export default function PreviewClient({ order, siteJson, isPaid }: Props) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const primaryColor = siteJson.theme?.primary_color || order.primary_color || '#7C3AED';
  const secondaryColor = siteJson.theme?.secondary_color || '#10B981';

  const { hero, about, services, advantages, contact } = siteJson;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaid) return;
    // Real submission would go here
  };

  const handleApproveClick = () => {
    // Will be wired to Stripe Checkout in a future step
    alert('Stripe Checkout integration coming soon!');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
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

      {/* Spacer for sticky banner */}
      {!isPaid && <div className="h-14" />}

      {/* ─── HERO SECTION ─── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center px-6 py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}10 100%)`,
        }}
      >
        {/* Background decorative circles */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: secondaryColor }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span style={{ color: primaryColor }}>{hero?.title || order.company_name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {hero?.subtitle}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 hover:scale-105 shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            {hero?.cta_text || 'Contact Us'}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: primaryColor }}
              >
                About Us
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
              style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}
            >
              {contact?.address && (
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 flex-shrink-0" size={22} style={{ color: primaryColor }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Address</p>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
              )}
              {(contact?.phone || order.company_phone) && (
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 flex-shrink-0" size={22} style={{ color: primaryColor }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Phone</p>
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

      {/* ─── SERVICES SECTION ─── */}
      {services && services.length > 0 && (
        <section
          id="services"
          className="py-24 px-6"
          style={{ backgroundColor: '#f8f8f8' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: primaryColor }}
              >
                Services
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                What We Offer
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                  style={{ border: `1px solid ${primaryColor}15` }}
                >
                  <div
                    className="text-3xl mb-5 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}12` }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    className="text-lg font-black mb-3"
                    style={{ color: primaryColor }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ADVANTAGES SECTION ─── */}
      {advantages && advantages.length > 0 && (
        <section id="advantages" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: primaryColor }}
              >
                Why Us
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                Our Advantages
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {advantages.map((adv, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-2xl"
                  style={{ backgroundColor: `${primaryColor}06`, border: `1px solid ${primaryColor}15` }}
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

      {/* ─── MAP SECTION ─── */}
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
              Location
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
              Find Us
            </h2>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-md">
            {/* Map overlay – disabled until paid */}
            {!isPaid && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-3xl">
                <MapPin size={40} className="text-white mb-4 opacity-70" />
                <p className="text-white font-bold text-lg mb-1">Interactive Map</p>
                <span
                  className="px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: primaryColor }}
                >
                  Demo version
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
                title="Location map"
              />
            ) : (
              <div
                className="h-80 w-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}08` }}
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

      {/* ─── CONTACT FORM SECTION ─── */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: primaryColor }}
            >
              Contact
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-500">
              Have a question or want to work with us? Drop us a message.
            </p>
          </div>

          {/* Demo warning banner */}
          {!isPaid && (
            <div
              className="mb-8 p-4 rounded-2xl flex items-start gap-3"
              style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
            >
              <span className="text-2xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-bold text-amber-900 text-sm mb-0.5">Demo version</p>
                <p className="text-amber-800 text-sm">
                  Demo verze – formulář bude aktivní po zakoupení webu
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleContactSubmit}
            className={`space-y-5 ${!isPaid ? 'opacity-70 pointer-events-none select-none' : ''}`}
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Your name"
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
                placeholder="your@email.com"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 transition-all"
                disabled={!isPaid}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="How can we help you?"
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
              {isPaid ? 'Send Message' : 'Demo verze – formulář bude aktivní po zakoupení webu'}
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
                  style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
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
                  style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
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
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                Demo version – preview only
              </p>
            )}
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} {order.company_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
