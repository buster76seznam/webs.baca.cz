'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase';
import { Globe, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function FixDomainPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select('company_name')
        .eq('id', orderId)
        .single();
      
      if (data) {
        setCompanyName(data.company_name);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain || newDomain.length < 3) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/domains/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newDomain
        }),
      });

      if (!response.ok) throw new Error('Failed to update domain');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Thank you!</h1>
          <p className="text-slate-400 leading-relaxed">
            We have received your new domain request for <strong>{newDomain}</strong>. 
            Our team will process it immediately and notify you once the website is live.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8">
              <Globe className="w-8 h-8 text-blue-500" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">New Domain Name</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              The domain you previously selected for <strong>{companyName || 'your business'}</strong> is unfortunately unavailable. 
              Please enter an alternative domain name below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                  Desired Domain
                </label>
                <div className="relative">
                  <input
                    id="domain"
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    required
                    autoFocus
                  />
                  <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
                {error && <p className="text-rose-500 text-sm mt-2 ml-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit New Domain
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <p className="text-center text-slate-500 text-sm mt-8">
              We'll check the availability of the new domain and get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
