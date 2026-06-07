import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VPS_URL = process.env.VPS_URL || 'http://142.93.163.199:5000';
const ALLOWED_IPS = (process.env.ALLOWED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? '0.0.0.0';
  return ip;
}

async function checkAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'valid';
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  
  // IP whitelist check
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    return new NextResponse(null, { status: 404 });
  }

  // Auth check
  const isAuth = await checkAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${VPS_URL}/api/log`);
    if (!response.ok) {
      throw new Error('VPS server error');
    }

    const data = await response.json();
    const logLines = data.log || [];
    
    // Return last 60 lines
    const recentLog = logLines.slice(-60);

    return NextResponse.json({ log: recentLog });
  } catch (error) {
    console.error('Log fetch error:', error);
    return NextResponse.json({ log: [] }, { status: 200 });
  }
}
