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
  console.log('[Stats] Session cookie:', session?.value);
  return session?.value === 'valid';
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  
  console.log('[Stats] Client IP:', clientIp);
  console.log('[Stats] Allowed IPs:', ALLOWED_IPS);
  
  // IP whitelist check
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    console.log('[Stats] IP not in whitelist');
    return new NextResponse(null, { status: 404 });
  }

  // Auth check
  const isAuth = await checkAuth(req);
  console.log('[Stats] Auth check result:', isAuth);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${VPS_URL}/api/data`);
    if (!response.ok) {
      throw new Error('VPS server error');
    }

    const data = await response.json();
    
    // Calculate stats from CSV data
    const contactedCount = data.contacted_log?.length || 0;
    const blacklistCount = data.blacklist?.length || 0;
    const repliesCount = data.reply_log?.length || 0;
    const draftsCount = data.drafts_count || 0;

    return NextResponse.json({
      contacted: contactedCount,
      blacklisted: blacklistCount,
      replies: repliesCount,
      drafts: draftsCount,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', contacted: 0, blacklisted: 0, replies: 0, drafts: 0 },
      { status: 200 }
    );
  }
}
