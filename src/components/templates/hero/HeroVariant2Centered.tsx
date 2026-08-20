'use client';

import { ArrowRight } from 'lucide-react';

interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
}

interface Props {
  hero: HeroData;
  companyName: string;
}

export default function HeroVariant2Centered({ hero, companyName }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-24 w-full max-w-full overflow-x-hidden">
      {/* Full-width gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          opacity: 0.92,
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div
          className="inline-block text-xs font-black uppercase tracking-widest mb-8 px-4 py-2 rounded-full border"
          style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.9)' }}
        >
          {companyName}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-white">
          {hero?.title || companyName}
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {hero?.subtitle}
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'var(--color-primary)' }}
        >
          {hero?.ctaText || 'Kontaktujte nás'}
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
}
