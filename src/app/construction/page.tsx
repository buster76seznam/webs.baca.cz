'use client';

export default function ConstructionPage() {
  const services = [
    { name: 'Home Renovation', price: 'From $15K', desc: 'Complete kitchen & bath remodels', popular: true },
    { name: 'Room Addition', price: 'From $40K', desc: 'Expand your living space', popular: false },
    { name: 'Roofing', price: 'From $8K', desc: 'Shingle to metal roofing', popular: true },
    { name: 'Deck Building', price: 'From $5K', desc: 'Custom wood & composite decks', popular: false },
    { name: 'Foundation', price: 'From $12K', desc: 'Repair & waterproofing', popular: true },
    { name: 'Commercial', price: 'Custom', desc: 'Tenant improvements & buildouts', popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">B</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">BUILT RIGHT INC</h1>
                <p className="text-xs text-amber-400 tracking-widest font-semibold">DENVER, CO</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
              <a href="#projects" className="hover:text-amber-400 transition-colors">Projects</a>
              <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-bold tracking-widest text-amber-400 mb-6">LICENSED & INSURED GENERAL CONTRACTOR</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                We Build Dreams<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">On Time & On Budget</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                From kitchen remodels to commercial buildouts. Free estimates. No surprises. 100% satisfaction guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg">
                  Get Free Estimate
                </button>
                <a href="tel:7205550347" className="px-8 py-4 rounded-xl border-2 border-slate-700 font-bold text-lg text-slate-300 hover:border-amber-500 hover:text-amber-400 transition text-center">
                  (720) 555-0347
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl h-96 flex items-center justify-center border border-amber-500/30">
                <span className="text-amber-400 text-9xl font-black opacity-30">🏗️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">25+</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">YEARS EXPERIENCE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">500+</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">PROJECTS DONE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">5★</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">GOOGLE RATING</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">G</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">GENERAL CONTRACTOR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-12">
            <span className="text-sm font-bold tracking-widest text-amber-400">OUR SERVICES</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">What We Build</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                service.popular 
                  ? 'bg-amber-500/10 border-amber-500/50 hover:border-amber-400' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      {service.popular && (
                        <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>
                      )}
                    </div>
                    <p className="text-slate-400">{service.desc}</p>
                  </div>
                  <span className="text-2xl font-black text-amber-400">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="projects" className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-sm font-bold tracking-widest text-amber-400">HOW IT WORKS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12 text-white">Our Process</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Free Consultation', desc: 'We visit your site and discuss your vision' },
              { step: '02', title: 'Detailed Proposal', desc: 'Get a comprehensive quote with timeline' },
              { step: '03', title: 'Permits & Planning', desc: 'We handle all paperwork and scheduling' },
              { step: '04', title: 'Build & Deliver', desc: 'Quality construction with daily cleanup' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-sm font-bold tracking-widest text-amber-400">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12 text-white">What Clients Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Amanda Foster', city: 'Boulder', text: 'Built our dream kitchen on time and under budget. Incredible craftsmanship!' },
              { name: 'Kevin O\'Brien', city: 'Aurora', text: 'Professional team from start to finish. Our home addition came out perfect.' },
              { name: 'Lisa Chang', city: 'Lakewood', text: 'They handled our complete bathroom remodel. Zero stress experience.' },
            ].map((review, i) => (
              <div key={i} className="p-8 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-white">{review.name}</p>
                    <p className="text-slate-400 text-sm">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Start Your Project?</h2>
              <p className="text-xl opacity-90 mb-8">Free estimates. Detailed quotes. Licensed & insured.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📞</div>
                  <div>
                    <p className="opacity-80 text-sm">Call Us</p>
                    <p className="font-bold text-2xl">(720) 555-0347</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📍</div>
                  <div>
                    <p className="opacity-80 text-sm">Office</p>
                    <p className="font-bold text-xl">3847 Larimer St, Denver</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Get Free Estimate</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" />
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" />
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                  <option>Project Type</option>
                  <option>Home Renovation</option>
                  <option>Room Addition</option>
                  <option>Roofing</option>
                  <option>Commercial</option>
                </select>
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 rounded-xl text-lg">Request Estimate</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-black">B</div>
              <span className="font-bold">Built Right Inc</span>
            </div>
            <p className="text-slate-400">© 2025 • Licensed General Contractor</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
