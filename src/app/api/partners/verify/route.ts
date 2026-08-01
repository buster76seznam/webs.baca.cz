import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const { data: partner, error: findError } = await supabase
      .from('partners')
      .select('id, referral_code, name, verified')
      .eq('verification_token', token)
      .single();

    if (findError || !partner) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 404 }
      );
    }

    if (partner.verified) {
      return NextResponse.json({
        success: true,
        partnerId: partner.referral_code,
        name: partner.name,
        message: 'Email already verified',
      });
    }

    const { error: updateError } = await supabase
      .from('partners')
      .update({
        verified: true,
        approved_at: new Date().toISOString(),
      })
      .eq('verification_token', token);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      partnerId: partner.referral_code,
      name: partner.name,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
