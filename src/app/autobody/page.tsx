'use client';

export default function AutoBodyPage() {
  const services = [
    { title: 'Collision Repair', desc: 'Complete frame repair and unibody restoration to factory specs', icon: '🔧' },
    { title: 'Paint & Refinish', desc: 'Factory-match paint with computerized color matching', icon: '🎨' },
    { title: 'Dent Removal', desc: 'Paintless dent repair for hail and minor collisions', icon: '✨' },
    { title: 'Windshield & Glass', desc: 'Replacement, calibration, and ADAS services', icon: '🚗' },
    { title: 'Bumper Repair', desc: 'Front and rear bumper restoration and replacement', icon: '🛡️' },
    { title: 'Frame Straightening', desc: 'Computerized measurement and precision equipment', icon: '📐' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header - White with Red accent */}
      <header className="bg-white border-b-4 border-red-600 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <span className="text-2xl font-black text-white">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">TEXAS COLLISION</h1>
                <p className="text-xs text-red-600 tracking-[0.3em] font-bold">CENTER</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-red-600 transition font-semibold">Services</a>
              <a href="#process" className="text-slate-600 hover:text-red-600 transition font-semibold">Process</a>
              <a href="#insurance" className="text-slate-600 hover:text-red-600 transition font-semibold">Insurance</a>
              <a href="#contact" className="text-slate-600 hover:text-red-600 transition font-semibold">Contact</a>
              <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold text-white transition shadow-lg shadow-red-500/30">
                Free Estimate
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero - Bold Typography */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-red-200 font-semibold">Open Today • 7AM - 6PM</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.85] mb-6">
              COLLISION<br />
              <span className="text-red-500">REPAIR</span><br />
              EXPERTS
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              When accidents happen, trust Texas Collision Center to restore your vehicle 
              to its pre-accident condition. We handle everything.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl shadow-red-500/20">
                Get Free Estimate
              </button>
              <a href="tel:7135550247" className="flex items-center gap-3 px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white/60 transition font-bold">
                (713) 555-0247
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-red-600 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div><div className="text-4xl font-black">30+</div><div className="text-sm text-red-200">Years Experience</div></div>
            <div><div className="text-4xl font-black">15,000+</div><div className="text-sm text-red-200">Vehicles Repaired</div></div>
            <div><div className="text-4xl font-black">Lifetime</div><div className="text-sm text-red-200">Warranty</div></div>
          </div>
        </div>
      </section>

      {/* Services - Cards */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-4">Our Services</h2>
          <p className="text-slate-500 text-center mb-16">From dents to destruction, we fix it all</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:border-red-200 transition-all group">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-red-600 transition">{service.title}</h3>
                <p className="text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - Steps */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Free Estimate', desc: 'Bring your car or send photos. We\'ll quote within 24 hours.' },
              { step: '02', title: 'Insurance Claim', desc: 'We handle all communication with your insurance.' },
              { step: '03', title: 'Expert Repair', desc: 'Certified technicians restore to factory specs.' },
              { step: '04', title: 'Quality Check', desc: '50-point inspection before return.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-red-200" />}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 relative z-10 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section id="insurance" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-6">We Work With All Insurance</h2>
              <p className="text-xl text-slate-300 mb-8">
                Don't worry about paperwork. We handle everything directly with your 
                insurance company so you can focus on getting back on the road.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['State Farm', 'Allstate', 'Progressive', 'GEICO', 'USAA', 'Liberty Mutual', 'Farmers', 'Nationwide', '+ More'].map(ins => (
                  <div key={ins} className="bg-slate-800 rounded-lg p-3 text-center text-sm font-semibold hover:bg-slate-700 transition">
                    {ins}
                  </div>
                ))}
              </div>
              <div className="bg-red-600/20 border border-red-500/30 rounded-2xl p-6">
                <h4 className="font-bold text-red-400 mb-2">What This Means For You</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>No out-of-pocket (except deductible)</li>
                  <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>We manage all claim paperwork</li>
                  <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Guaranteed repair quality</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Schedule Free Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="First Name" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" /><input type="text" placeholder="Last Name" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" /></div>
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                <div className="grid grid-cols-3 gap-4"><input type="text" placeholder="Make" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" /><input type="text" placeholder="Model" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" /><input type="text" placeholder="Year" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" /></div>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"><option>Insurance Company</option><option>State Farm</option><option>Allstate</option><option>Other / Self-Pay</option></select>
                <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition text-lg">Get Free Estimate</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ name: 'Jennifer Martinez', city: 'Houston, TX', text: 'They made the whole process seamless. Handled my insurance claim, gave me a loaner car, and my car looks better than before the accident!' }, { name: 'Robert Williams', city: 'Sugar Land, TX', text: 'Professional, honest, and fast. The paint match is perfect - you can\'t even tell there was an accident.' }, { name: 'Amanda Chen', city: 'Katy, TX', text: 'These guys exceeded all expectations. Updated me daily, kept to the timeline, and the quality is incredible.' }].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-slate-600 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">{review.name.split(' ').map(n => n[0]).join('')}</div><div><p className="font-semibold">{review.name}</p><p className="text-sm text-slate-500">{review.city}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-6">Get Your Vehicle Back to Perfect</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">Contact us today for a free estimate and let's restore your vehicle together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-red-600 hover:bg-red-100 px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl">Get Free Estimate</button>
            <button className="border-2 border-white hover:bg-white/10 px-10 py-4 rounded-lg font-bold text-lg transition">(713) 555-0247</button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center"><span className="font-black text-white">T</span></div><span className="font-bold text-white">Texas Collision Center</span></div>
            <p className="text-sm">© 2025 Texas Collision Center. Houston's trusted collision repair specialists since 1994.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
