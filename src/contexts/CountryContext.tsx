'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CountryContextType {
  isUSA: boolean;
  language: 'cs' | 'en';
  currency: string;
  price: number;
  priceDisplay: string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [isUSA, setIsUSA] = useState(false);
  const [language, setLanguage] = useState<'cs' | 'en'>('cs');

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('/api/detect-country');
        const data = await response.json();
        
        const usaDetected = data.isUSA || false;
        setIsUSA(usaDetected);
        setLanguage(usaDetected ? 'en' : 'cs');
      } catch (error) {
        console.error('Error detecting country:', error);
        // Default to Czech if detection fails
        setIsUSA(false);
        setLanguage('cs');
      }
    };

    detectCountry();
  }, []);

  const currency = isUSA ? 'USD' : 'Kč';
  const price = isUSA ? 150 : 1700;
  const priceDisplay = isUSA ? '$150' : '1 700 Kč';

  return (
    <CountryContext.Provider value={{ isUSA, language, currency, price, priceDisplay }}>
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
