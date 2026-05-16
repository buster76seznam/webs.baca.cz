"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

type ContactLeadModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactLeadModal({ open, onClose }: ContactLeadModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reset = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    }, 100);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      reset();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, reset]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, website: "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Odeslání se nezdařilo");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Chyba spojení, zkuste to prosím znovu");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Zavřít"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-xl max-h-[min(88dvh,680px)] flex-col overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-brand/20"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/5 px-6 sm:px-8 pt-6 sm:pt-7 pb-5">
          <h2
            id={titleId}
            className="min-w-0 pr-2 text-sm sm:text-base font-black uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white leading-snug"
          >
            {status === "sent" ? "Hotovo" : "Nezávazná poptávka"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2.5 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Zavřít"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-5 sm:py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {status === "sent" ? (
            <p className="text-center text-zinc-300 py-10 text-base font-medium leading-relaxed">
              Formulář odeslán. Brzy se vám ozveme.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <div>
                <label htmlFor="cl-name" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  Jméno
                </label>
                <input
                  id="cl-name"
                  name="name"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="cl-email" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  E-mail
                </label>
                <input
                  id="cl-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="cl-phone" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  Telefon
                </label>
                <input
                  id="cl-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="cl-msg" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  Zpráva
                </label>
                <textarea
                  id="cl-msg"
                  name="message"
                  required
                  rows={4}
                  maxLength={8000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-base text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[128px]"
                />
              </div>
              {status === "error" && errorMsg ? (
                <p className="text-sm text-red-400 font-medium" role="alert">
                  {errorMsg}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 w-full rounded-xl bg-brand py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                {status === "sending" ? "Odesílám…" : "Odeslat"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
