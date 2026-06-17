import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '0.0.0.0';
    
    // Use freeipapi.com for geolocation
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`);
    const data = await response.json();
    
    const countryCode = data.countryCode || 'CZ';
    const isUSA = countryCode === 'US';
    const isSpain = countryCode === 'ES';
    
    return NextResponse.json({ 
      countryCode, 
      isUSA,
      isSpain,
      countryName: data.countryName || 'Czech Republic'
    });
  } catch (error) {
    console.error('Error detecting country:', error);
    return NextResponse.json({ 
      countryCode: 'CZ', 
      isUSA: false,
      isSpain: false,
      countryName: 'Czech Republic'
    });
  }
}
