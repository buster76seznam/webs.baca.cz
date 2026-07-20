'use client';

export default function ConstructionPage() {
  const projects = [
    { title: 'Lakeside Residence', location: 'Bellevue, WA', size: '4,500 sq ft', type: 'Custom Home', color: 'from-emerald-500 to-teal-500' },
    { title: 'Downtown Office Tower', location: 'Seattle, WA', size: '180,000 sq ft', type: 'Commercial', color: 'from-slate-700 to-slate-800' },
    { title: 'Mountain View Estate', location: 'Issaquah, WA', size: '6,200 sq ft', type: 'Custom Home', color: 'from-amber-600 to-orange-700' },
    { title: 'Harbor View Condos', location: 'Tacoma, WA', size: '48,000 sq ft', type: 'Multi-Family', color: 'from-blue-600 to-indigo-700' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* Header - Earthy tones */}
      <header className="bg-white border-b-4 border-emerald-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">SUMMIT BUILDERS</h1>
                <p className="text-xs text-emerald-700 font-bold tracking-wider">PACIFIC NORTHWEST</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#projects" className="text-stone-600 hover:text-emerald-700 transition font-semibold">Projects</a>
              <a href="#services" className="text-stone-600 hover:text-emerald-700 transition font-semibold">Services</a>
              <a href="#about" className="text-stone-600 hover:text-emerald-700 transition font-semibold">About</a>
              <a href="#contact" className="text-stone-600 hover:text-emerald-700 transition font-semibold">Contact</a>
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg">
                Get a Quote
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero - Full Width Image Style */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-stone-800 via-stone-900 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-5 py-2 mb-8">
              <span className="text-emerald-300 text-sm font-semibold">Building Excellence Since 1987</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.85] mb-6">
              Building<br />
              <span className="text-emerald-400">Dreams</span><br />
              in the PNW
            </h1>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed max-w-xl">
              Custom homes and commercial projects with exceptional craftsmanship 
              and sustainable practices. Your vision, our expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-600 px-10 py-4 rounded-lg font-bold text-lg transition shadow-xl shadow-emerald-500/20">
                Start Your Project
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 px-10 py-4 rounded-lg font-bold text-lg transition">
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-emerald-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div><div className="text-5xl font-black">500+</div><div className="text-emerald-200 font-semibold">Projects Completed</div></div>
            <div><div className="text-5xl font-black">38</div><div className="text-emerald-200 font-semibold">Years Experience</div></div>
            <div><div className="text-5xl font-black">98%</div><div className="text-emerald-200 font-semibold">Client Satisfaction</div></div>
          </div>
        </div>
      </section>

      {/* Projects - Large Cards */}
      <section id="projects" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-4">Featured Projects</h2>
          <p className="text-stone-500 text-center mb-16">Real homes and buildings we've constructed across Washington State</p>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <div key={i} className={`group relative bg-gradient-to-br ${project.color} rounded-3xl p-10 text-white min-h-[400px] flex flex-col justify-end overflow-hidden cursor-pointer`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold">{project.type}</span>
                    <span className="text-white/70 text-sm">{project.size}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-2">{project.title}</h3>
                  <p className="text-white/70 flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {project.location}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-lg font-bold transition">
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Services - Two Column */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-6">Our Services</h2>
              <p className="text-xl text-stone-500 mb-10 leading-relaxed">
                From initial concept to final walkthrough, we manage every aspect of your construction project.
              </p>
              <div className="space-y-6">
                {[
                  { icon: '🏠', title: 'Custom Home Building', desc: 'Design and construct your dream home from the ground up.' },
                  { icon: '🔨', title: 'Home Renovations', desc: 'Kitchen remodels, bathroom updates, room additions.' },
                  { icon: '🏢', title: 'Commercial Construction', desc: 'Office buildings, retail, restaurants, industrial.' },
                  { icon: '🌿', title: 'Sustainable Building', desc: 'Green practices and energy-efficient systems.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-stone-50 rounded-xl">
                    <span className="text-3xl">{item.icon}</span>
                    <div><h4 className="font-bold text-lg">{item.title}</h4><p className="text-stone-500 text-sm">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose Summit</h3>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Licensed & Bonded', desc: 'Fully licensed, bonded, and insured.' },
                  { title: 'Transparent Pricing', desc: 'Detailed estimates with no hidden costs.' },
                  { title: 'On-Time Delivery', desc: 'We respect your timeline.' },
                  { title: 'Quality Guarantee', desc: '3-year craftsmanship warranty.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <div><p className="font-semibold">{item.title}</p><p className="text-emerald-200 text-sm">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h4 className="font-bold mb-4">Certifications</h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {['NAHB Member', 'Built Green', 'LEED AP', 'BBB A+', 'EPA Lead-Safe', 'OSHA Trained'].map((cert, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-2 text-center">{cert}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'We meet to discuss your vision, budget, and timeline.' },
              { step: '02', title: 'Design & Planning', desc: 'Detailed plans and 3D renderings.' },
              { step: '03', title: 'Construction', desc: 'Expert craftsmen build your project.' },
              { step: '04', title: 'Final Walkthrough', desc: 'Detailed inspection and celebration!' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ name: 'Katherine & David Wright', city: 'Bellevue, WA', text: 'Summit Builders turned our vague ideas into an incredible home. Their attention to detail was remarkable.', project: 'Custom Home Build' }, { name: 'Thompson Commercial Group', city: 'Seattle, WA', text: 'We\'ve worked with Summit on three commercial projects now. Each one was delivered on time and under budget.', project: 'Office Building' }, { name: 'Maria Santos', city: 'Redmond, WA', text: 'As a first-time builder, I was nervous. The Summit team made everything clear and walked me through each step.', project: 'Kitchen Renovation' }].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg">
                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1 rounded-full mb-4">{review.project}</span>
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-stone-600 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white">{review.name.split(' ').filter(w => w.length > 1).map(w => w[0]).join('').slice(0, 2)}</div><div><p className="font-semibold">{review.name}</p><p className="text-sm text-stone-500">{review.city}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-black mb-6">Ready to Build Your Vision?</h2>
              <p className="text-xl text-emerald-100 mb-10">Contact us today for a free consultation.</p>
              <div className="space-y-6">
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p className="text-emerald-200 text-sm">Call Us</p><p className="text-2xl font-bold">(206) 555-0156</p></div></div>
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div><div><p className="text-emerald-200 text-sm">Email Us</p><p className="font-semibold">projects@summitbuilders.com</p></div></div>
                <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div><div><p className="text-emerald-200 text-sm">Visit Our Office</p><p className="font-semibold">2847 Fairview Ave E, Seattle, WA 98102</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-stone-900">
              <h3 className="text-2xl font-bold mb-6">Get Your Free Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="First Name" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /><input type="text" placeholder="Last Name" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <select className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"><option>Project Type</option><option>Custom Home Build</option><option>Home Renovation</option><option>Commercial Project</option></select>
                <select className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"><option>Budget Range</option><option>$100k - $300k</option><option>$300k - $500k</option><option>$500k+</option></select>
                <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition text-lg">Request Consultation</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div><span className="font-bold text-white">Summit Builders</span></div>
            <p className="text-sm">© 2025 Summit Builders. Washington State Contractor License #SUMMIBL-1987</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
