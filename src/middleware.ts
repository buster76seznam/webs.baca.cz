import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// European country codes
const EUROPEAN_COUNTRIES = [
  'DE', 'AT', 'CH', 'FR', 'BE', 'LU', 'IT', 'ES', 'PT', 'PL', 'NL',
  'SE', 'NO', 'DK', 'FI', 'GR', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE',
  'LV', 'LT', 'IE', 'IS', 'MT', 'CY', 'SK', 'GB', 'UK'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Only apply to root path, not to /usa, /eu, /orders, etc.
  if (pathname !== '/') {
    return NextResponse.next();
  }

  // Check if user already has a region preference in cookies
  const regionPreference = request.cookies.get('region_preference')?.value;
  if (regionPreference) {
    if (regionPreference === 'usa') {
      return NextResponse.redirect(new URL('/usa', request.url));
    } else if (regionPreference === 'eu') {
      return NextResponse.redirect(new URL('/eu', request.url));
    }
  }

  // Detect country from IP
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '0.0.0.0';
    
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`);
    const data = await response.json();
    const countryCode = data.countryCode || 'CZ';

    // Redirect based on country
    if (countryCode === 'US') {
      const redirect = NextResponse.redirect(new URL('/usa', request.url));
      redirect.cookies.set('region_preference', 'usa', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      return redirect;
    } else if (EUROPEAN_COUNTRIES.includes(countryCode)) {
      const redirect = NextResponse.redirect(new URL('/eu', request.url));
      redirect.cookies.set('region_preference', 'eu', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      return redirect;
    } else {
      // Redirect all other countries to /usa
      const redirect = NextResponse.redirect(new URL('/usa', request.url));
      redirect.cookies.set('region_preference', 'usa', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      return redirect;
    }
  } catch (error) {
    console.error('Error detecting country:', error);
    // On error, redirect to /usa as default
    const redirect = NextResponse.redirect(new URL('/usa', request.url));
    redirect.cookies.set('region_preference', 'usa', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    return redirect;
  }
}

export const config = {
  matcher: '/',
};
