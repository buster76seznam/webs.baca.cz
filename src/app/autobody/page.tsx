'use client';

import { useState } from 'react';

export default function AutoBodyPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', make: '', model: '', year: '', description: '' });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Texas Collision Center</h1>
                <p className="text-xs text-amber-200">Houston, Texas</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="hover:text-amber-200 transition">Services</a>
              <a href="#process" className="hover:text-amber-200 transition">Our Process</a>
              <a href="#insurance" className="hover:text-amber-200 transition">Insurance</a>
              <a href="#contact" className="hover:text-amber-200 transition">Contact</a>
              <button className="bg-white text-amber-900 hover:bg-amber-100 px-6 py-2 rounded-lg font-semibold transition">
                Free Estimate
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
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-orange-500/10 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-amber-200">Open Today • 7AM - 6PM</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Expert Collision Repair in <span className="text-amber-400">Houston</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                When accidents happen, trust Texas Collision Center to restore your vehicle to its 
                pre-accident condition. We work with all insurance companies and offer lifetime warranties.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-amber-500/25">
                  Get Free Estimate
                </button>
                <button className="border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-xl font-bold text-lg transition">
                  (713) 555-0247
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
                <h3 className="font-bold mb-4 text-amber-400">Why Choose Us?</h3>
                <div className="space-y-3">
                  {[
                    { icon: '🏆', text: 'I-CAR Gold Class Certified' },
                    { icon: '🛡️', text: 'Lifetime Warranty on All Repairs' },
                    { icon: '🚗', text: 'Free Loaner Car Provided' },
                    { icon: '📋', text: 'Direct Insurance Billing' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-200">
                      <span className="text-xl">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                        <span className="text-sm font-bold">{['JH','MT','RL','KW'][i-1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90">4.9/5 from 892 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Collision Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From minor dents to major collision repair, our certified technicians restore vehicles to factory specifications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Collision Repair', desc: 'Complete frame repair, unibody restoration, and structural repairs to manufacturer specs', icon: '🔧' },
              { title: 'Paint & Refinish', desc: 'Factory-match paint with computerized color matching and lasting durability', icon: '🎨' },
              { title: 'Dent Removal', desc: 'PDR (Paintless Dent Repair) for hail damage, door dings, and minor collisions', icon: '✨' },
              { title: 'Windshield & Glass', desc: 'Windshield replacement, side windows, rear glass, and ADAS calibration', icon: '🚗' },
              { title: 'Bumper Repair', desc: 'Front and rear bumper restoration, replacement, and color matching', icon: '🛡️' },
              { title: 'Frame Straightening', desc: 'Computerized frame measurement and precision straightening equipment', icon: '📐' },
              { title: 'Vehicle Detailing', desc: 'Complete interior/exterior detailing to make your car look brand new', icon: '✨' },
              { title: 'Scratch & Chip Repair', desc: 'Touch-up painting, scratch removal, and rock chip repair', icon: '🔨' },
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition hover:border-amber-300">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Simple Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We make collision repair stress-free with our streamlined 4-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Free Estimate', desc: 'Bring your vehicle in or upload photos. We\'ll provide a detailed estimate within 24 hours.' },
              { step: '02', title: 'Insurance Claim', desc: 'We handle all communication with your insurance company to simplify the process.' },
              { step: '03', title: 'Expert Repair', desc: 'Our certified technicians restore your vehicle using OEM-quality parts and factory methods.' },
              { step: '04', title: 'Quality Inspection', desc: 'Rigorous 50-point inspection ensures your vehicle is returned in perfect condition.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-8 h-full">
                  <div className="text-6xl font-black opacity-20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section id="insurance" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                We Work With All Insurance Companies
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Don't worry about paperwork or negotiation. We handle everything directly with your 
                insurance company so you can focus on getting back on the road.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['State Farm', 'Allstate', 'Progressive', 'GEICO', 'USAA', 'Liberty Mutual', 'Farmers', 'Nationwide', '+ More'].map(ins => (
                  <div key={ins} className="bg-slate-800 rounded-lg p-3 text-center text-sm">
                    {ins}
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-6">
                <h4 className="font-bold text-amber-400 mb-2">What This Means For You</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No out-of-pocket expenses (except deductible)
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    We manage all claim paperwork
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guaranteed repair quality
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Schedule Your Free Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                  <input type="text" placeholder="Last Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" placeholder="Make" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                  <input type="text" placeholder="Model" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                  <input type="text" placeholder="Year" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none">
                  <option>Insurance Company</option>
                  <option>State Farm</option>
                  <option>Allstate</option>
                  <option>Progressive</option>
                  <option>GEICO</option>
                  <option>USAA</option>
                  <option>Other / Self-Pay</option>
                </select>
                <textarea placeholder="Describe the damage or upload photos..." rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"></textarea>
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition text-lg">
                  Get Free Estimate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Customer Reviews</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Jennifer Martinez', city: 'Houston, TX', text: 'After my fender bender, I was stressed about getting my car fixed. Texas Collision Center made the whole process seamless. They handled my insurance claim, gave me a loaner car, and my car looks better than before the accident!', rating: 5 },
              { name: 'Robert Williams', city: 'Sugar Land, TX', text: 'Professional, honest, and fast. They found some additional damage that my insurance adjuster missed and worked with them directly. The paint match is perfect - you can\'t even tell there was an accident.', rating: 5 },
              { name: 'Amanda Chen', city: 'Katy, TX', text: 'I was nervous about using a body shop after hearing horror stories. These guys exceeded all expectations. Updated me daily, kept to the timeline, and the quality is incredible. Highly recommend!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
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

      {/* CTA */}
      <section id="contact" className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Get Your Vehicle Back to Perfect</h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Don't let collision damage keep you down. Contact us today for a free estimate and let's restore your vehicle together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-amber-700 hover:bg-amber-100 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg">
                Get Free Estimate
              </button>
              <button className="border-2 border-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition">
                (713) 555-0247
              </button>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-white/80">30+</div>
                <p className="text-amber-100">Years in Business</p>
              </div>
              <div>
                <div className="text-4xl font-black text-white/80">15,000+</div>
                <p className="text-amber-100">Vehicles Repaired</p>
              </div>
              <div>
                <div className="text-4xl font-black text-white/80">Lifetime</div>
                <p className="text-amber-100">Warranty on Repairs</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <span className="font-bold text-white">Texas Collision Center</span>
              </div>
              <p className="text-sm">Houston's trusted collision repair specialists since 1994. I-CAR Gold Class certified.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Collision Repair</li>
                <li>Paint & Refinish</li>
                <li>Dent Removal</li>
                <li>Windshield & Glass</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>8920 Gulf Fwy</li>
                <li>Houston, TX 77017</li>
                <li className="text-white">(713) 555-0247</li>
                <li>info@texascollision.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hours</h4>
              <ul className="space-y-2 text-sm">
                <li>Mon-Fri: 7AM - 6PM</li>
                <li>Saturday: 8AM - 2PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2025 Texas Collision Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
