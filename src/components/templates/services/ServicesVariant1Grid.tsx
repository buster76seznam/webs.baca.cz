'use client';

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
      className="py-24 px-6"
      style={{ backgroundColor: '#f8f8f8' }}
    >
      <div className="max-w-6xl mx-auto">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              style={{ border: '1px solid var(--color-primary-15)' }}
            >
              <div
                className="text-3xl mb-5 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-12)' }}
              >
                {service.icon || '✨'}
              </div>
              <h3
                className="text-lg font-black mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
