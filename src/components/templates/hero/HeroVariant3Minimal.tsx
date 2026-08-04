'use client';

import { ArrowRight } from 'lucide-react';

interface HeroData {
  title: string;
  subtitle: string;
  cta_text: string;
}

interface Props {
  hero: HeroData;
  companyName: string;
}

export default function HeroVariant3Minimal({ hero, companyName }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center px-6 py-24 bg-white overflow-hidden">
      {/* Subtle accent line */}
      <div
        className="absolute left-0 top-0 h-full w-1 pointer-events-none"
        style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }}
      />

      {/* Large background typography */}
      <div
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 text-[20vw] font-black leading-none select-none pointer-events-none opacity-[0.04] tracking-tighter"
        style={{ color: 'var(--color-primary)' }}
        aria-hidden="true"
      >
        {companyName.split(' ')[0]?.toUpperCase()}
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Small label */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-8 h-px"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <span
            className="text-xs font-black uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-primary)' }}
          >
            {companyName}
          </span>
        </div>

        {/* Giant typographic title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-gray-900 mb-10">
          {hero?.title || companyName}
        </h1>

        {/* Divider */}
        <div
          className="w-24 h-1 rounded-full mb-8"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />

        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
          {hero?.subtitle}
        </p>

        <a
          href="#contact"
          className="inline-flex items-center gap-3 text-base font-black uppercase tracking-widest transition-all group"
          style={{ color: 'var(--color-primary)' }}
        >
          {hero?.cta_text || 'Kontaktujte nás'}
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
}
