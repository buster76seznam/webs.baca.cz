import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTier, TIER_STRUCTURE } from '@/lib/affiliate-config';

const COOKIE_NAME = 'affiliate_admin_auth';
const BASE_PRICE_CZK = 3500;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { partnerId } = await params;

    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('id, name, email, referral_code, verified, active, social_links, created_at, payout_method')
      .eq('referral_code', partnerId)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    const [clicksCountResult, recentClicksResult, referralsResult, allReferralsResult] = await Promise.all([
      supabase
        .from('partner_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', partner.id),
      supabase
        .from('partner_clicks')
        .select('clicked_at, ip_address, user_agent')
        .eq('partner_id', partner.id)
        .order('clicked_at', { ascending: false })
        .limit(50),
      supabase
        .from('partner_referrals')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', partner.id)
        .eq('status', 'active'),
      supabase
        .from('partner_referrals')
        .select('client_email, client_name, amount, status, created_at')
        .eq('partner_id', partner.id)
        .order('created_at', { ascending: false }),
    ]);

    const totalClicks = clicksCountResult.count ?? 0;
    const activeClients = referralsResult.count ?? 0;

    const tier = getTier(activeClients);
    const tierInfo = TIER_STRUCTURE[tier];
    const monthlyRevenue = activeClients * BASE_PRICE_CZK;
    const monthlyPayout = activeClients * (tierInfo.commissionPercent / 100) * BASE_PRICE_CZK;

    return NextResponse.json({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      referralCode: partner.referral_code,
      verified: partner.verified,
      active: partner.active,
      socialLinks: partner.social_links,
      createdAt: partner.created_at,
      payoutMethod: partner.payout_method,
      totalClicks,
      activeClients,
      tier,
      tierName: tierInfo.name,
      commissionPercent: tierInfo.commissionPercent,
      monthlyRevenue,
      monthlyPayout,
      referralLink: `https://websbaca.cz?ref=${partner.referral_code}`,
      recentClicks: recentClicksResult.data ?? [],
      referrals: allReferralsResult.data ?? [],
    });
  } catch {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
