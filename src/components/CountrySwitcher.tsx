'use client';

import { useCountry } from '@/contexts/CountryContext';
import { COUNTRIES } from '@/lib/countries-config';
import { ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CountrySwitcher() {
  const { country, countryCode, setCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const countryList = Object.values(COUNTRIES).sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium text-zinc-300 hover:text-white"
      >
        <span className="text-lg">{country.flag}</span>
        <span className="hidden sm:inline">{country.code}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1 p-2">
            {countryList.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountry(c.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  c.code === countryCode
                    ? 'bg-brand text-white'
                    : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{c.code}</div>
                  <div className="text-xs opacity-70">{c.currency}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
