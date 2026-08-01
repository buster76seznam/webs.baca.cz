import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const ref = request.nextUrl.searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });
    }

    // Find partner by referral_code to get UUID
    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('referral_code', ref)
      .single();

    if (!partner) {
      // Still return success - don't expose whether partner exists
      return NextResponse.json({ success: true });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || null;
    const userAgent = request.headers.get('user-agent') || null;

    await supabase.from('partner_clicks').insert({
      partner_id: partner.id,
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
