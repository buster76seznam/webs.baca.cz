'use client';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Props {
  services: Service[];
}

export default function ServicesVariant2List({ services }: Props) {
  return (
    <section
      id="services"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="text-xs font-black uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            Služby
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            Co nabízíme
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {services.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-10 py-14 ${
                  i < services.length - 1 ? 'border-b border-gray-100' : ''
                } ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Icon block */}
                <div className="flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-sm"
                    style={{
                      backgroundColor: isEven ? 'var(--color-primary-12)' : 'var(--color-secondary-12)',
                      border: isEven ? '1px solid var(--color-primary-20)' : '1px solid var(--color-secondary-20)',
                    }}
                  >
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center md:text-inherit`}>
                  <div
                    className="text-xs font-black uppercase tracking-widest mb-2"
                    style={{ color: isEven ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                  >
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg max-w-lg" style={isEven ? {} : { marginLeft: 'auto' }}>
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
