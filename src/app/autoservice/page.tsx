'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AutoServicePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Premier Auto Care</h1>
                <p className="text-xs text-blue-300">Phoenix, Arizona</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="hover:text-blue-300 transition">Services</a>
              <a href="#about" className="hover:text-blue-300 transition">About</a>
              <a href="#testimonials" className="hover:text-blue-300 transition">Reviews</a>
              <a href="#contact" className="hover:text-blue-300 transition">Contact</a>
              <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold transition">
                Book Now
              </button>
            </nav>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-blue-200">Open Now • Closes at 6:00 PM</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Expert Auto Service in <span className="text-blue-400">Phoenix</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Family-owned and operated since 1985. We provide honest, reliable automotive repair 
                with certified mechanics and transparent pricing. No surprise fees, ever.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/25">
                  Schedule Service
                </button>
                <button className="border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-xl font-bold text-lg transition">
                  (602) 555-0199
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-800 flex items-center justify-center">
                        <span className="text-xs font-bold">{['JD','MR','SK','AT','BW'][i-1]}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400">1,247 reviews</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-300">ASE Certified</span>
                    <span className="text-green-400 font-semibold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-300">BBB Rating</span>
                    <span className="text-green-400 font-semibold">A+</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-300">Warranty</span>
                    <span className="text-green-400 font-semibold">24 mo/24,000 mi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From routine maintenance to complex repairs, we have you covered with transparent pricing and expert service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Oil Change', price: '$39.99', desc: 'Full synthetic oil & filter replacement with 21-point inspection', popular: true },
              { title: 'Brake Service', price: '$89', desc: 'Front or rear brake pad replacement, includes resurfacing', popular: false },
              { title: 'Tire Rotation', price: '$29.99', desc: 'Extend tire life with proper rotation pattern', popular: false },
              { title: 'AC Service', price: '$119', desc: 'A/C diagnosis, recharge, and leak detection', popular: false },
              { title: 'Transmission', price: 'From $299', desc: 'Fluid change, filter replacement, and diagnostic', popular: false },
              { title: 'Full Inspection', price: '$149', desc: '200+ point comprehensive vehicle inspection', popular: true },
            ].map((service, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border ${service.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} hover:shadow-lg transition`}>
                {service.popular && (
                  <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700">Book →</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Complete Auto Repair</h3>
                <p className="text-slate-300 mb-6">
                  Engine repair, transmission service, electrical diagnostics, suspension work, and more. 
                  Our ASE-certified technicians handle all makes and models.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition">
                  Get a Free Quote
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Engine Repair', 'Transmission', 'Electrical', 'Suspension', 'Exhaust', 'Cooling System'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-slate-300">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Why Phoenix Trusts Premier Auto Care
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                For nearly 40 years, we've built our reputation on honest service, fair pricing, and 
                doing the job right the first time. We're not just mechanics – we're your neighbors.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Honest Estimates', desc: 'The price we quote is the price you pay. No hidden fees or surprise charges.' },
                  { title: 'Certified Technicians', desc: 'ASE-certified mechanics with continuous training on the latest vehicle technology.' },
                  { title: 'Quality Parts', desc: 'We use only OEM or equivalent quality parts, backed by our 24-month warranty.' },
                  { title: 'Convenience', desc: 'Online booking, shuttle service, and early morning drop-off available.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">Business Hours</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Monday - Friday</span><span>7:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>8:00 AM - 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h4 className="font-bold mb-4">Schedule Your Visit</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 placeholder-slate-500" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 placeholder-slate-500" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900 placeholder-slate-500" />
                  <select className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-900">
                    <option>Select Service</option>
                    <option>Oil Change</option>
                    <option>Brake Service</option>
                    <option>Tire Service</option>
                    <option>Full Inspection</option>
                    <option>Other</option>
                  </select>
                  <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition">
                    Request Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-slate-400">Over 1,200 five-star reviews and counting</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Michael Rodriguez', city: 'Scottsdale, AZ', text: 'Best auto shop in Phoenix! They diagnosed a problem that two other shops missed. Fair prices and honest service. My family has been coming here for 15 years.', rating: 5 },
              { name: 'Sarah Thompson', city: 'Tempe, AZ', text: 'I was nervous about finding a mechanic I could trust. Premier Auto Care exceeded all expectations. They explained everything clearly and didn\'t try to upsell me on services I didn\'t need.', rating: 5 },
              { name: 'David Chen', city: 'Mesa, AZ', text: 'Outstanding service from start to finish. Got my oil change and inspection done in under an hour. The online booking made it so convenient. Will definitely be back!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-slate-400">{review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Contact */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of satisfied customers who trust Premier Auto Care with their vehicles.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Call Us Today</p>
                    <p className="text-2xl font-bold">(602) 555-0199</p>
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
                    <p className="text-blue-200 text-sm">Visit Us</p>
                    <p className="font-semibold">2847 W Camelback Rd, Phoenix, AZ 85017</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Book Your Appointment</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Last Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>Select Your Vehicle</option>
                  <option>2020 Toyota Camry</option>
                  <option>2019 Honda Accord</option>
                  <option>2021 Ford F-150</option>
                  <option>2018 Chevrolet Silverado</option>
                  <option>Other</option>
                </select>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>Select Service Needed</option>
                  <option>Oil Change - $39.99</option>
                  <option>Brake Service - Starting at $89</option>
                  <option>Tire Service - $29.99+</option>
                  <option>Full Inspection - $149</option>
                  <option>Other / Not Sure</option>
                </select>
                <textarea placeholder="Additional notes or description of issue..." rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-lg">
                  Schedule Appointment
                </button>
                <p className="text-center text-sm text-slate-500">Or call us at (602) 555-0199</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-bold text-white">Premier Auto Care</span>
              </div>
              <p className="text-sm">Family-owned automotive service since 1985. Serving Phoenix, Scottsdale, Tempe, and Mesa.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Oil Changes</a></li>
                <li><a href="#" className="hover:text-white transition">Brake Service</a></li>
                <li><a href="#" className="hover:text-white transition">Tire Service</a></li>
                <li><a href="#" className="hover:text-white transition">Full Inspections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>2847 W Camelback Rd</li>
                <li>Phoenix, AZ 85017</li>
                <li className="text-white">(602) 555-0199</li>
                <li>info@premierautocare.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 Premier Auto Care. All rights reserved.</p>
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
