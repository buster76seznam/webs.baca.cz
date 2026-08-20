'use client';

import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
}

interface Props {
  hero: HeroData;
  companyName: string;
}

export default function HeroVariant3Minimal({ hero, companyName }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center px-6 py-32 bg-white w-full max-w-full overflow-x-hidden">
      {/* Background Graphic Element */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-50 pointer-events-none hidden lg:block" />
      
      {/* Large background typography */}
      <div
        className="absolute right-[5%] top-1/2 -translate-y-1/2 text-[15vw] font-black leading-none select-none pointer-events-none opacity-[0.03] tracking-tighter hidden lg:block"
        style={{ color: 'var(--color-primary)' }}
        aria-hidden="true"
      >
        {companyName.split(' ')[0]?.toUpperCase()}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            {/* Small label */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-12 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span
                className="text-xs font-black uppercase tracking-[0.4em] text-gray-400"
              >
                Premium Excellence
              </span>
            </div>

            {/* Giant typographic title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-gray-900 mb-12">
              {hero?.title || companyName}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-10 mb-16">
              <p className="text-xl text-gray-500 max-w-md leading-relaxed font-medium border-l-4 border-slate-100 pl-8">
                {hero?.subtitle}
              </p>
              
              <div className="space-y-3">
                {['Industry Leader', '24/7 Support', 'Global Quality'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-4 px-10 py-6 rounded-2xl text-white font-black text-xl transition-all shadow-2xl hover:-translate-y-1 active:scale-95 group"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {hero?.ctaText || 'Get Started'}
              <ArrowRight
                size={24}
                className="transition-transform group-hover:translate-x-2"
              />
            </a>
          </div>
          
          <div className="lg:col-span-5 relative hidden md:block">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e5381bbd7?q=80&w=2000&auto=format&fit=crop" 
                alt="Workspace" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-var(--color-primary) to-transparent opacity-20 mix-blend-overlay" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 p-8 bg-white rounded-3xl shadow-2xl border border-slate-50 max-w-[280px] hidden xl:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-lg">4.9/5</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Average Rating</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                "The most professional service I have ever used. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
