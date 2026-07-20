'use client';

export default function PlumberPage() {
  const services = [
    { name: 'Emergency', desc: '24/7 burst pipe, flooding', price: 'Same Day' },
    { name: 'Drain Cleaning', desc: 'Hydro-jetting, professional equipment', price: '$89+' },
    { name: 'Water Heater', desc: 'Install, repair, all types', price: '$99+' },
    { name: 'Leak Detection', desc: 'Electronic, no damage', price: '$75+' },
    { name: 'Sewer Line', desc: 'Trenchless repair, replacement', price: 'Quote' },
    { name: 'Gas Line', desc: 'Certified gas services', price: '$85+' },
  ];

  return (
    <div className="min-h-screen bg-blue-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">FLOW MASTERS</h1>
              <p className="text-xs text-blue-600 tracking-widest font-semibold">DENVER PLUMBING</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-600">24/7 Emergency</span>
            </span>
            <a href="tel:3035550198" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition">
              (303) 555-0198
            </a>
          </div>
        </div>
      </header>

      {/* Hero - Centered with big number */}
      <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="mb-8">
            <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
              Serving Denver Since 1998
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Denver's Most<br />
            <span className="text-blue-200">Trusted Plumbers</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Fast, honest plumbing. Upfront pricing. 24/7 emergency service when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg">
              Schedule Service
            </button>
            <a href="tel:3035550198" className="px-8 py-4 rounded-lg border-2 border-white/50 font-bold hover:bg-white/10 transition">
              (303) 555-0198
            </a>
          </div>
        </div>
      </section>

      {/* Stats - Pill badges */}
      <section className="py-8 bg-white border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: '⭐', num: '4.9/5', label: 'Google Rating' },
              { icon: '👥', num: '50,000+', label: 'Happy Customers' },
              { icon: '🔧', num: '25+', label: 'Years Experience' },
              { icon: '⏰', num: '24/7', label: 'Emergency Service' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-full">
                <span>{stat.icon}</span>
                <span className="font-bold">{stat.num}</span>
                <span className="text-slate-500 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Clean list */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="mb-10">
            <span className="text-blue-600 text-xs font-bold tracking-[0.2em]">SERVICES</span>
            <h2 className="text-4xl font-black mt-2">What We Do</h2>
          </div>
          
          <div className="space-y-3">
            {services.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-blue-50 transition cursor-pointer group">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-blue-600 transition">{service.name}</h3>
                  <p className="text-slate-500 text-sm">{service.desc}</p>
                </div>
                <span className="text-xl font-black text-blue-600">{service.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Two columns */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-blue-600 text-xs font-bold tracking-[0.2em]">WHY US</span>
              <h2 className="text-4xl font-black mt-2 mb-8">The Flow Masters Difference</h2>
              <div className="space-y-4">
                {[
                  { title: 'Upfront Pricing', desc: 'You\'ll know the cost before we start. No surprises.' },
                  { title: 'Licensed & Insured', desc: 'Full coverage for your protection.' },
                  { title: 'Guaranteed Work', desc: 'All work backed by our 100% satisfaction promise.' },
                  { title: 'Clean & Tidy', desc: 'We leave your home spotless.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">✓</div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Need Service?</h3>
              <p className="text-blue-100 mb-6">Contact us 24/7 for emergency service or schedule at your convenience.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-blue-200 text-sm">Call Us Anytime</p>
                    <p className="font-bold text-xl">(303) 555-0198</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-blue-200 text-sm">Location</p>
                    <p className="font-bold">Denver, CO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas - Simple grid */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="text-blue-600 text-xs font-bold tracking-[0.2em]">COVERAGE</span>
          <h2 className="text-4xl font-black mt-2 mb-8">Service Areas</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Denver', 'Aurora', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Broomfield', 'Littleton', 'Englewood', 'Golden', 'Highlands Ranch'].map((area, i) => (
              <span key={i} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition cursor-pointer">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews - Simple cards */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="text-blue-200 text-xs font-bold tracking-[0.2em]">TESTIMONIALS</span>
          <h2 className="text-4xl font-black mt-2 mb-12">What People Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Lisa A.', text: 'Saved us from a flooded basement at midnight. Incredible service!' },
              { name: 'Marcus J.', text: 'Professional, on-time, fair pricing. Use them for years now.' },
              { name: 'Patricia L.', text: 'Technician was thorough and explained everything clearly.' },
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
                <p className="text-blue-100 mb-4 text-sm leading-relaxed">"{review.text}"</p>
                <p className="font-bold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-black mb-4">Have a Plumbing Problem?</h2>
          <p className="text-slate-500 mb-8">We're here 24/7. Give us a call.</p>
          <a href="tel:3035550198" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-xl transition">
            (303) 555-0198
          </a>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="font-bold">Flow Masters Plumbing</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 • Licensed Plumbers #PC.012345</p>
        </div>
      </footer>
    </div>
  );
}
