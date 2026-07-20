'use client';

import { useState } from 'react';

export default function ConstructionPage() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Summit Builders</h1>
                <p className="text-xs text-emerald-300">Seattle, Washington</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#projects" className="hover:text-emerald-300 transition">Projects</a>
              <a href="#services" className="hover:text-emerald-300 transition">Services</a>
              <a href="#about" className="hover:text-emerald-300 transition">About</a>
              <a href="#contact" className="hover:text-emerald-300 transition">Contact</a>
              <button className="bg-white text-emerald-800 hover:bg-emerald-100 px-6 py-2 rounded-lg font-semibold transition">
                Get a Quote
              </button>
            </nav>

            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white py-24 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMTI1LDI1NSwxNzYsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-emerald-200">Building Excellence Since 1987</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Building Dreams in the <span className="text-emerald-400">Pacific Northwest</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              From custom homes to commercial projects, Summit Builders delivers exceptional 
              craftsmanship with sustainable practices. Your vision, our expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/25">
                Start Your Project
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-xl font-bold text-lg transition">
                View Our Work
              </button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                { num: '500+', label: 'Projects Completed' },
                { num: '38', label: 'Years Experience' },
                { num: '98%', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl lg:text-4xl font-black text-emerald-400">{stat.num}</div>
                  <p className="text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore our portfolio of completed residential and commercial projects across Washington State
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {[
              { 
                title: 'Lakeside Residence', 
                location: 'Bellevue, WA',
                desc: 'A stunning 4,500 sq ft modern home featuring floor-to-ceiling windows, smart home integration, and sustainable materials throughout.',
                image: 'bg-gradient-to-br from-emerald-600 to-teal-600',
                size: '4,500 sq ft',
                type: 'Custom Home',
                year: '2024'
              },
              { 
                title: 'Downtown Office Tower', 
                location: 'Seattle, WA',
                desc: 'A 12-story LEED Platinum certified commercial building with rooftop garden, EV charging stations, and modern collaborative workspaces.',
                image: 'bg-gradient-to-br from-slate-700 to-slate-800',
                size: '180,000 sq ft',
                type: 'Commercial',
                year: '2023'
              },
              { 
                title: 'Mountain View Estate', 
                location: 'Issaquah, WA',
                desc: 'A luxurious mountain retreat featuring exposed timber beams, stone fireplaces, and panoramic views of the Cascades.',
                image: 'bg-gradient-to-br from-amber-600 to-orange-700',
                size: '6,200 sq ft',
                type: 'Custom Home',
                year: '2024'
              },
              { 
                title: 'Harbor View Condos', 
                location: 'Tacoma, WA',
                desc: 'A boutique 24-unit waterfront development offering stunning Puget Sound views and premium finishes in every unit.',
                image: 'bg-gradient-to-br from-blue-600 to-indigo-700',
                size: '48,000 sq ft',
                type: 'Multi-Family',
                year: '2023'
              },
            ].map((project, i) => (
              <div 
                key={i} 
                className={`${project.image} rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer`}
                onClick={() => setActiveProject(i)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">{project.type}</span>
                    <span className="text-white/70 text-sm">{project.year}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/70 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {project.location}
                  </p>
                  <p className="text-white/80 leading-relaxed mb-6">{project.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-white/10 backdrop-blur px-4 py-2 rounded-lg">{project.size}</span>
                    <span className="text-sm font-semibold group-hover:translate-x-2 transition">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition">
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Comprehensive Construction Services
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                From initial concept to final walkthrough, we manage every aspect of your construction project with unmatched attention to detail.
              </p>
              <div className="space-y-6">
                {[
                  { 
                    title: 'Custom Home Building', 
                    desc: 'Design and construct your dream home from the ground up. We work with your architect or our network of designers to bring your vision to life.',
                    icon: '🏠'
                  },
                  { 
                    title: 'Home Renovations', 
                    desc: 'Transform your existing space with kitchen remodels, bathroom updates, room additions, and whole-home renovations.',
                    icon: '🔨'
                  },
                  { 
                    title: 'Commercial Construction', 
                    desc: 'Office buildings, retail spaces, restaurants, and industrial facilities built to code and on schedule.',
                    icon: '🏢'
                  },
                  { 
                    title: 'Sustainable Building', 
                    desc: 'Green building practices, energy-efficient systems, and eco-friendly materials for environmentally conscious construction.',
                    icon: '🌿'
                  },
                ].map((service, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{service.title}</h4>
                      <p className="text-slate-600 text-sm">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose Summit Builders</h3>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Licensed & Bonded', desc: 'Fully licensed, bonded, and insured for your protection' },
                  { title: 'Transparent Pricing', desc: 'Detailed estimates with no hidden costs or surprises' },
                  { title: 'On-Time Delivery', desc: 'We respect your timeline and communicate every step' },
                  { title: 'Quality Guarantee', desc: '3-year craftsmanship warranty on all work' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-emerald-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h4 className="font-bold mb-4">Certifications & Affiliations</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['NAHB Member', 'Built Green', 'LEED AP', 'BBB A+', 'EPA Lead-Safe', 'OSHA Trained'].map((cert, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-2 text-center">
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From initial consultation to final handover, we make building simple
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'We meet to discuss your vision, budget, and timeline. Free initial consultation and site evaluation.' },
              { step: '02', title: 'Design & Planning', desc: 'Our team creates detailed plans, 3D renderings, and a comprehensive project timeline.' },
              { step: '03', title: 'Construction', desc: 'Expert craftsmen build your project with daily communication and quality inspections.' },
              { step: '04', title: 'Final Walkthrough', desc: 'Detailed inspection, punch list completion, and celebration of your new space!' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Katherine & David Wright', city: 'Bellevue, WA', text: 'Summit Builders turned our vague ideas into an incredible home. Their attention to detail was remarkable - they caught things we would have missed. The final result exceeded our expectations.', rating: 5, project: 'Custom Home Build' },
              { name: 'Thompson Commercial Group', city: 'Seattle, WA', text: 'We\'ve worked with Summit on three commercial projects now. Each one was delivered on time and under budget. Their project management is impeccable and communication is always clear.', rating: 5, project: 'Office Building' },
              { name: 'Maria Santos', city: 'Redmond, WA', text: 'As a first-time builder, I was nervous about the process. The Summit team made everything clear and walked me through each step. My kitchen renovation turned out absolutely beautiful!', rating: 5, project: 'Kitchen Renovation' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">{review.project}</span>
                <p className="text-slate-600 my-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white">
                    {review.name.split(' ').filter(w => w.length > 1).map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <p className="text-sm text-slate-500">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Build Your Vision?</h2>
              <p className="text-xl text-emerald-100 mb-8">
                Contact us today for a free consultation. Let's discuss how we can bring your project to life.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-200 text-sm">Call Us</p>
                    <p className="text-2xl font-bold">(206) 555-0156</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-200 text-sm">Email Us</p>
                    <p className="font-semibold">projects@summitbuilders.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-200 text-sm">Visit Our Office</p>
                    <p className="font-semibold">2847 Fairview Ave E, Seattle, WA 98102</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Get Your Free Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  <input type="text" placeholder="Last Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                </div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option>Project Type</option>
                  <option>Custom Home Build</option>
                  <option>Home Renovation</option>
                  <option>Room Addition</option>
                  <option>Commercial Project</option>
                  <option>Other</option>
                </select>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option>Budget Range</option>
                  <option>$100,000 - $300,000</option>
                  <option>$300,000 - $500,000</option>
                  <option>$500,000 - $1,000,000</option>
                  <option>$1,000,000+</option>
                  <option>Not Sure</option>
                </select>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option>Timeline</option>
                  <option>Ready to Start</option>
                  <option>Within 3 Months</option>
                  <option>Within 6 Months</option>
                  <option>Just Exploring</option>
                </select>
                <textarea placeholder="Tell us about your project..." rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"></textarea>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition text-lg">
                  Request Consultation
                </button>
                <p className="text-center text-sm text-slate-500">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-bold text-white">Summit Builders</span>
              </div>
              <p className="text-sm">Pacific Northwest's premier custom home builder and commercial contractor since 1987.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Custom Home Building</li>
                <li>Home Renovations</li>
                <li>Commercial Construction</li>
                <li>Sustainable Building</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Our Projects</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>2847 Fairview Ave E</li>
                <li>Seattle, WA 98102</li>
                <li className="text-white">(206) 555-0156</li>
                <li>projects@summitbuilders.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 Summit Builders. Washington State Contractor License #SUMMIBL-1987</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
