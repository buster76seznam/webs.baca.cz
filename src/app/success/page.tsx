import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">

        {/* Success icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Payment Successful! 🎉
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* What happens next */}
        <div className="w-full bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">
            What happens next?
          </h2>
          <ol className="flex flex-col gap-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mt-0.5">
                1
              </span>
              <div>
                <p className="text-white font-medium text-sm">Domain &amp; SSL Configuration</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  Our team is linking your domain name and setting up secure hosting infrastructure.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mt-0.5">
                2
              </span>
              <div>
                <p className="text-white font-medium text-sm">Email Confirmation</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  An official invoice and confirmation receipt have been sent to your email address via Stripe.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mt-0.5">
                3
              </span>
              <div>
                <p className="text-white font-medium text-sm">Live Launch</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  Your website will be fully active and live on your custom domain within 24 hours.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Order reference */}
        {sessionId && (
          <div className="w-full bg-slate-800/40 rounded-lg px-4 py-3 border border-slate-700/40">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Order Reference</p>
            <p className="text-slate-300 text-xs font-mono break-all">{sessionId}</p>
          </div>
        )}

        {/* Contact + CTA */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-slate-400 text-sm text-center">
            Have questions?{' '}
            <a
              href="mailto:webs.baca.support@gmail.com"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              webs.baca.support@gmail.com
            </a>
          </p>
          <Link
            href="/"
            className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}
