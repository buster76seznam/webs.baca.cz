import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTier, TIER_STRUCTURE } from '@/lib/affiliate-config';

const COOKIE_NAME = 'affiliate_admin_auth';
const BASE_PRICE_CZK = 3500;

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Načíst všechny partnery
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('id, name, email, referral_code, verified, active, social_links, created_at')
      .order('created_at', { ascending: false });

    if (partnersError) {
      return NextResponse.json({ error: 'Chyba při načítání partnerů' }, { status: 500 });
    }

    if (!partners || partners.length === 0) {
      return NextResponse.json({ partners: [], totals: { totalPartners: 0, totalClicks: 0, totalActiveClients: 0, totalRevenue: 0, totalPayouts: 0 } });
    }

    // Pro každého partnera načíst kliky a referraly
    const partnersWithStats = await Promise.all(
      partners.map(async (partner) => {
        const [clicksResult, referralsResult] = await Promise.all([
          supabase
            .from('partner_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('partner_id', partner.id),
          supabase
            .from('partner_referrals')
            .select('*', { count: 'exact', head: true })
            .eq('partner_id', partner.id)
            .eq('status', 'active'),
        ]);

        const totalClicks = clicksResult.count ?? 0;
        const activeClients = referralsResult.count ?? 0;

        const tier = getTier(activeClients);
        const tierInfo = TIER_STRUCTURE[tier];
        const monthlyRevenue = activeClients * BASE_PRICE_CZK;
        const monthlyPayout = activeClients * (tierInfo.commissionPercent / 100) * BASE_PRICE_CZK;

        return {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          referralCode: partner.referral_code,
          verified: partner.verified,
          active: partner.active,
          socialLinks: partner.social_links,
          createdAt: partner.created_at,
          totalClicks,
          activeClients,
          tier,
          tierName: tierInfo.name,
          commissionPercent: tierInfo.commissionPercent,
          monthlyRevenue,
          monthlyPayout,
          referralLink: `https://websbaca.cz?ref=${partner.referral_code}`,
        };
      })
    );

    // Celkové statistiky
    const totals = {
      totalPartners: partnersWithStats.length,
      totalClicks: partnersWithStats.reduce((s, p) => s + p.totalClicks, 0),
      totalActiveClients: partnersWithStats.reduce((s, p) => s + p.activeClients, 0),
      totalRevenue: partnersWithStats.reduce((s, p) => s + p.monthlyRevenue, 0),
      totalPayouts: partnersWithStats.reduce((s, p) => s + p.monthlyPayout, 0),
    };

    return NextResponse.json({ partners: partnersWithStats, totals });
  } catch {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
