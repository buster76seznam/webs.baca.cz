'use client';

import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap, Globe, Shield, Layout, Settings, Mail, Phone, ArrowUpRight, MousePointer2, Rocket, BarChart3, ChevronDown, X, Clock, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────
   COUNTER HOOK
───────────────────────────────────────── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return { count, start: () => setStarted(true) };
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { count, start } = useCounter(value);
  useEffect(() => { if (inView) start(); }, [inView]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-2">
        {count}<span className="text-brand">{suffix}</span>
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em]">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   TICKER
───────────────────────────────────────── */
const TICKER_ITEMS = [
  "⚡ Návrh do 60 minut", "🚀 Web do 24 hodin", "💎 Bez vstupního poplatku",
  "📈 Weby které vydělávají", "🛡️ SSL & hosting v ceně", "🔧 Servis 24/7",
];
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-black/30 py-4 relative">
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 whitespace-nowrap w-max"
      >
        {items.map((item, i) => (
          <span key={i} className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HERO MOCKUP – rotující ukázky webů
───────────────────────────────────────── */
const MOCKUP_SLIDES = [
  {
    label: "Autoservis",
    color: "#7C3AED",
    url: "autoservisnovak.cz",
    heading: "Autoservis Novák",
    sub: "Pneuservis · Výměna oleje · STK",
    cta: "Rezervovat termín",
    accent: "#A78BFA",
    items: ["✓ Pneuservis", "✓ Výměna oleje", "✓ Klimatizace", "✓ STK příprava"],
  },
  {
    label: "Stavebnictví",
    color: "#0EA5E9",
    url: "stavbyprochazka.cz",
    heading: "Stavby Procházka",
    sub: "Rekonstrukce · Novostavby · Fasády",
    cta: "Získat nabídku",
    accent: "#38BDF8",
    items: ["✓ Rekonstrukce", "✓ Novostavby", "✓ Fasády", "✓ Zateplení"],
  },
  {
    label: "B2B Služby",
    color: "#10B981",
    url: "poradenstvobrno.cz",
    heading: "Poradenství Brno",
    sub: "Finanční · Právní · HR poradenství",
    cta: "Domluvit konzultaci",
    accent: "#34D399",
    items: ["✓ Finanční poradenství", "✓ Právní služby", "✓ HR konzultace", "✓ Due diligence"],
  },
];

function HeroMockup() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % MOCKUP_SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);
  const slide = MOCKUP_SLIDES[active];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow behind */}
      <div
        className="absolute -inset-8 rounded-3xl blur-3xl opacity-20 transition-all duration-1000"
        style={{ background: slide.color }}
      />

      {/* Browser frame */}
      <div className="relative browser-chrome shadow-2xl">
        {/* Browser bar */}
        <div className="browser-bar">
          <div className="browser-dot bg-red-500" />
          <div className="browser-dot bg-yellow-500" />
          <div className="browser-dot bg-green-500" />
          <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-[11px] text-zinc-500 font-mono">
            {slide.url}
          </div>
        </div>

        {/* Website content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="p-6 min-h-[320px] flex flex-col"
            style={{ background: `linear-gradient(135deg, #0a0a0a 0%, ${slide.color}15 100%)` }}
          >
            {/* Fake nav */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg" style={{ background: slide.color }} />
                <span className="text-white font-black text-sm tracking-tight">{slide.heading}</span>
              </div>
              <div className="flex gap-4">
                {['Služby', 'Ceník', 'Kontakt'].map(i => (
                  <span key={i} className="text-zinc-600 text-[10px] font-bold">{i}</span>
                ))}
              </div>
            </div>

            {/* Hero area */}
            <div className="flex-1 flex flex-col justify-center">
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-full w-fit"
                style={{ color: slide.accent, background: `${slide.color}20` }}
              >
                {slide.label}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mb-1">{slide.heading}</h3>
              <p className="text-zinc-500 text-xs mb-5">{slide.sub}</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {slide.items.map((item, i) => (
                  <div key={i} className="text-[11px] text-zinc-400 font-medium">{item}</div>
                ))}
              </div>

              <button
                className="text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl w-fit"
                style={{ background: slide.color }}
              >
                {slide.cta} →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {MOCKUP_SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`transition-all duration-500 rounded-full font-black text-[9px] uppercase tracking-widest px-3 py-1 border
              ${i === active
                ? 'text-white border-transparent'
                : 'text-zinc-600 border-white/10 hover:border-white/20'}`}
            style={i === active ? { background: s.color, borderColor: s.color } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPARISON TABLE
───────────────────────────────────────── */
const COMPARE_ROWS = [
  { label: "První návrh",        them: "2–4 týdny",     us: "60 minut" },
  { label: "Spuštění webu",      them: "2–3 měsíce",    us: "24 hodin" },
  { label: "Vstupní poplatek",   them: "20 000–80 000 Kč", us: "0 Kč" },
  { label: "Měsíční cena",       them: "Skryté poplatky",  us: "1 700 Kč vše v tom" },
  { label: "Počet revizí",       them: "2–3 placené",   us: "Neomezené" },
  { label: "Servis & podpora",   them: "Příplatek",      us: "Zahrnuto 24/7" },
  { label: "Smlouva",            them: "Roční závazek",  us: "Kdykoli zrušit" },
];

function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5">
      {/* Header */}
      <div className="grid grid-cols-3 bg-[#0A0A0A] border-b border-white/5">
        <div className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-600" />
        <div className="p-5 text-center border-x border-white/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Tradiční agentura</div>
          <X size={16} className="text-red-400 mx-auto" />
        </div>
        <div className="p-5 text-center bg-brand/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Webs Bača</div>
          <CheckCircle size={16} className="text-brand mx-auto" />
        </div>
      </div>

      {COMPARE_ROWS.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
          <div className="p-4 md:p-5 flex items-center">
            <span className="text-zinc-400 text-xs md:text-sm font-bold">{row.label}</span>
          </div>
          <div className="p-4 md:p-5 flex items-center justify-center border-x border-white/5">
            <span className="text-zinc-600 text-xs md:text-sm font-medium text-center">{row.them}</span>
          </div>
          <div className="p-4 md:p-5 flex items-center justify-center bg-brand/[0.03]">
            <span className="text-brand text-xs md:text-sm font-black text-center">{row.us}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Jak to celé funguje?", a: "Napíšete nám, do 10 minut vás zkontaktujeme. Stačí pár základních informací a do 60 minut máte v mailu reálný návrh webu. Po schválení web nasadíme do 24 hodin." },
  { q: "Musím platit něco předem?", a: "Ne. Žádný vstupní poplatek, žádná záloha. Platíte až od chvíle, kdy web běží a vy jste spokojeni. Model 1 700 Kč/měsíc zahrnuje vše." },
  { q: "Co když nebudu spokojený s návrhem?", a: "Návrh upravíme dokud nebudete 100% spokojeni. Počet revizí neomezujeme – chceme, aby výsledek byl přesně to, co jste si představovali." },
  { q: "Co všechno je zahrnuto v měsíční platbě?", a: "Prémiový hosting, SSL certifikát, správa obsahu, technický servis, vysoká rychlost načítání a designové změny. Vše pod jednou střechou bez skrytých poplatků." },
  { q: "Mohu kdykoli zrušit spolupráci?", a: "Ano, bez jakýchkoli sankcí. Nevážeme vás dlouhodobými smlouvami. Věříme, že pokud odvedeme dobrou práci, budete chtít zůstat sami." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-white/5 transition-all duration-300 ${open ? 'border-brand/20' : ''}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <span className={`text-base md:text-lg font-black tracking-tight transition-colors duration-300 pr-4 ${open ? 'text-brand' : 'text-white group-hover:text-brand'}`}>{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-zinc-600 transition-all duration-500 group-hover:text-brand ${open ? 'rotate-180 text-brand' : ''}`} />
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="overflow-hidden">
        <p className="text-zinc-400 font-medium leading-relaxed pb-6 text-base max-w-3xl">{a}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) { setErrorMsg('Vyplň prosím jméno, e-mail a zprávu.'); return; }
    setStatus('loading'); setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || 'Chyba při odesílání.'); setStatus('error'); return; }
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch { setErrorMsg('Nepodařilo se odeslat. Zkus to znovu.'); setStatus('error'); }
  };

  const inputClass = `w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_-8px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm`;
  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block';

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-16 text-center">
        <div className="text-5xl mb-5">✅</div>
        <h3 className="text-2xl font-black mb-2 tracking-tight">Zpráva odeslána!</h3>
        <p className="text-zinc-400 font-medium mb-8">Ozveme se ti do 60 minut.</p>
        <button onClick={() => setStatus('idle')} className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">Odeslat další zprávu</button>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div><label className={labelClass}>Jméno *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jan Novák" className={inputClass} /></div>
        <div><label className={labelClass}>E-mail *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@firma.cz" className={inputClass} /></div>
      </div>
      <div className="mb-4"><label className={labelClass}>Telefon <span className="text-zinc-700 normal-case tracking-normal font-normal">(nepovinné)</span></label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+420 777 123 456" className={inputClass} /></div>
      <div className="mb-6"><label className={labelClass}>Zpráva *</label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Popište co potřebujete – typ webu, obor, termín..." rows={4} className={`${inputClass} resize-none`} /></div>
      {(errorMsg || status === 'error') && <p className="text-red-400 text-sm font-bold mb-5 text-center">{errorMsg}</p>}
      <button onClick={handleSubmit} disabled={status === 'loading'} className="w-full bg-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)] disabled:opacity-60 flex items-center justify-center gap-3">
        {status === 'loading' ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Odesílám...</>) : (<>Odeslat poptávku <ArrowUpRight size={16} /></>)}
      </button>
      <p className="text-zinc-700 text-xs text-center mt-4 font-medium">Odpovídáme do 60 minut • webs.baca@gmail.com</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowMobileCTA(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: 'easeOut' as const }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-brand selection:text-white antialiased">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'h-16 bg-black/50 backdrop-blur-2xl border-b border-white/5' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl border-2 border-brand group-hover:border-brand-light transition-all duration-500 shadow-xl shadow-brand/20">
              {!logoError ? (
                <Image src="/Logo.jpg" alt="Webs Bača Logo" fill className="object-cover" onError={() => setLogoError(true)} priority />
              ) : (
                <div className="w-full h-full bg-brand flex items-center justify-center"><span className="text-white font-black">W</span></div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tighter uppercase leading-none">WEBS BAČA</span>
              <span className="text-[8px] font-black text-brand tracking-[0.4em] mt-0.5 opacity-80 uppercase hidden sm:block">Premium Digital</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
            {[
              { id: 'why', label: 'Proč my' },
              { id: 'pricing', label: 'Ceník' },
              { id: 'process', label: 'Proces' },
              { id: 'specialization', label: 'Specializace' },
              { id: 'faq', label: 'FAQ' },
              { id: 'kontakt', label: 'Kontakt' },
            ].map(item => (
              <a key={item.id} href={`#${item.id}`} className="hover:text-brand transition-all duration-300">{item.label}</a>
            ))}
          </div>

          <a href="#kontakt" className="bg-brand text-white px-5 md:px-7 py-3 rounded-xl text-xs font-black hover:bg-brand-dark transition-all duration-500 uppercase tracking-widest shadow-[0_0_25px_-5px_rgba(124,58,237,0.5)]">
            Chci návrh
          </a>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-24 pb-0 px-6 md:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1),transparent_65%)]" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-1/4 -left-1/3 w-[700px] h-[700px] bg-brand/10 rounded-full blur-[140px]" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-dark/10 rounded-full blur-[140px]" />

          <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-6rem)]">
            {/* Left – text */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-2 mb-8">
                <Star size={12} className="text-brand" />
                <span className="text-[11px] font-black uppercase tracking-widest text-brand">Hosting & Web pro české firmy</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.88] mb-8 uppercase">
                VÁŠ WEB<br />
                <span className="text-gradient">BEZ LIMITŮ</span><br />
                <span className="text-zinc-600">BEZ ČEKÁNÍ.</span>
              </h1>

              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg">
                Návrh do <span className="text-white font-bold">60 minut</span>. Web spuštěný do <span className="text-white font-bold">24 hodin</span>. Vše za <span className="text-brand font-bold">1 700 Kč/měsíc</span> – bez vstupního poplatku.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#kontakt" className="flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl text-sm font-black hover:bg-zinc-100 transition-all duration-400 group uppercase tracking-tight shadow-xl">
                  Chci návrh do hodiny
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
                <a href="#why" className="flex items-center justify-center gap-3 glass px-8 py-5 rounded-2xl text-sm font-bold hover:bg-white/5 transition-all duration-400 uppercase tracking-tight">
                  Jak to funguje?
                </a>
              </div>

              {/* Mini stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/5">
                {[{ n: '24h', l: 'Dodání' }, { n: '0 Kč', l: 'Záloha' }, { n: '∞', l: 'Revizí' }].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-brand tracking-tighter">{s.n}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }} className="hidden lg:block">
              <HeroMockup />
            </motion.div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── STAT COUNTERS ── */}
        <section className="section-py px-6 md:px-8 bg-[#020202] border-b border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatCounter value={24}  suffix="h"   label="Max. čas dodání" />
            <StatCounter value={0}   suffix=" Kč" label="Vstupní poplatek" />
            <StatCounter value={100} suffix="%"   label="Spokojenost" />
            <StatCounter value={60}  suffix="min" label="První návrh" />
          </div>
        </section>

        {/* ── WHY / SROVNÁVACÍ TABULKA ── */}
        <section id="why" className="section-py px-6 md:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="mb-14 max-w-2xl">
              <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Tradiční agentura vs Webs Bača</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase mb-5">
                KONEC DRAHÝCH<br /><span className="text-gradient">VÝMLUV.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-medium">Podívejte se na čísla. Bez marketingové omáčky.</p>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <ComparisonTable />
            </motion.div>

            {/* CTA pod tabulkou */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between p-6 md:p-8 bg-brand/5 border border-brand/20 rounded-3xl">
              <div>
                <p className="font-black text-lg tracking-tight">Přesvědčeni? Návrh zdarma do 60 minut.</p>
                <p className="text-zinc-500 text-sm mt-1">Bez závazků. Bez vstupního poplatku.</p>
              </div>
              <a href="#kontakt" className="shrink-0 flex items-center gap-2 bg-brand text-white px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-dark transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)]">
                Chci návrh <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="section-py px-6 md:px-8 relative overflow-hidden bg-[#020202]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand/5 rounded-full blur-[180px] pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="text-center mb-14">
              <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Jednoduchost v každém detailu</p>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase mb-4">
                MODEL <span className="text-gradient">1700.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-medium">Jeden tarif. Vše zahrnuto.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Main pricing card */}
              <motion.div {...fadeIn} className="md:col-span-2 glass-purple p-8 md:p-10 rounded-3xl relative group">
                <div className="absolute -top-4 left-8 bg-brand px-6 py-2 rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/40">
                  Nejoblíbenější volba
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl md:text-8xl font-black tracking-tighter text-gradient-brand leading-none">1700</span>
                      <span className="text-zinc-500 font-bold text-sm">CZK / měsíc<br />bez DPH</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: Globe, text: "Prémiový Hosting" },
                    { icon: Shield, text: "SSL Certifikát" },
                    { icon: Layout, text: "Správa Obsahu" },
                    { icon: Settings, text: "Technický Servis" },
                    { icon: Zap, text: "Vysoká Rychlost" },
                    { icon: CheckCircle, text: "Neomezené revize" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center group-hover/item:bg-brand transition-all duration-300 shrink-0">
                        <item.icon size={13} className="text-brand group-hover/item:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-300">{item.text}</span>
                    </div>
                  ))}
                </div>

                <a href="#kontakt" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-zinc-100 transition-all duration-300 uppercase tracking-tight shadow-xl">
                  Začít spolupráci <ArrowUpRight size={16} />
                </a>
              </motion.div>

              {/* Side info cards */}
              <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="flex flex-col gap-6">
                <div className="card-premium p-6 rounded-3xl flex-1 flex flex-col justify-between group">
                  <Clock size={28} className="text-brand/40 group-hover:text-brand transition-colors duration-500 mb-4" />
                  <div>
                    <div className="text-3xl font-black tracking-tighter mb-2">24 hodin</div>
                    <p className="text-zinc-600 text-sm font-medium leading-relaxed">Od schválení návrhu do spuštěného webu. Garantováno.</p>
                  </div>
                </div>
                <div className="card-premium p-6 rounded-3xl flex-1 flex flex-col justify-between group">
                  <Rocket size={28} className="text-brand/40 group-hover:text-brand transition-colors duration-500 mb-4" />
                  <div>
                    <div className="text-3xl font-black tracking-tighter mb-2">0 Kč vstup</div>
                    <p className="text-zinc-600 text-sm font-medium leading-relaxed">Žádná záloha, žádný vstupní poplatek. Platíte až když jste spokojeni.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" className="section-py px-6 md:px-8 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-14">
              <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Tři kroky k novému webu</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                JAK <span className="text-gradient">DOMINUJEME.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* connecting line on desktop */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

              {[
                { step: "01", icon: Mail, title: "BRIEFING", desc: "10 minut nám stačí. Napište nebo zavolejte – zjistíme co potřebujete." },
                { step: "02", icon: Layout, title: "DESIGN", desc: "Do 60 minut máte v mailu reálný návrh. Vidíte přesně to, co dostanete." },
                { step: "03", icon: Rocket, title: "LAUNCH", desc: "Ladíme detaily a do 24 hodin web běží na vaší doméně. Hotovo." },
              ].map((item, i) => (
                <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.15 }} className="relative group">
                  <div className="card-premium p-8 rounded-3xl h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center group-hover:bg-brand transition-all duration-500">
                        <item.icon size={22} className="text-brand group-hover:text-white transition-colors duration-500" />
                      </div>
                      <span className="text-5xl font-black text-white/5 group-hover:text-brand/10 transition-colors duration-700 select-none">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-black italic text-brand tracking-wider mb-3">{item.title}</h3>
                    <p className="text-zinc-500 font-medium leading-relaxed flex-1">{item.desc}</p>
                    <div className="mt-6 w-8 h-0.5 bg-brand/30 group-hover:w-full group-hover:bg-brand transition-all duration-700" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIALIZATION ── */}
        <section id="specialization" className="section-py px-6 md:px-8 bg-[#050505]">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeIn} className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Ověřené postupy pro váš obor</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                  VAŠE <span className="text-gradient">SPECIALIZACE.</span>
                </h2>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "AUTOSERVISY", desc: "Lokální SEO, online rezervace a přehledné ceníky. Váš servis bude vidět tam, kde ho lidé hledají.", icon: Settings, color: "#7C3AED" },
                { title: "STAVEBNICTVÍ", desc: "Profesionální galerie realizací, které budují důvěru. Reference, které mluví samy za sebe.", icon: Layout, color: "#0EA5E9" },
                { title: "B2B SLUŽBY", desc: "Lead-gen weby navržené pro konverzi. Změňte návštěvníky v platící klienty.", icon: MousePointer2, color: "#10B981" },
              ].map((item, i) => (
                <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.1 }} className="card-premium p-8 rounded-3xl group flex flex-col">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                    style={{ background: `${item.color}15` }}>
                    <item.icon size={26} style={{ color: item.color }} className="transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-black mb-3 italic tracking-wide text-white group-hover:text-brand transition-colors duration-500">{item.title}</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed flex-1">{item.desc}</p>
                  <div className="mt-6 text-brand font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                    Prozkoumat řešení <ArrowUpRight size={12} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="section-py px-6 md:px-8 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-14">
              <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Nejčastější otázky</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">FAQ</h2>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              {FAQ_ITEMS.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
            </motion.div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="kontakt" className="section-py px-6 md:px-8 bg-[#020202] border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-14">
              <p className="text-brand text-[11px] font-black uppercase tracking-[0.5em] mb-4">Odpovídáme do 60 minut</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">
                NAPIŠTE <span className="text-gradient">NÁM.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-medium">Bez závazků. Návrh zdarma.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <ContactForm />
            </motion.div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="section-py px-6 md:px-8">
          <motion.div {...fadeIn} className="max-w-5xl mx-auto bg-brand p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(124,58,237,0.4)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">
                ZAČNĚTE<br />VYDĚLÁVAT<br />UŽ ZÍTRA.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#kontakt" className="bg-white text-black px-10 py-5 rounded-2xl text-base font-black hover:scale-105 transition-all duration-400 uppercase tracking-tight shadow-2xl">
                  Chci návrh do hodiny
                </a>
                <a href="mailto:webs.baca.support@gmail.com" className="bg-black/30 backdrop-blur text-white px-10 py-5 rounded-2xl text-base font-black hover:bg-black/50 transition-all duration-400 uppercase tracking-tight border border-white/15">
                  Domluvit hovor
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-16 md:py-24 px-6 md:px-8 border-t border-white/5 bg-[#020202]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-8 group cursor-pointer w-fit">
                <div className="relative w-12 h-12 overflow-hidden rounded-xl border-2 border-brand group-hover:border-brand-light transition-all duration-500 shadow-xl shadow-brand/20">
                  {!logoError ? (
                    <Image src="/Logo.jpg" alt="Logo" fill className="object-cover" onError={() => setLogoError(true)} />
                  ) : (
                    <div className="w-full h-full bg-brand flex items-center justify-center"><span className="text-white font-black text-xl">W</span></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">WEBS BAČA</span>
                  <span className="text-[9px] font-black text-brand tracking-[0.5em] mt-1 uppercase">The Drive to Success</span>
                </div>
              </div>
              <p className="text-zinc-500 text-sm max-w-xs leading-relaxed font-medium">
                Nejmodernější technologie a AI pro váš byznys. Náskok, který konkurence nedožene.
              </p>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand mb-6">Kontakt</h4>
              <div className="flex flex-col gap-4 text-sm font-bold text-zinc-400">
                <a href="mailto:webs.baca@gmail.com" className="hover:text-white transition-colors flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:bg-brand transition-colors"><Mail size={14} /></div>
                  webs.baca@gmail.com
                </a>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center"><Phone size={14} /></div>
                  Support 24/7
                </div>
              </div>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand mb-6">Navigace</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                {[['#why','Proč my'],['#pricing','Ceník'],['#process','Proces'],['#specialization','Obory'],['#faq','FAQ'],['#kontakt','Kontakt']].map(([href, label]) => (
                  <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">© 2026 Webs Bača • Vytvořeno s vášní pro efektivitu</div>
            <div className="flex gap-8 text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">
              <span className="hover:text-brand cursor-pointer transition-colors">GDPR</span>
              <span className="hover:text-brand cursor-pointer transition-colors">VOP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MOBILNÍ PLOVOUCÍ CTA ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showMobileCTA ? 0 : 100, opacity: showMobileCTA ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-5 left-4 right-4 z-50 md:hidden"
      >
        <a href="#kontakt" className="flex items-center justify-center gap-2 w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_30px_-5px_rgba(124,58,237,0.7)]">
          Chci návrh → <span className="opacity-60 text-xs">do 60 minut</span>
        </a>
      </motion.div>

    </div>
  );
}
