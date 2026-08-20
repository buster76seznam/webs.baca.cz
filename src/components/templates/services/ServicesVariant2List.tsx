'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon?: string;
}

interface Props {
  services: Service[];
}

export default function ServicesVariant2List({ services }: Props) {
  return (
    <section
      id="services"
      className="py-32 px-6 bg-slate-50 w-full max-w-full overflow-x-hidden relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <div
            className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 inline-block px-4 py-2 rounded-full bg-white shadow-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            Capabilities
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6">
            Core Services
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto italic">
            Delivering excellence through precision and professional expertise.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {services.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-16 p-12 rounded-[3rem] bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 group ${
                  isEven ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* Icon block */}
                <div className="flex-shrink-0 relative overflow-hidden">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] opacity-10 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl bg-slate-50 relative z-10 border border-slate-100 group-hover:scale-110 transition-transform duration-500"
                  >
                    {service.icon || '✨'}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center md:text-inherit`}>
                  <div className={`flex items-center gap-3 mb-6 ${isEven ? 'justify-start' : 'justify-end md:flex-row-reverse'}`}>
                     <span
                      className="text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full bg-slate-50 text-slate-400"
                    >
                      Step #{String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px w-8 bg-slate-100" />
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-relaxed text-xl max-w-xl font-medium mb-10" style={isEven ? {} : { marginLeft: 'auto' }}>
                    {service.description}
                  </p>
                  
                  <div className={`flex flex-wrap items-center gap-6 ${isEven ? 'justify-start' : 'justify-end'}`}>
                    {['Expertise', 'Reliability', 'Quality'].map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
