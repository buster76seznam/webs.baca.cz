'use client';

import { ArrowRight, Star } from 'lucide-react';

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
    <section className="relative min-h-[95vh] flex items-center w-full max-w-full overflow-x-hidden px-6 py-32 bg-slate-50">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 0% 0%, var(--color-primary-20) 0%, transparent 50%), radial-gradient(circle at 100% 100%, var(--color-secondary-20) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-sm bg-white border border-slate-100"
                style={{ color: 'var(--color-primary)' }}
              >
                #1 {companyName}
              </div>
              <div className="h-px w-8 bg-slate-200" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Choice</div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95] text-gray-900">
              {hero?.title || companyName}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
              {hero?.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#contact"
                className="relative group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-black text-lg transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:scale-95 overflow-hidden"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">{hero?.ctaText || 'Get Started'}</span>
                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter ml-2">
                  <span className="text-gray-900">500+</span> happy clients
                </div>
              </div>
            </div>
          </div>

          {/* Right: Graphic */}
          <div className="relative lg:h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] opacity-10 blur-3xl rounded-full scale-75 animate-pulse" />
            <div
              className="relative w-full aspect-[4/5] max-w-[450px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-white group"
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop" 
                alt={companyName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shrink-0">
                    <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg leading-none mb-1">Top Rated</p>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Industry Leader 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
