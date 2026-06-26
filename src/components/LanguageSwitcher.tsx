'use client';

import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-gb', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[1];

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Change language"
        >
          <Globe size={20} className="text-gray-800" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-12 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 max-h-96 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-brand text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
