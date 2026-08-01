'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSuccess?: (partnerId: string) => void;
}

export default function AffiliateLoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Demo: generate partner ID from email hash
      const emailHash = email
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString(16)
        .toUpperCase();
      
      const partnerId = `PARTNER_${emailHash}`;
      
      // Store in localStorage
      localStorage.setItem('affiliate_partner_id', partnerId);
      localStorage.setItem('affiliate_email', email);
      
      onSuccess?.(partnerId);
      
      // Redirect to dashboard
      window.location.href = '/partnerprogram';
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-2 text-zinc-300">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-zinc-500" size={18} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-zinc-300">Password *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-zinc-500" size={18} />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition"
            placeholder="••••••••"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading ? 'Logging in...' : (
          <>
            Login to Dashboard
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>

      <p className="text-center text-sm text-zinc-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => {
            const form = document.querySelector('[data-signup-form]') as HTMLElement;
            if (form) form.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-brand hover:text-brand-light transition"
        >
          Register here
        </button>
      </p>
    </motion.form>
  );
}
