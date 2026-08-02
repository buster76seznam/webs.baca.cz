import { NextRequest, NextResponse } from 'next/server';

const AFFILIATE_PASSWORD = 'Kx9Pm2Qz7R';
const COOKIE_NAME = 'affiliate_admin_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 dní v sekundách

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Heslo je povinné' },
        { status: 400 }
      );
    }

    if (password !== AFFILIATE_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Nesprávné heslo' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}
