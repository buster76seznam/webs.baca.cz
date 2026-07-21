'use client';

export default function AutoBodyPage() {
  const services = [
    { name: 'Dent Repair', price: '$75', desc: 'Paintless dent removal', popular: true },
    { name: 'Bumper Fix', price: '$250', desc: 'Full bumper restoration', popular: false },
    { name: 'Paint Match', price: '$400', desc: 'Factory color matching', popular: true },
    { name: 'Scratch Removal', price: '$150', desc: 'Clear coat repair', popular: false },
    { name: 'Collision Repair', price: '$1,500+', desc: 'Full frame repair', popular: true },
    { name: 'Auto Glass', price: '$200', desc: 'Windshield replacement', popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">A</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">APEX AUTO BODY</h1>
                <p className="text-xs text-orange-400 tracking-widest font-semibold">MIAMI, FL</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#services" className="hover:text-orange-400 transition-colors">Services</a>
              <a href="#gallery" className="hover:text-orange-400 transition-colors">Gallery</a>
              <a href="#reviews" className="hover:text-orange-400 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-bold tracking-widest text-orange-400 mb-6">LICENSED & INSURED SINCE 1998</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                Collision Experts<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">You Can Trust</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                I-Car certified technicians. Lifetime warranty on all repairs. We work with all insurance companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg">
                  Get Free Estimate
                </button>
                <a href="tel:3055550234" className="px-8 py-4 rounded-xl border-2 border-slate-700 font-bold text-lg text-slate-300 hover:border-orange-500 hover:text-orange-400 transition text-center">
                  (305) 555-0234
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl h-96 flex items-center justify-center border border-orange-500/30">
                <span className="text-orange-400 text-9xl font-black opacity-30">🔧</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">30+</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">YEARS EXPERIENCE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">I-CAR</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">CERTIFIED</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">5★</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">GOOGLE RATING</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl font-black">LIFE</span>
              <span className="text-xs md:text-sm font-semibold opacity-90 tracking-wider">WARRANTY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-12">
            <span className="text-sm font-bold tracking-widest text-orange-400">OUR SERVICES</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">Repair & Restoration</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                service.popular 
                  ? 'bg-orange-500/10 border-orange-500/50 hover:border-orange-400' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      {service.popular && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>
                      )}
                    </div>
                    <p className="text-slate-400">{service.desc}</p>
                  </div>
                  <span className="text-3xl font-black text-orange-400">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <span className="text-sm font-bold tracking-widest text-orange-400">HOW IT WORKS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12 text-white">Our Process</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Free Estimate', desc: 'Get a detailed assessment and transparent quote' },
              { step: '02', title: 'Insurance Claim', desc: 'We handle all paperwork with your insurer' },
              { step: '03', title: 'Expert Repair', desc: 'Our certified techs restore your vehicle' },
              { step: '04', title: 'Quality Check', desc: 'Rigorous inspection before delivery' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">
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
          <span className="text-sm font-bold tracking-widest text-orange-400">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-12 text-white">What Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Robert Martinez', city: 'Miami Beach', text: 'Incredible work on my Tesla after a fender bender. Looks better than before!' },
              { name: 'Jennifer Walsh', city: 'Coral Gables', text: 'They handled my insurance claim seamlessly. Professional from start to finish.' },
              { name: 'Thomas Lee', city: 'Fort Lauderdale', text: 'Best auto body shop in Miami. Fair prices and amazing results.' },
            ].map((review, i) => (
              <div key={i} className="p-8 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
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
      <section id="contact" className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Restore Your Vehicle?</h2>
              <p className="text-xl opacity-90 mb-8">Free estimates. Lifetime warranty. We work with all insurance companies.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📞</div>
                  <div>
                    <p className="opacity-80 text-sm">Call Us</p>
                    <p className="font-bold text-2xl">(305) 555-0234</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📍</div>
                  <div>
                    <p className="opacity-80 text-sm">Visit Us</p>
                    <p className="font-bold text-xl">4521 NW 36th Ave, Miami</p>
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
                  <option>Service Needed</option>
                  <option>Dent Repair</option>
                  <option>Paint Match</option>
                  <option>Collision Repair</option>
                </select>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl text-lg">Request Estimate</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-black">A</div>
              <span className="font-bold">Apex Auto Body</span>
            </div>
            <p className="text-slate-400">© 2025 • Licensed & Insured</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
