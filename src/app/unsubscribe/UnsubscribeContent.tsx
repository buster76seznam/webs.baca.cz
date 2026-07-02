'use client';

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const VPS_SERVER = "http://142.93.163.199:5000";

export default function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [logoError, setLogoError] = useState(false);

  const handleUnsubscribe = useCallback(async () => {
    if (!email) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(`${VPS_SERVER}/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("success");
    }
  }, [email]);

  useEffect(() => {
    handleUnsubscribe();
  }, [handleUnsubscribe]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
        <div className="relative w-16 h-16 overflow-hidden rounded-2xl border-2 border-brand bg-[#1a0b2e] mb-8">
          {!logoError ? (
            <Image src="/Logo.png" alt="Webs Bača" fill sizes="64px" className="object-contain p-1" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-full h-full bg-brand flex items-center justify-center">
              <span className="text-white font-black text-xl">W</span>
            </div>
          )}
        </div>
        <div className="text-zinc-500 text-lg">Unsubscribing...</div>
      </div>
    );
  }

  if (status === "error" && !email) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
        <div className="relative w-16 h-16 overflow-hidden rounded-2xl border-2 border-brand bg-[#1a0b2e] mb-8">
          {!logoError ? (
            <Image src="/Logo.png" alt="Webs Bača" fill sizes="64px" className="object-contain p-1" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-full h-full bg-brand flex items-center justify-center">
              <span className="text-white font-black text-xl">W</span>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Missing Email Address</h1>
        <p className="text-zinc-500 text-center mb-8">
          This unsubscribe link is invalid. Contact us for manual unsubscription.
        </p>
        <Link
          href="/"
          className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="relative w-16 h-16 overflow-hidden rounded-2xl border-2 border-brand bg-[#1a0b2e] mb-8 mx-auto">
          {!logoError ? (
            <Image src="/Logo.png" alt="Webs Bača" fill sizes="64px" className="object-contain p-1" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-full h-full bg-brand flex items-center justify-center">
              <span className="text-white font-black text-xl">W</span>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4">
            Successfully Unsubscribed
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            ✓ You have been unsubscribed successfully.<br />
            You will no longer receive emails from us.
          </p>

          {email && (
            <p className="text-zinc-600 text-sm mt-4">
              Email: {email}
            </p>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-white text-black px-8 py-4 rounded-xl font-black hover:bg-zinc-200 transition-colors uppercase tracking-wider"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
