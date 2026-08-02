import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'affiliate_admin_auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME);
  const isAuthenticated = cookie?.value === 'authenticated';
  return NextResponse.json({ authenticated: isAuthenticated });
}
