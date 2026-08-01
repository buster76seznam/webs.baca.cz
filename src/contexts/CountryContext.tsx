'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { COUNTRIES, DEFAULT_COUNTRY, getCountryConfig, type CountryConfig } from '@/lib/countries-config';

interface CountryContextType {
  country: CountryConfig;
  countryCode: string;
  setCountry: (countryCode: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryConfig>(DEFAULT_COUNTRY);
  const [countryCode, setCountryCodeState] = useState<string>('US');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for saved country in cookies
    const savedCountry = document?.cookie
      .split('; ')
      .find(row => row.startsWith('websbaca_country='))
      ?.split('=')[1];

    if (savedCountry && COUNTRIES[savedCountry]) {
      setCountryState(COUNTRIES[savedCountry]);
      setCountryCodeState(savedCountry);
    }
  }, []);

  const setCountry = (newCountryCode: string) => {
    const newConfig = getCountryConfig(newCountryCode);
    setCountryState(newConfig);
    setCountryCodeState(newCountryCode);
    
    // Save to cookie for 30 days
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `websbaca_country=${newCountryCode};expires=${expires.toUTCString()};path=/`;
  };

  if (!mounted) {
    return (
      <CountryContext.Provider value={{ country: DEFAULT_COUNTRY, countryCode: 'US', setCountry: () => {} }}>
        {children}
      </CountryContext.Provider>
    );
  }

  return (
    <CountryContext.Provider value={{ country, countryCode, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
