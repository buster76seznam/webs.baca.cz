'use client';

import { useState } from 'react';

export default function PlumberPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-900 via-blue-900 to-cyan-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Flow Masters Plumbing</h1>
                <p className="text-xs text-cyan-300">Denver, Colorado</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="hover:text-cyan-300 transition">Services</a>
              <a href="#why" className="hover:text-cyan-300 transition">Why Us</a>
              <a href="#service-area" className="hover:text-cyan-300 transition">Service Area</a>
              <a href="#contact" className="hover:text-cyan-300 transition">Contact</a>
              <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-lg font-semibold transition animate-pulse">
                24/7 Emergency
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
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-500/10 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-cyan-200">Available 24/7 • Emergency Service</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Denver's Trusted <span className="text-cyan-400">Plumbers</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Fast, reliable plumbing services for homes and businesses. From leaky faucets to 
                complete repiping, we've got you covered with upfront pricing and guaranteed work.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-cyan-500/25">
                  Schedule Service
                </button>
                <button className="border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-xl font-bold text-lg transition">
                  (303) 555-0198
                </button>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Licensed & Insured
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100% Satisfaction
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Common Services</h3>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">Starting Prices</span>
                </div>
                <div className="space-y-3">
                  {[
                    { service: 'Drain Cleaning', price: '$89' },
                    { service: 'Water Heater Repair', price: '$129' },
                    { service: 'Leak Detection', price: '$99' },
                    { service: 'Toilet Repair', price: '$79' },
                    { service: 'Faucet Replacement', price: '$119' },
                    { service: 'Sewer Line Service', price: '$199' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                      <span className="text-slate-200">{item.service}</span>
                      <span className="text-cyan-400 font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-cyan-600 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-cyan-600 flex items-center justify-center">
                        <span className="text-xs font-bold">{['JW','SM','BK','TR','DP'][i-1]}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-cyan-200">1,456 reviews</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">"Called at 11 PM for an emergency leak. They arrived within 45 minutes and fixed everything. Incredible service!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Plumbing Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From routine maintenance to emergency repairs, our licensed plumbers handle it all
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Emergency Plumbing', desc: '24/7 emergency service for burst pipes, major leaks, and flooding. Fast response guaranteed.', popular: true, icon: '🚨' },
              { title: 'Drain Cleaning', desc: 'Professional drain cleaning using hydro-jetting and snake equipment. Clear any blockage.', popular: false, icon: '🛁' },
              { title: 'Water Heater', desc: 'Installation, repair, and replacement of all water heater types. Tank and tankless systems.', popular: true, icon: '🔥' },
              { title: 'Leak Detection', desc: 'Advanced electronic leak detection finds hidden leaks without damaging your property.', popular: false, icon: '💧' },
              { title: 'Sewer Line Repair', desc: 'Complete sewer line services including trenchless repair, replacement, and cleaning.', popular: false, icon: '🔧' },
              { title: 'Fixture Installation', desc: 'Professional installation of faucets, toilets, showers, bathtubs, and garbage disposals.', popular: false, icon: '🚰' },
              { title: 'Gas Line Service', desc: 'Safe gas line installation, repair, and leak detection by certified technicians.', popular: true, icon: '⛽' },
              { title: 'Remodeling', desc: 'Complete bathroom and kitchen plumbing for remodels and new construction projects.', popular: false, icon: '🏠' },
              { title: 'Water Treatment', desc: 'Water softeners, filtration systems, and water testing services for clean water.', popular: false, icon: '💎' },
            ].map((service, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border ${service.popular ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-200'} hover:shadow-lg transition`}>
                {service.popular && (
                  <span className="inline-block bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Most Requested</span>
                )}
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.desc}</p>
                <button onClick={() => setShowForm(true)} className="text-cyan-600 font-semibold hover:text-cyan-700">Book Now →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Why Denver Chooses Flow Masters
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                For over 25 years, we've built our reputation on honest service, fair pricing, and 
                doing the job right. We're not just plumbers – we're your neighbors.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: '25+', label: 'Years Experience' },
                  { num: '50,000+', label: 'Jobs Completed' },
                  { num: '4.9★', label: 'Customer Rating' },
                  { num: '24/7', label: 'Emergency Service' },
                ].map((stat, i) => (
                  <div key={i} className="bg-cyan-50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-cyan-600 mb-1">{stat.num}</div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Upfront Pricing', desc: 'The price we quote is the price you pay. No hidden fees, no surprises on your bill.' },
                { title: 'Licensed Professionals', desc: 'All our plumbers are licensed, insured, and undergo continuous training.' },
                { title: 'Guaranteed Work', desc: 'All work is backed by our satisfaction guarantee. We stand behind every job.' },
                { title: 'Clean & Respectful', desc: 'We wear booties, clean up after ourselves, and treat your home with respect.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Service Areas</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We serve the entire Denver metro area and surrounding communities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Downtown Denver', 'Aurora', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Broomfield', 'Littleton', 'Englewood', 'Golden', 'Highlands Ranch', 'Brighton'].map((area, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition">
                <span className="text-cyan-400 font-semibold">{area}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 mt-8">
            Not listed? Call us! We likely service your area.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Lisa Anderson', city: 'Denver, CO', text: 'Flow Masters saved the day! Had a major pipe burst on a Sunday night. They were here within 30 minutes and had everything fixed before my insurance adjuster arrived Monday morning. Incredible service!', rating: 5 },
              { name: 'Marcus Johnson', city: 'Lakewood, CO', text: 'I\'ve used Flow Masters for all my plumbing needs over the years. Always professional, always on time, and the pricing is fair. They just earned a customer for life.', rating: 5 },
              { name: 'Patricia Lee', city: 'Aurora, CO', text: 'The technician was so thorough and explained everything clearly. Found a potential problem I didn\'t even know about and fixed it before it became an emergency. That\'s real customer service.', rating: 5 },
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
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
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

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Need a Plumber?</h2>
              <p className="text-xl text-cyan-100 mb-8">
                Contact us 24/7 for emergency service or schedule a convenient appointment.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cyan-200 text-sm">Call Anytime</p>
                    <p className="text-2xl font-bold">(303) 555-0198</p>
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
                    <p className="text-cyan-200 text-sm">Visit Us</p>
                    <p className="font-semibold">4521 W 60th Ave, Denver, CO 80212</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cyan-200 text-sm">Hours</p>
                    <p className="font-semibold">Open 24/7 - Including Holidays</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Schedule Service</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                  <input type="text" placeholder="Last Name" className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                </div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                <input type="text" placeholder="Address / ZIP Code" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
                  <option>Service Type</option>
                  <option>Drain Cleaning</option>
                  <option>Water Heater Service</option>
                  <option>Leak Repair</option>
                  <option>Toilet/Faucet Service</option>
                  <option>Sewer Line Service</option>
                  <option>Emergency Repair</option>
                  <option>Other</option>
                </select>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
                  <option>Preferred Time</option>
                  <option>ASAP (Emergency)</option>
                  <option>Morning (8AM-12PM)</option>
                  <option>Afternoon (12PM-5PM)</option>
                  <option>Evening (5PM-8PM)</option>
                </select>
                <textarea placeholder="Describe the problem or service needed..." rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none"></textarea>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition text-lg">
                  Request Service
                </button>
                <p className="text-center text-sm text-slate-500">Or call (303) 555-0198</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <span className="font-bold text-white">Flow Masters Plumbing</span>
              </div>
              <p className="text-sm">Denver's trusted plumbing experts since 1998. Licensed, insured, and dedicated to your satisfaction.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Emergency Plumbing</li>
                <li>Drain Cleaning</li>
                <li>Water Heater</li>
                <li>Leak Detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>4521 W 60th Ave</li>
                <li>Denver, CO 80212</li>
                <li className="text-white">(303) 555-0198</li>
                <li>info@flowmasters.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2025 Flow Masters Plumbing. All rights reserved. | Licensed Plumbers #PC.012345</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
