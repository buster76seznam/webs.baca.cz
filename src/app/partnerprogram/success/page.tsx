'use client';

import { useEffect } from 'react';
import { useAffiliate } from '@/contexts/AffiliateContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PartnerSuccessPage() {
  const { partner, isLoggedIn } = useAffiliate();

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#030303] text-gray-900 dark:text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-2xl w-full"
      >
        <h1 className="text-4xl sm:text-5xl font-black text-green-500 mb-4">Payout Account Connected Successfully! 🎉</h1>
        <p className="text-lg text-gray-600 dark:text-zinc-400 font-bold mb-8">
          Your Stripe account is now connected and ready to receive payouts.
        </p>

        {isLoggedIn && partner ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 mb-3">
                Your Unique Referral Link
              </p>
              <div className="bg-gray-100 dark:bg-black/20 rounded-lg p-4 border border-gray-300 dark:border-white/10">
                <code className="text-sm md:text-base text-gray-700 dark:text-zinc-300 font-mono break-all">
                  {partner.referralLink}
                </code>
              </div>
            </div>
            <Link href="/partnerprogram">
                <a className="inline-block bg-brand text-white px-8 py-4 rounded-xl font-black hover:bg-brand-dark transition-all duration-300 uppercase tracking-tighter">
                    Go to your Dashboard
                </a>
            </Link>
          </div>
        ) : (
          <p className="text-lg text-gray-600 dark:text-zinc-400 font-bold">
            Please log in to view your dashboard and referral link.
          </p>
        )}
      </motion.div>
    </div>
  );
}
