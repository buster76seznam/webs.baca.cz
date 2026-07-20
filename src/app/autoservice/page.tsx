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
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl font-black text-white">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">PREMIER</h1>
                <p className="text-xs text-emerald-400 tracking-[0.3em] font-semibold">AUTO CARE</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-10">
              <a href="#services" className="text-zinc-400 hover:text-white transition font-medium">Services</a>
              <a href="#about" className="text-zinc-400 hover:text-white transition font-medium">Why Us</a>
              <a href="#testimonials" className="text-zinc-400 hover:text-white transition font-medium">Reviews</a>
              <a href="#contact" className="text-zinc-400 hover:text-white transition font-medium">Contact</a>
              <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-bold transition shadow-lg shadow-emerald-500/30">Book Now</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero - Split Layout */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[90vh]">
          <div className="flex flex-col justify-center px-8 lg:px-16 py-20 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 mb-8">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 text-sm font-semibold">Family-Owned Since 1985</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] mb-6">
                <span className="text-zinc-400">Honest</span><br />
                <span className="text-emerald-400">Auto Service</span><br />
                <span>You Trust</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                No upsells. No surprises. Just reliable automotive repair by certified mechanics 
                who treat your car like their own.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <button className="bg-emerald-500 hover:bg-emerald-600 px-10 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-emerald-500/20">Schedule Service</button>
                <a href="tel:6025550199" className="flex items-center gap-3 px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  (602) 555-0199
                </a>
              </div>
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>ASE Certified</div>
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>24mo Warranty</div>
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>BBB A+</div>
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-emerald-900/50 to-teal-900/50 flex items-center justify-center p-12">
            <div className="relative z-10 w-full max-w-md">
              <div className="bg-zinc-900/80 backdrop-blur rounded-3xl p-8 border border-zinc-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex -space-x-2">
                    {['JD', 'MR', 'SK', 'AT', 'BW'].map((initials, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold">{initials}</div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-xs text-zinc-400">1,247 reviews</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-zinc-800/50 rounded-xl p-4 flex justify-between"><span className="text-zinc-400">ASE Certified</span><span className="text-emerald-400 font-bold">✓ Verified</span></div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 flex justify-between"><span className="text-zinc-400">BBB Rating</span><span className="text-emerald-400 font-bold">A+</span></div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 flex justify-between"><span className="text-zinc-400">Warranty</span><span className="text-emerald-400 font-bold">24 mo/24k mi</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Our Services</h2>
            <p className="text-zinc-400 text-lg">Transparent pricing. No surprises.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`group relative rounded-2xl p-6 transition-all duration-500 cursor-pointer ${service.popular ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/50' : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600'}`}>
                {service.popular && <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">Popular</div>}
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-400">{service.price}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">Book →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Timeline */}
      <section id="about" className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-black text-center mb-16">Why Phoenix Trusts Us</h2>
          <div className="space-y-12">
            {[{ num: '01', title: 'Honest Estimates', desc: 'The price we quote is the price you pay. No hidden fees.' }, { num: '02', title: 'Certified Technicians', desc: 'ASE-certified mechanics with continuous training.' }, { num: '03', title: 'Quality Parts', desc: 'OEM or equivalent parts with 24-month warranty.' }, { num: '04', title: 'Convenience', desc: 'Online booking, shuttle service, early drop-off.' }].map((item, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl font-black shrink-0 group-hover:scale-110 transition-transform">{item.num}</div>
                <div className="pt-2"><h3 className="text-2xl font-bold mb-2">{item.title}</h3><p className="text-zinc-400 leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-black text-center mb-16">What Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ name: 'Michael Rodriguez', city: 'Scottsdale, AZ', text: 'Best auto shop in Phoenix! Fair prices and honest service. My family has been coming here for 15 years.' }, { name: 'Sarah Thompson', city: 'Tempe, AZ', text: 'Exceeded all expectations. They explained everything clearly and didn\'t try to upsell me.' }, { name: 'David Chen', city: 'Mesa, AZ', text: 'Outstanding service. Got my oil change done in under an hour. Will definitely be back!' }].map((review, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-zinc-300 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white">{review.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><p className="font-semibold">{review.name}</p><p className="text-sm text-zinc-500">{review.city}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Experience the Difference?</h2>
              <p className="text-xl text-zinc-400 mb-8">Join thousands of satisfied customers who trust Premier Auto Care.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p className="text-zinc-500 text-sm">Call Us</p><p className="text-2xl font-bold">(602) 555-0199</p></div></div>
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><p className="text-zinc-500 text-sm">Visit Us</p><p className="font-semibold">2847 W Camelback Rd, Phoenix, AZ 85017</p></div></div>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-6">Schedule Appointment</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="First Name" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /><input type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <select className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"><option>Select Service</option><option>Oil Change - $39.99</option><option>Brake Service - Starting at $89</option><option>Full Inspection - $149</option></select>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition text-lg">Request Appointment</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center"><span className="font-black text-white">P</span></div><span className="font-bold">Premier Auto Care</span></div>
            <p className="text-zinc-500 text-sm">© 2025 Premier Auto Care. Family-owned since 1985.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
