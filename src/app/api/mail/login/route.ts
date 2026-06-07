import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ALLOWED_IPS = (process.env.ALLOWED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? '0.0.0.0';
  return ip;
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  
  console.log('[Login] Client IP:', clientIp);
  console.log('[Login] Allowed IPs:', ALLOWED_IPS);
  console.log('[Login] Password configured:', !!ADMIN_PASSWORD);
  
  // IP whitelist check - only enforce if IPs are configured
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    console.log('[Login] IP not in whitelist');
    return new NextResponse(null, { status: 404 });
  }

  try {
    const body = await req.json();
    const { password } = body;

    console.log('[Login] Password provided:', !!password);
    console.log('[Login] Password match:', password === ADMIN_PASSWORD);

    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'valid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('[Login] Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
