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
  // Auth check only (skip IP whitelist for Vercel compatibility)
  const isAuth = await checkAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch from VPS
    const response = await fetch(`${VPS_URL}/api/stats`);
    if (!response.ok) {
      throw new Error('VPS server error');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ contacted: 0, blacklisted: 0, replies: 0, drafts: 0 });
  }
}
