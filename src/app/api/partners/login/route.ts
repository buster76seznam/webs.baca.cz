import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId } = body;

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const { data: partner, error: findError } = await supabase
      .from('partners')
      .select('id, referral_code, name, email, verified, active')
      .eq('referral_code', partnerId.trim())
      .single();

    if (findError || !partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    if (!partner.verified) {
      return NextResponse.json(
        { success: false, error: 'Email not verified. Please check your inbox.' },
        { status: 403 }
      );
    }

    if (!partner.active) {
      return NextResponse.json(
        { success: false, error: 'Account not active. Contact support.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      partner: {
        partnerId: partner.referral_code,
        name: partner.name,
        email: partner.email,
        verified: partner.verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
