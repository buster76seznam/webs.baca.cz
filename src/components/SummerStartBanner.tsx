"use client";

import { Sun, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "wb_summer_banner_dismissed";

export const SUMMER_BANNER_HEIGHT = "3.25rem"; /* ~52px – sync s nav offset */

type SummerStartBannerProps = {
  onCta?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
};

export default function SummerStartBanner({ onCta, onVisibilityChange }: SummerStartBannerProps) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let hidden = false;
    try {
      hidden = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (hidden) setVisible(false);
  }, []);

  useEffect(() => {
    if (mounted) onVisibilityChange?.(visible);
  }, [visible, mounted, onVisibilityChange]);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] border-b-2 border-amber-500/80 bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#FBBF24] text-[#422006] shadow-[0_8px_32px_rgba(250,204,21,0.45)]"
      role="region"
      aria-label="Letní akce Letní start – první měsíc zdarma"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 sm:gap-4 relative min-h-[3.25rem]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center pr-8 sm:pr-0">
          <span className="hidden sm:flex shrink-0 w-9 h-9 rounded-full bg-amber-900/15 items-center justify-center">
            <Sun className="w-5 h-5 text-amber-900" aria-hidden />
          </span>
          <p className="text-center text-[11px] sm:text-sm font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] leading-snug">
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-900" aria-hidden />
              <span className="text-amber-950">Letní start</span>
            </span>
            <span className="mx-1.5 sm:mx-2 text-amber-800/70">—</span>
            <span className="text-amber-950">první měsíc zdarma</span>
          </p>
          {onCta ? (
            <button
              type="button"
              onClick={onCta}
              className="hidden md:inline-flex shrink-0 ml-2 px-4 py-1.5 rounded-lg bg-amber-950 text-[#FDE047] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
            >
              Využít akci
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-amber-900/70 hover:bg-amber-900/10 hover:text-amber-950 transition-colors"
          aria-label="Zavřít oznámení"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
