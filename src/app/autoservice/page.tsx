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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-16 py-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-white">P</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">PREMIER AUTO CARE</h1>
              <p className="text-sm text-emerald-600 tracking-[0.2em]">PHOENIX, AZ</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-base font-medium text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition">Services</a>
            <a href="#about" className="hover:text-emerald-600 transition">About</a>
            <a href="#reviews" className="hover:text-emerald-600 transition">Reviews</a>
            <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-16 py-24 w-full">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-bold tracking-[0.3em] text-emerald-600 mb-8">FAMILY-OWNED SINCE 1985</span>
            <h1 className="text-7xl lg:text-8xl font-black leading-[0.9] mb-8 text-slate-900">
              Your Car Deserves<br />
              <span className="text-emerald-500">Honest Service</span>
            </h1>
            <p className="text-2xl text-slate-500 mb-12 leading-relaxed">
              No upsells. No surprises. Certified mechanics who treat your vehicle like their own.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition shadow-xl">
                Schedule Service
              </button>
              <a href="tel:6025550199" className="px-10 py-5 rounded-xl border-2 border-slate-300 font-bold text-xl text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition">
                (602) 555-0199
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-emerald-400">1,247</span>
              <span className="text-sm text-slate-400 tracking-wider">5-STAR REVIEWS</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-emerald-400">ASE</span>
              <span className="text-sm text-slate-400 tracking-wider">CERTIFIED</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-emerald-400">A+</span>
              <span className="text-sm text-slate-400 tracking-wider">BBB RATING</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl font-black text-emerald-400">24mo</span>
              <span className="text-sm text-slate-400 tracking-wider">WARRANTY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-16">
          <div className="mb-16">
            <span className="text-sm font-bold tracking-[0.3em] text-emerald-600">WHAT WE OFFER</span>
            <h2 className="text-6xl font-black mt-4">Services & Pricing</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div key={i} className={`p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                service.popular 
                  ? 'bg-emerald-50 border-emerald-300 hover:border-emerald-500' 
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{service.name}</h3>
                      {service.popular && (
                        <span className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold">Popular</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-lg">{service.desc}</p>
                  </div>
                  <span className="text-4xl font-black text-emerald-500">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="about" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-16">
          <span className="text-sm font-bold tracking-[0.3em] text-emerald-600">THE PREMIER PROMISE</span>
          <h2 className="text-6xl font-black mt-4 mb-20">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { title: 'Honest Estimates', desc: 'The price we quote is the price you pay. No hidden fees.' },
              { title: 'Certified Technicians', desc: 'ASE-certified mechanics with continuous training.' },
              { title: 'Quality Parts', desc: 'OEM or equivalent parts with 24-month warranty.' },
              { title: 'Convenience', desc: 'Online booking, shuttle service, early drop-off.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black text-white shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-16">
          <span className="text-sm font-bold tracking-[0.3em] text-emerald-600">REAL CUSTOMERS</span>
          <h2 className="text-6xl font-black mt-4 mb-20">What They Say</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Michael Rodriguez', city: 'Scottsdale', text: 'Best auto shop in Phoenix! Fair prices and honest service for 15 years.' },
              { name: 'Sarah Thompson', city: 'Tempe', text: 'Exceeded all expectations. No upsells, just honest work.' },
              { name: 'David Chen', city: 'Mesa', text: 'Outstanding service. Got my oil change done in under an hour.' },
            ].map((review, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-2xl">
                <p className="text-slate-600 text-xl mb-8 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{review.name}</p>
                    <p className="text-slate-400">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 bg-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-16">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl font-black mb-6">Ready to Experience the Difference?</h2>
              <p className="text-2xl text-emerald-100 mb-12">Join thousands of satisfied customers in Phoenix.</p>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">📞</div>
                  <div>
                    <p className="text-emerald-200 text-lg">Call Us</p>
                    <p className="font-bold text-3xl">(602) 555-0199</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">📍</div>
                  <div>
                    <p className="text-emerald-200 text-lg">Visit Us</p>
                    <p className="font-bold text-2xl">2847 W Camelback Rd, Phoenix</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white text-slate-900 p-12 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-bold mb-8">Schedule Appointment</h3>
              <div className="space-y-5">
                <input type="text" placeholder="Your Name" className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl text-lg" />
                <input type="tel" placeholder="Phone" className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl text-lg" />
                <select className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl text-lg">
                  <option>Select Service</option>
                  <option>Oil Change - $39.99</option>
                  <option>Brake Service - $89+</option>
                </select>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-xl text-xl">Request Appointment</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-lg">P</div>
            <span className="font-bold text-xl">Premier Auto Care</span>
          </div>
          <p className="text-slate-400 text-lg">© 2025 • Family-owned since 1985</p>
        </div>
      </footer>
    </div>
  );
}
