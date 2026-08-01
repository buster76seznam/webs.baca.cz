'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`/api/partners/verify?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (data.success) {
          setPartnerId(data.partnerId);
          setPartnerName(data.name);
          setStatus('success');
        } else {
          setErrorMessage(data.error || 'Verification failed. Please try again.');
          setStatus('error');
        }
      } catch {
        setErrorMessage('An error occurred. Please try again.');
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#030303] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Verifying your email...</h1>
            <p className="text-gray-600 dark:text-zinc-400 font-bold">Please wait a moment.</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">✓</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 dark:text-zinc-400 font-bold">
                Welcome, {partnerName}! Your account is now active.
              </p>
            </div>

            <div className="bg-brand/10 border-2 border-brand/30 rounded-2xl p-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">Your Partner ID</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{partnerId}</p>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2 font-bold">Save this – you&apos;ll need it to login</p>
            </div>

            <Link
              href="/partnerprogram"
              className="inline-block bg-brand text-white px-8 py-4 rounded-xl font-black uppercase tracking-tighter hover:bg-brand-dark transition-all duration-300 shadow-2xl shadow-brand/30"
            >
              Go to Partner Dashboard →
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">✗</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-zinc-400 font-bold">
                {errorMessage}
              </p>
            </div>

            <Link
              href="/partnerprogram"
              className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-black uppercase tracking-tighter hover:opacity-90 transition-all duration-300"
            >
              Back to Partner Program
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#030303] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
