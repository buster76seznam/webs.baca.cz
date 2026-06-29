import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VPS_URL = process.env.VPS_URL || 'http://142.93.163.199:5000';

async function checkAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'valid';
}

export async function POST(req: NextRequest) {
  // Auth check
  const isAuth = await checkAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { to_email, first_name, proposal_url } = body;

    // Validate required fields
    if (!to_email || !first_name || !proposal_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to_email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(proposal_url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Forward to VPS
    const response = await fetch(`${VPS_URL}/mail/send-proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_email, first_name, proposal_url }),
    });

    if (!response.ok) {
      throw new Error('VPS server error');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Send proposal error:', error);
    return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
  }
}
