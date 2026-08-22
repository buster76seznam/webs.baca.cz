import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTier, TIER_STRUCTURE } from '@/lib/affiliate-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    const { partnerId } = await params;

    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('id, referral_code, name, email, verified, active')
      .eq('referral_code', partnerId)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Count clicks from partner_clicks table
    const { count: totalClicks } = await supabase
      .from('partner_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partner.id);

    // Count active referrals from partner_referrals
    const { count: activeClients } = await supabase
      .from('partner_referrals')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partner.id)
      .eq('status', 'active');

    const clientCount = activeClients ?? 0;
    const clickCount = totalClicks ?? 0;

    const tier = getTier(clientCount);
    const tierInfo = TIER_STRUCTURE[tier];

    // Základní cena předplatného v USD (konzistentní s provizními tiery)
    const BASE_PRICE_USD = 150;
    const monthlyRevenue = clientCount * BASE_PRICE_USD;
    const monthlyPayout = clientCount * tierInfo.usdCommission;

    return NextResponse.json({
      partnerId,
      name: partner.name,
      totalClicks: clickCount,
      activeClients: clientCount,
      monthlyRevenue,
      monthlyPayout,
      tier,
      referralLink: `https://websbaca.cz?ref=${partnerId}`,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
