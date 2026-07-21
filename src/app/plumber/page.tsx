'use client';

export default function PlumberPage() {
  const services = [
    { name: 'Drain Cleaning', price: '$99', desc: 'Unclog any drain fast', popular: true },
    { name: 'Leak Repair', price: '$149', desc: 'Fix leaks before damage', popular: false },
    { name: 'Water Heater', price: '$299', desc: 'Install or replace', popular: true },
    { name: 'Pipe Replacement', price: '$400', desc: 'Full repiping service', popular: false },
    { name: 'Sewer Line', price: '$599+', desc: 'Camera inspection included', popular: true },
    { name: 'Emergency 24/7', price: '$199', desc: 'Same-day service', popular: false },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">W</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">WATERWORKS PRO</h1>
                <p className="text-xs text-blue-500 tracking-widest font-semibold">CHICAGO, IL</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#services" className="hover:text-blue-500 transition-colors">Services</a>
              <a href="#why" className="hover:text-blue-500 transition-colors">Why Us</a>
              <a href="#reviews" className="hover:text-blue-500 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-bold tracking-widest text-blue-500 mb-6">24/7 EMERGENCY SERVICE</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-slate-900">
                Licensed Plumbers<br />
                <span className="text-blue-500">You Can Rely On</span>
              </h1>
              <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                Family-owned since 2003. Upfront pricing, no surprises. Licensed, bonded & insured.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg">
                  Schedule Service
                </button>
                <a href="tel:3125550891" className="px-8 py-4 rounded-xl border-2 border-slate-300 font-bold text-lg text-slate-700 hover:border-blue-500 hover:text-blue-500 transition text-center">
                  (312) 555-0891
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-96 flex items-center justify-center shadow-xl">
                <span className="text-white text-9xl font-black opacity-20">🚰</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">20+</span>
              <span className="text-xs md:text-sm opacity-90 tracking-wider font-semibold">YEARS EXPERIENCE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">1hr</span>
              <span className="text-xs md:text-sm opacity-90 tracking-wider font-semibold">RESPONSE TIME</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">4.9★</span>
              <span className="text-xs md:text-sm opacity-90 tracking-wider font-semibold">GOOGLE RATING</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">100%</span>
              <span className="text-xs md:text-sm opacity-90 tracking-wider font-semibold">SATISFACTION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-12">
            <span className="text-sm font-bold tracking-widest text-blue-500">OUR SERVICES</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2">Plumbing Solutions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                service.popular 
                  ? 'bg-blue-50 border-blue-300 hover:border-blue-500' 
                  : 'bg-white border-slate-200 hover:border-slate-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      {service.popular && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>
                      )}
                    </div>
                    <p className="text-slate-500">{service.desc}</p>
                  </div>
                  <span className="text-3xl font-black text-blue-500">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-sm font-bold tracking-widest text-blue-500">WHY WATERWORKS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12">The Difference</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Upfront Pricing', desc: 'You approve the price before we start work. No surprises.' },
              { title: 'Licensed Professionals', desc: 'All technicians are licensed, bonded & insured.' },
              { title: '24/7 Availability', desc: 'Emergencies don\'t wait. Neither do we.' },
              { title: 'Clean & Respectful', desc: 'We wear shoe covers and clean up after every job.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-sm font-bold tracking-widest text-blue-500">REVIEWS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12">What Chicago Says</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Patricia Johnson', city: 'Lincoln Park', text: 'Came within an hour on a Sunday! Fixed our burst pipe quickly and fairly priced.' },
              { name: 'James Wilson', city: 'Wicker Park', text: 'Best plumbing experience ever. Professional, clean, and explained everything.' },
              { name: 'Maria Garcia', city: 'Lakeview', text: 'Used them 3 times now. Always reliable and honest about pricing.' },
            ].map((review, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-2xl">
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-slate-400 text-sm">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Plumbing Problems? We Fix Them.</h2>
              <p className="text-xl text-blue-100 mb-8">24/7 emergency service. Licensed & insured. Satisfaction guaranteed.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📞</div>
                  <div>
                    <p className="text-blue-200 text-sm">Call Us</p>
                    <p className="font-bold text-3xl">(312) 555-0891</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📍</div>
                  <div>
                    <p className="text-blue-200 text-sm">Office</p>
                    <p className="font-bold text-xl">2847 N Damen Ave, Chicago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Request Service</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" />
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" />
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                  <option>Select Service</option>
                  <option>Drain Cleaning</option>
                  <option>Leak Repair</option>
                  <option>Water Heater</option>
                  <option>Emergency</option>
                </select>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-lg">Request Service</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-black">W</div>
              <span className="font-bold">Waterworks Pro</span>
            </div>
            <p className="text-slate-400">© 2025 • Licensed Plumbers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
