'use client';

export default function ConstructionPage() {
  const projects = [
    { title: 'Lakeside Residence', location: 'Bellevue', size: '4,500 sq ft', type: 'Custom Home' },
    { title: 'Downtown Office Tower', location: 'Seattle', size: '180,000 sq ft', type: 'Commercial' },
    { title: 'Mountain View Estate', location: 'Issaquah', size: '6,200 sq ft', type: 'Custom Home' },
    { title: 'Harbor View Condos', location: 'Tacoma', size: '48,000 sq ft', type: 'Multi-Family' },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 font-sans">
      {/* Header - Warm minimal */}
      <header className="bg-amber-50/90 backdrop-blur border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-700 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">SUMMIT BUILDERS</h1>
              <p className="text-[10px] text-amber-700 tracking-widest">PACIFIC NORTHWEST</p>
            </div>
          </div>
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-bold text-sm transition">
            Get a Quote
          </button>
        </div>
      </header>

      {/* Hero - Clean centered */}
      <section className="py-24 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-700 mb-4">BUILDING EXCELLENCE SINCE 1987</span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            We Build<br />
            <span className="text-amber-700">Dreams</span>
          </h1>
          <p className="text-lg text-stone-600 mb-10 max-w-lg mx-auto">
            Custom homes and commercial projects with exceptional craftsmanship in the Pacific Northwest.
          </p>
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg">
            Start Your Project
          </button>
        </div>
      </section>

      {/* Stats - Simple numbers */}
      <section className="py-12 bg-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black">500+</div>
              <div className="text-amber-200 text-sm mt-1">Projects</div>
            </div>
            <div>
              <div className="text-4xl font-black">38</div>
              <div className="text-amber-200 text-sm mt-1">Years</div>
            </div>
            <div>
              <div className="text-4xl font-black">98%</div>
              <div className="text-amber-200 text-sm mt-1">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects - Minimal list */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-amber-700 text-xs font-bold tracking-[0.2em]">PORTFOLIO</span>
          <h2 className="text-4xl font-black mt-2 mb-12">Featured Work</h2>
          
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-stone-50 rounded-xl hover:bg-amber-50 transition cursor-pointer group">
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-amber-200 transition">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-amber-700 transition">{project.title}</h3>
                    <p className="text-stone-500 text-sm">{project.location} • {project.size}</p>
                  </div>
                </div>
                <span className="text-xs bg-stone-200 px-3 py-1 rounded-full group-hover:bg-amber-200 group-hover:text-amber-800 transition">{project.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Simple grid */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-amber-700 text-xs font-bold tracking-[0.2em]">WHAT WE DO</span>
          <h2 className="text-4xl font-black mt-2 mb-12">Our Services</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Custom Homes', desc: 'Design and build your dream home from the ground up.' },
              { title: 'Renovations', desc: 'Kitchen remodels, additions, and updates.' },
              { title: 'Commercial', desc: 'Office buildings, retail, and industrial projects.' },
              { title: 'Sustainable', desc: 'Green building practices and energy efficiency.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-amber-300 transition cursor-pointer">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us - Accordion style */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-amber-700 text-xs font-bold tracking-[0.2em]">WHY SUMMIT</span>
          <h2 className="text-4xl font-black mt-2 mb-12">What Sets Us Apart</h2>
          
          <div className="space-y-4">
            {[
              { title: 'Licensed & Bonded', desc: 'Fully licensed, bonded, and insured for your protection.' },
              { title: 'Transparent Pricing', desc: 'Detailed estimates with no hidden costs or surprises.' },
              { title: 'On-Time Delivery', desc: 'We respect your timeline and communicate every step.' },
              { title: '3-Year Warranty', desc: 'All work backed by our craftsmanship guarantee.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-stone-50 rounded-xl">
                <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">✓</div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-stone-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-amber-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="text-amber-700 text-xs font-bold tracking-[0.2em]">TESTIMONIALS</span>
          <h2 className="text-4xl font-black mt-2 mb-12">What Clients Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Katherine W.', text: 'Turned our ideas into an incredible home. Attention to detail was remarkable.' },
              { name: 'Thompson Group', text: 'Three projects completed on time and under budget. Highly recommend.' },
              { name: 'Maria S.', text: 'First-time builder. They made everything clear and walked us through each step.' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-left shadow-sm">
                <p className="text-stone-600 mb-4 text-sm leading-relaxed">"{review.text}"</p>
                <p className="font-bold text-amber-700">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Ready to Build?</h2>
            <p className="text-amber-200">Contact us for a free consultation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <p className="text-amber-200 text-sm">Call</p>
              <p className="font-bold">(206) 555-0156</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✉️</div>
              <p className="text-amber-200 text-sm">Email</p>
              <p className="font-bold">build@summit.com</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-amber-200 text-sm">Location</p>
              <p className="font-bold">Seattle, WA</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 text-stone-900 max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-6 text-center">Get Your Free Estimate</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-amber-500 outline-none" />
              <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-amber-500 outline-none" />
              <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-amber-500 outline-none" />
              <select className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-amber-500 outline-none">
                <option>Project Type</option>
                <option>Custom Home</option>
                <option>Renovation</option>
                <option>Commercial</option>
              </select>
              <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-lg transition">
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-700 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold">Summit Builders</span>
          </div>
          <p className="text-stone-400 text-sm">© 2025 • Washington State Contractor</p>
        </div>
      </footer>
    </div>
  );
}
