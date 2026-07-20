'use client';

export default function AutoBodyPage() {
  const services = [
    { title: 'Collision Repair', desc: 'Complete frame repair and unibody restoration', icon: '⚙️' },
    { title: 'Paint & Refinish', desc: 'Factory-match paint with precision color matching', icon: '🎨' },
    { title: 'Dent Removal', desc: 'Paintless dent repair for all damage', icon: '✨' },
    { title: 'Windshield & Glass', desc: 'Replacement and ADAS calibration', icon: '🚗' },
    { title: 'Bumper Repair', desc: 'Front and rear restoration', icon: '🛡️' },
    { title: 'Frame Straightening', desc: 'Computerized measurement systems', icon: '📐' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-black text-sm">TC</div>
            <span className="font-bold tracking-wide">TEXAS COLLISION</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              OPEN NOW
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900/30"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto px-12 py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded px-4 py-2 mb-10">
              <span className="text-orange-400 text-xs font-bold tracking-wider">30+ YEARS EXPERIENCE</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black leading-[0.8] mb-8">
              COLLISION<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">EXPERT</span><br />
              REPAIR
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-md">
              When accidents happen, we restore your vehicle to pre-accident condition. Everything handled.
            </p>
            <div className="flex gap-5">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 px-10 py-5 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition">
                Free Estimate
              </button>
              <a href="tel:7135550247" className="px-10 py-5 rounded-lg border border-slate-600 font-bold hover:border-orange-500 hover:text-orange-400 transition">
                (713) 555-0247
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-12">
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: '15,000+', label: 'VEHICLES REPAIRED' },
              { num: 'LIFETIME', label: 'WARRANTY' },
              { num: 'ALL', label: 'INSURANCE ACCEPTED' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center hover:border-orange-500/50 transition">
                <span className="block text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  {stat.num}
                </span>
                <span className="text-xs text-slate-500 tracking-widest mt-4 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 bg-slate-800">
        <div className="max-w-5xl mx-auto px-12">
          <div className="mb-16">
            <span className="text-orange-400 text-xs font-bold tracking-[0.3em]">OUR SERVICES</span>
            <h2 className="text-5xl font-black mt-3">What We Fix</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-orange-500/50 transition group cursor-pointer">
                <span className="text-4xl mb-6 block">{service.icon}</span>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition">{service.title}</h3>
                <p className="text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 bg-slate-900">
        <div className="max-w-5xl mx-auto px-12">
          <span className="text-orange-400 text-xs font-bold tracking-[0.3em]">HOW IT WORKS</span>
          <h2 className="text-5xl font-black mt-3 mb-20">Simple Process</h2>
          
          <div className="relative">
            <div className="absolute top-10 left-0 right-0 h-0.5 bg-slate-700"></div>
            <div className="grid grid-cols-4 gap-10 relative">
              {[
                { step: '01', title: 'Estimate', desc: 'Free assessment within 24hrs' },
                { step: '02', title: 'Insurance', desc: 'We handle all paperwork' },
                { step: '03', title: 'Repair', desc: 'Certified technicians' },
                { step: '04', title: 'Quality', desc: '50-point inspection' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-black mx-auto mb-6 relative z-10 border-4 border-slate-900">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section className="py-32 bg-slate-800">
        <div className="max-w-5xl mx-auto px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <span className="text-orange-400 text-xs font-bold tracking-[0.3em]">INSURANCE</span>
              <h2 className="text-5xl font-black mt-3 mb-8">We Work With All Providers</h2>
              <p className="text-slate-400 text-lg mb-10">
                Don't worry about paperwork. We handle everything directly with your insurance company.
              </p>
              <div className="flex flex-wrap gap-4">
                {['State Farm', 'Allstate', 'Progressive', 'GEICO', 'USAA', 'Liberty Mutual'].map(ins => (
                  <span key={ins} className="px-5 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm font-medium hover:border-orange-500 transition cursor-pointer">
                    {ins}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10">
              <h3 className="text-2xl font-bold mb-8">Get Free Estimate</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Name" className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-orange-500 outline-none" />
                <input type="tel" placeholder="Phone" className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-orange-500 outline-none" />
                <input type="text" placeholder="Vehicle (Year, Make, Model)" className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-orange-500 outline-none" />
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-32 bg-slate-900">
        <div className="max-w-5xl mx-auto px-12">
          <span className="text-orange-400 text-xs font-bold tracking-[0.3em]">TESTIMONIALS</span>
          <h2 className="text-5xl font-black mt-3 mb-16">What Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Jennifer Martinez', city: 'Houston', text: 'They handled everything. Got my car back looking better than before the accident!' },
              { name: 'Robert Williams', city: 'Sugar Land', text: 'Professional, honest, fast. Paint match is perfect.' },
              { name: 'Amanda Chen', city: 'Katy', text: 'Exceeded all expectations. Updated daily on progress.' },
            ].map((review, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-slate-500 text-sm">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto px-12 text-center">
          <h2 className="text-6xl font-black mb-6">Get Your Car Back</h2>
          <p className="text-2xl text-orange-100 mb-12">Contact us for a free estimate today.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button className="bg-white text-orange-600 px-12 py-5 rounded-xl font-bold text-xl hover:bg-orange-50 transition">
              Free Estimate
            </button>
            <a href="tel:7135550247" className="px-12 py-5 rounded-xl border-2 border-white font-bold text-xl hover:bg-white/10 transition">
              (713) 555-0247
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-10">
        <div className="max-w-5xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center text-xs font-black">TC</div>
            <span className="font-bold text-white">Texas Collision Center</span>
          </div>
          <p className="text-sm">© 2025 • Houston, TX</p>
        </div>
      </footer>
    </div>
  );
}
