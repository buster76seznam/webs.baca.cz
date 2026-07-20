'use client';

export default function PlumberPage() {
  const services = [
    { name: 'Emergency Plumbing', desc: '24/7 service for burst pipes and flooding', popular: true, icon: '🚨' },
    { name: 'Drain Cleaning', desc: 'Hydro-jetting and professional equipment', popular: false, icon: '🛁' },
    { name: 'Water Heater', desc: 'Installation, repair, all types', popular: true, icon: '🔥' },
    { name: 'Leak Detection', desc: 'Electronic detection without damage', popular: false, icon: '💧' },
    { name: 'Sewer Line', desc: 'Trenchless repair and replacement', popular: false, icon: '🔧' },
    { name: 'Gas Line', desc: 'Certified gas line services', popular: true, icon: '⛽' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Header - Minimalist Blue */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 -mt-2 -mb-2">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">FLOW MASTERS</h1>
                <p className="text-xs text-cyan-600 font-bold tracking-wider">PLUMBING • DENVER</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold text-slate-600">24/7 Emergency</span>
              </div>
              <a href="tel:3035550198" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full font-bold transition shadow-lg shadow-cyan-500/30">
                (303) 555-0198
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - Image Left, Content Right */}
      <section className="relative bg-white">
        <div className="grid lg:grid-cols-2 min-h-[85vh]">
          {/* Image Side */}
          <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="text-white text-center">
                <div className="w-40 h-40 mx-auto mb-8 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="text-5xl font-black mb-2">25+</div>
                <div className="text-cyan-200 font-semibold">Years Serving Denver</div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-center px-12 lg:px-16 py-20">
            <h1 className="text-5xl lg:text-6xl font-black leading-[0.9] mb-6">
              Denver's<br />
              <span className="text-cyan-600">Trusted</span><br />
              Plumbers
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Fast, reliable plumbing for homes and businesses. Upfront pricing, 
              guaranteed work, 24/7 emergency service.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-cyan-500/20 w-fit">
                Schedule Service
              </button>
              <button className="text-cyan-600 font-bold hover:underline w-fit">
                Or call (303) 555-0198
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-100 rounded-xl p-4"><div className="text-2xl font-black text-cyan-600">50k+</div><div className="text-xs text-slate-500">Jobs Done</div></div>
              <div className="bg-slate-100 rounded-xl p-4"><div className="text-2xl font-black text-cyan-600">4.9★</div><div className="text-xs text-slate-500">Rating</div></div>
              <div className="bg-slate-100 rounded-xl p-4"><div className="text-2xl font-black text-cyan-600">24/7</div><div className="text-xs text-slate-500">Available</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-4">Common Services & Pricing</h2>
          <p className="text-slate-500 text-center mb-12">No surprise fees. The price we quote is the price you pay.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all ${service.popular ? 'ring-2 ring-cyan-500' : ''}`}>
                {service.popular && <div className="absolute -top-2 left-6 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Requested</div>}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{service.icon}</span>
                  <span className="text-2xl font-black text-cyan-600">{service.name.includes('Emergency') ? 'CALL' : '$89'}</span>
                </div>
                <p className="text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Icon Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">Why Choose Flow Masters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'Upfront Pricing', desc: 'The price we quote is the price you pay. No hidden fees.' },
              { icon: '📜', title: 'Licensed & Insured', desc: 'All plumbers are licensed, bonded, and insured.' },
              { icon: '🛡️', title: 'Guaranteed Work', desc: 'All work backed by our satisfaction guarantee.' },
              { icon: '✨', title: 'Clean & Tidy', desc: 'We wear booties, clean up, and respect your home.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-cyan-100 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-cyan-500 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">Service Areas</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Downtown Denver', 'Aurora', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Broomfield', 'Littleton', 'Englewood', 'Golden', 'Highlands Ranch', 'Brighton'].map((area, i) => (
              <div key={i} className="bg-white/10 backdrop-blur px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition">
                {area}
              </div>
            ))}
          </div>
          <p className="text-center text-cyan-200 mt-8">Don't see your area? Call us! We likely service it.</p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">What Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ name: 'Lisa Anderson', city: 'Denver, CO', text: 'Flow Masters saved the day! Had a major pipe burst on a Sunday night. They were here within 30 minutes and had everything fixed before my insurance adjuster arrived.' }, { name: 'Marcus Johnson', city: 'Lakewood, CO', text: 'I\'ve used Flow Masters for all my plumbing needs over the years. Always professional, always on time, and the pricing is fair.' }, { name: 'Patricia Lee', city: 'Aurora, CO', text: 'The technician was so thorough and explained everything clearly. Found a potential problem I didn\'t even know about and fixed it.' }].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-slate-600 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">{review.name.split(' ').map(n => n[0]).join('')}</div><div><p className="font-semibold">{review.name}</p><p className="text-sm text-slate-500">{review.city}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-black mb-6">Need a Plumber?</h2>
              <p className="text-xl text-slate-500 mb-10">Contact us 24/7 for emergency service or schedule a convenient appointment.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center"><svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p className="text-slate-500 text-sm">Call Anytime</p><p className="text-2xl font-bold">(303) 555-0198</p></div></div>
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center"><svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><p className="text-slate-500 text-sm">Visit Us</p><p className="font-semibold">4521 W 60th Ave, Denver, CO 80212</p></div></div>
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center"><svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><p className="text-slate-500 text-sm">Hours</p><p className="font-semibold">Open 24/7 - Including Holidays</p></div></div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Schedule Service</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="First Name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" /><input type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" /></div>
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                <input type="text" placeholder="Address / ZIP" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"><option>Service Type</option><option>Drain Cleaning</option><option>Water Heater</option><option>Leak Repair</option><option>Emergency</option></select>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"><option>Preferred Time</option><option>ASAP (Emergency)</option><option>Morning</option><option>Afternoon</option></select>
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-xl transition text-lg">Request Service</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div><span className="font-bold text-white">Flow Masters Plumbing</span></div>
            <p className="text-sm">© 2025 Flow Masters Plumbing. Licensed Plumbers #PC.012345</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
