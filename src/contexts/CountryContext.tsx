'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Country code to language mapping for Europe and Americas
const COUNTRY_LANGUAGE_MAP: Record<string, 'cs' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'nl' | 'pt'> = {
  // Europe
  'CZ': 'cs',
  'SK': 'cs',
  'DE': 'de',
  'AT': 'de',
  'CH': 'de',
  'FR': 'fr',
  'BE': 'fr',
  'LU': 'fr',
  'IT': 'it',
  'ES': 'es',
  'PT': 'pt',
  'PL': 'pl',
  'NL': 'nl',
  'SE': 'en',
  'NO': 'en',
  'DK': 'en',
  'FI': 'en',
  'GR': 'en',
  'HU': 'en',
  'RO': 'en',
  'BG': 'en',
  'HR': 'en',
  'SI': 'en',
  'EE': 'en',
  'LV': 'en',
  'LT': 'en',
  'IE': 'en',
  'IS': 'en',
  'MT': 'en',
  'CY': 'en',
  
  // Americas
  'US': 'en',
  'CA': 'en',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'PE': 'es',
  'VE': 'es',
  'CL': 'es',
  'BR': 'pt',
};

// Country code to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, 'USD' | 'EUR' | 'CZK'> = {
  // USD zone
  'US': 'USD',
  'CA': 'USD',
  
  // EUR zone
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'PT': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'LU': 'EUR',
  'IE': 'EUR',
  'FI': 'EUR',
  'GR': 'EUR',
  'CY': 'EUR',
  'MT': 'EUR',
  'SI': 'EUR',
  'SK': 'EUR',
  'EE': 'EUR',
  'LV': 'EUR',
  'LT': 'EUR',
  
  // CZK zone
  'CZ': 'CZK',
};

interface CountryContextType {
  isUSA: boolean;
  isEurope: boolean;
  language: 'cs' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'nl' | 'pt';
  currency: string;
  price: number;
  priceDisplay: string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [isUSA, setIsUSA] = useState(false);
  const [isEurope, setIsEurope] = useState(false);
  const [language, setLanguage] = useState<'cs' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'nl' | 'pt'>('cs');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'CZK'>('CZK');

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('/api/detect-country');
        const data = await response.json();
        
        const countryCode = data.countryCode || 'CZ';
        const detectedLanguage = COUNTRY_LANGUAGE_MAP[countryCode] || 'en';
        const detectedCurrency = COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
        
        setIsUSA(countryCode === 'US');
        setIsEurope(['DE', 'AT', 'CH', 'FR', 'BE', 'LU', 'IT', 'ES', 'PT', 'PL', 'NL', 'SE', 'NO', 'DK', 'FI', 'GR', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'IE', 'IS', 'MT', 'CY', 'SK'].includes(countryCode));
        setLanguage(detectedLanguage);
        setCurrency(detectedCurrency);
      } catch (error) {
        console.error('Error detecting country:', error);
        // Default to English and USD if detection fails
        setIsUSA(false);
        setIsEurope(false);
        setLanguage('en');
        setCurrency('USD');
      }
    };

    detectCountry();
  }, []);

  const price = currency === 'EUR' ? 140 : currency === 'CZK' ? 1700 : 70;
  const priceDisplay = currency === 'EUR' ? '140€' : currency === 'CZK' ? '1700 Kč' : '$70';

  return (
    <CountryContext.Provider value={{ isUSA, isEurope, language, currency: currency === 'CZK' ? 'Kč' : currency, price, priceDisplay }}>
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
