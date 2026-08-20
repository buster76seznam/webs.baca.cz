'use client';

import { ArrowRight, Star, ShieldCheck } from 'lucide-react';

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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 w-full max-w-full overflow-hidden bg-slate-900 anti-overflow-container">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900"
        />
      </div>

      {/* Animated Glows - Nebezpečné záporné posuny odstraněny */}
      <div
        className="absolute top-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] max-w-full rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }}
      />
      <div
        className="absolute bottom-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] max-w-full rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.15 }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] mb-8 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md bg-white/5 text-white"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            Verified Business: {companyName}
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white uppercase italic">
            {hero?.title || companyName}
          </h1>
          
          <p className="text-xl md:text-3xl mb-16 max-w-3xl mx-auto leading-relaxed text-slate-400 font-medium">
            {hero?.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#contact"
              className="relative group inline-flex items-center gap-3 px-12 py-6 rounded-full text-white font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 overflow-hidden"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{hero?.ctaText || 'Get Started'}</span>
              <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <div className="flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 backdrop-blur-sm bg-white/5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-[10px] text-white font-black uppercase tracking-tighter mt-0.5">4.9/5 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent opacity-10 pointer-events-none" />
    </section>
  );
}