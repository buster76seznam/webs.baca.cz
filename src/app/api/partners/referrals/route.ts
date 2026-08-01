import { NextRequest, NextResponse } from 'next/server';

// Store referral data in memory (in production, use database)
const referralData: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, clientId, email, amount, status = 'active' } = body;

    if (!partnerId || !clientId || !email || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const key = `${partnerId}_${clientId}`;
    referralData[key] = {
      partnerId,
      clientId,
      email,
      amount,
      status,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      referralId: key,
      message: 'Referral recorded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const partnerId = request.nextUrl.searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID required' },
        { status: 400 }
      );
    }

    // Get all referrals for this partner
    const partnerReferrals = Object.values(referralData).filter(
      (ref: any) => ref.partnerId === partnerId && ref.status === 'active'
    );

    return NextResponse.json({
      partnerId,
      referrals: partnerReferrals,
      totalActive: partnerReferrals.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}
