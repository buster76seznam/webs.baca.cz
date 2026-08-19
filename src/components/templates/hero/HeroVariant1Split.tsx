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

export default function HeroVariant1Split({ hero, companyName }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 py-24">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-10) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: 'linear-gradient(225deg, var(--color-secondary-10) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div
              className="inline-block text-xs font-black uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
            >
              {companyName}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-gray-900">
              {hero?.title || companyName}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              {hero?.subtitle}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 hover:scale-105 shadow-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {hero?.ctaText || 'Kontaktujte nás'}
              <ArrowRight size={20} />
            </a>
          </div>

          {/* Right: Graphic */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-full aspect-square max-w-md rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl"
              style={{ backgroundColor: 'var(--color-primary-08)', border: '1px solid var(--color-primary-20)' }}
            >
              {/* Decorative abstract shapes */}
              <div className="relative w-full h-full p-8 flex flex-col items-center justify-center gap-4">
                <div
                  className="w-32 h-32 rounded-full opacity-30 blur-xl"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div
                  className="absolute top-8 right-8 w-16 h-16 rounded-2xl rotate-12 opacity-40"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                />
                <div
                  className="absolute bottom-8 left-8 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div className="relative z-10 text-center">
                  <p
                    className="text-5xl font-black tracking-tight leading-none"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3)}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 font-medium">{companyName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
