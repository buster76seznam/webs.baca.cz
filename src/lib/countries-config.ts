export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  price: number;
  affiliatePercentage: number;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  // North America
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    price: 150,
    affiliatePercentage: 30,
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    symbol: 'C$',
    price: 200,
    affiliatePercentage: 30,
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    symbol: '$',
    price: 3000,
    affiliatePercentage: 30,
  },

  // Europe
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    price: 120,
    affiliatePercentage: 25,
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  FR: {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  CH: {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    symbol: 'CHF',
    price: 160,
    affiliatePercentage: 25,
  },
  AT: {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  PL: {
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    currency: 'PLN',
    symbol: 'zł',
    price: 600,
    affiliatePercentage: 25,
  },
  CZ: {
    code: 'CZ',
    name: 'Czech Republic',
    flag: '🇨🇿',
    currency: 'CZK',
    symbol: 'Kč',
    price: 3500,
    affiliatePercentage: 25,
  },
  SK: {
    code: 'SK',
    name: 'Slovakia',
    flag: '🇸🇰',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  SE: {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    currency: 'SEK',
    symbol: 'kr',
    price: 1400,
    affiliatePercentage: 25,
  },
  NO: {
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    currency: 'NOK',
    symbol: 'kr',
    price: 1600,
    affiliatePercentage: 25,
  },
  DK: {
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    currency: 'DKK',
    symbol: 'kr',
    price: 1000,
    affiliatePercentage: 25,
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  GR: {
    code: 'GR',
    name: 'Greece',
    flag: '🇬🇷',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },
  HU: {
    code: 'HU',
    name: 'Hungary',
    flag: '🇭🇺',
    currency: 'HUF',
    symbol: 'Ft',
    price: 50000,
    affiliatePercentage: 25,
  },
  RO: {
    code: 'RO',
    name: 'Romania',
    flag: '🇷🇴',
    currency: 'RON',
    symbol: 'lei',
    price: 700,
    affiliatePercentage: 25,
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    currency: 'EUR',
    symbol: '€',
    price: 140,
    affiliatePercentage: 25,
  },

  // Asia
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    symbol: 'A$',
    price: 250,
    affiliatePercentage: 30,
  },
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    symbol: 'NZ$',
    price: 250,
    affiliatePercentage: 30,
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    symbol: 'S$',
    price: 200,
    affiliatePercentage: 30,
  },
  HK: {
    code: 'HK',
    name: 'Hong Kong',
    flag: '🇭🇰',
    currency: 'HKD',
    symbol: 'HK$',
    price: 1200,
    affiliatePercentage: 30,
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    symbol: '¥',
    price: 16000,
    affiliatePercentage: 30,
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    price: 12000,
    affiliatePercentage: 30,
  },

  // Others
  BR: {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    symbol: 'R$',
    price: 800,
    affiliatePercentage: 30,
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    symbol: 'R',
    price: 2500,
    affiliatePercentage: 30,
  },
};

export const DEFAULT_COUNTRY: CountryConfig = COUNTRIES['US'];

export function getCountryConfig(countryCode: string): CountryConfig {
  return COUNTRIES[countryCode.toUpperCase()] || DEFAULT_COUNTRY;
}

export function formatPrice(price: number, currency: string): string {
  const config = Object.values(COUNTRIES).find(c => c.currency === currency);
  const symbol = config?.symbol || '$';
  
  if (['JPY', 'INR', 'HUF', 'PLN', 'RON', 'SEK', 'NOK', 'DKK', 'CZK', 'MXN', 'BRL', 'ZAR', 'HKD'].includes(currency)) {
    return `${Math.round(price)} ${symbol}`;
  }
  
  return `${symbol}${price.toFixed(2)}`;
}
