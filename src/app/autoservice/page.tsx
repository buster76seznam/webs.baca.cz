'use client';

export default function AutoServicePage() {
  const services = [
    { name: 'Oil Change', price: '$39.99', desc: 'Full synthetic with inspection', popular: true },
    { name: 'Brake Service', price: '$89', desc: 'Pad replacement included', popular: false },
    { name: 'Tire Rotation', price: '$29.99', desc: 'Extends tire life', popular: false },
    { name: 'AC Service', price: '$119', desc: 'Full diagnosis & recharge', popular: true },
    { name: 'Transmission', price: '$299+', desc: 'Fluid change & diagnostic', popular: false },
    { name: 'Full Inspection', price: '$149', desc: '200+ point check', popular: true },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header - Clean minimal */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-black text-white">P</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">PREMIER AUTO CARE</h1>
              <p className="text-xs text-emerald-600 tracking-[0.2em]">PHOENIX, AZ</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition">Services</a>
            <a href="#about" className="hover:text-emerald-600 transition">About</a>
            <a href="#reviews" className="hover:text-emerald-600 transition">Reviews</a>
            <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero - Magazine style centered */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-12 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.3em] text-emerald-600 mb-6">FAMILY-OWNED SINCE 1985</span>
          <h1 className="text-6xl md:text-7xl font-black leading-[0.85] mb-8 text-slate-900">
            Your Car Deserves<br />
            <span className="text-emerald-500">Honest Service</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            No upsells. No surprises. Certified mechanics who treat your vehicle like their own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition">
              Schedule Service
            </button>
            <a href="tel:6025550199" className="px-8 py-4 rounded-lg border-2 border-slate-200 font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition">
              (602) 555-0199
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges - Horizontal strip */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-emerald-400">1,247</span>
              <span className="text-xs text-slate-400 tracking-wide">5-STAR REVIEWS</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-emerald-400">ASE</span>
              <span className="text-xs text-slate-400 tracking-wide">CERTIFIED</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-emerald-400">A+</span>
              <span className="text-xs text-slate-400 tracking-wide">BBB RATING</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-emerald-400">24mo</span>
              <span className="text-xs text-slate-400 tracking-wide">WARRANTY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Clean cards */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-12">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-[0.3em] text-emerald-600">WHAT WE OFFER</span>
            <h2 className="text-4xl font-black mt-2">Services & Pricing</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className={`p-6 rounded-xl border transition-all cursor-pointer ${
                service.popular 
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      {service.popular && (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Popular</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm">{service.desc}</p>
                  </div>
                  <span className="text-2xl font-black text-emerald-500">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Simple list */}
      <section id="about" className="py-32 bg-slate-50">
        <div className="max-w-3xl mx-auto px-12">
          <span className="text-xs font-bold tracking-[0.3em] text-emerald-600">THE PREMIER PROMISE</span>
          <h2 className="text-4xl font-black mt-2 mb-12">Why Choose Us</h2>
          
          <div className="space-y-6">
            {[
              { title: 'Honest Estimates', desc: 'The price we quote is the price you pay. No hidden fees.' },
              { title: 'Certified Technicians', desc: 'ASE-certified mechanics with continuous training.' },
              { title: 'Quality Parts', desc: 'OEM or equivalent parts with 24-month warranty.' },
              { title: 'Convenience', desc: 'Online booking, shuttle service, early drop-off.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 bg-white rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews - Simple centered */}
      <section id="reviews" className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-12 text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-emerald-600">REAL CUSTOMERS</span>
          <h2 className="text-4xl font-black mt-2 mb-16">What They Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Michael Rodriguez', city: 'Scottsdale', text: 'Best auto shop in Phoenix! Fair prices and honest service for 15 years.' },
              { name: 'Sarah Thompson', city: 'Tempe', text: 'Exceeded all expectations. No upsells, just honest work.' },
              { name: 'David Chen', city: 'Mesa', text: 'Outstanding service. Got my oil change done in under an hour.' },
            ].map((review, i) => (
              <div key={i} className="text-left p-6 bg-slate-50 rounded-xl">
                <p className="text-slate-600 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.name}</p>
                    <p className="text-slate-400 text-xs">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact - Two columns */}
      <section id="contact" className="py-32 bg-emerald-500 text-white">
        <div className="max-w-5xl mx-auto px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-4">Ready to Experience the Difference?</h2>
              <p className="text-emerald-100 mb-8">Join thousands of satisfied customers in Phoenix.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">📞</div>
                  <div>
                    <p className="text-emerald-200 text-sm">Call Us</p>
                    <p className="font-bold text-xl">(602) 555-0199</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">📍</div>
                  <div>
                    <p className="text-emerald-200 text-sm">Visit Us</p>
                    <p className="font-bold">2847 W Camelback Rd, Phoenix</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white text-slate-900 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Schedule Appointment</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-slate-200 rounded-lg" />
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-slate-200 rounded-lg" />
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg">
                  <option>Select Service</option>
                  <option>Oil Change - $39.99</option>
                  <option>Brake Service - $89+</option>
                </select>
                <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg">Request</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-black text-sm">P</div>
            <span className="font-bold">Premier Auto Care</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 • Family-owned since 1985</p>
        </div>
      </footer>
    </div>
  );
}
