'use client';

import { CheckCircle2 } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon?: string;
}

interface Props {
  services: Service[];
}

export default function ServicesVariant1Grid({ services }: Props) {
  return (
    <section
      id="services"
      className="py-32 px-6 w-full max-w-full overflow-x-hidden relative"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div
            className="text-xs font-black uppercase tracking-[0.3em] mb-4 inline-block px-4 py-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-primary-10)', color: 'var(--color-primary)' }}
          >
            Services
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6">
            Our Expertise
          </h2>
          <div className="w-24 h-1.5 bg-slate-100 mx-auto rounded-full" />
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="group relative bg-white/50 rounded-[2rem] p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 backdrop-blur-md border border-slate-200/60 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-var(--color-primary-06) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div
                  className="text-4xl mb-8 w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500"
                >
                  {service.icon || '✨'}
                </div>
                
                <h3
                  className="text-2xl font-black mb-4 tracking-tight"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {service.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed text-lg mb-8 font-medium">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Premium Quality Included
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
