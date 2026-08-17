
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../../../lib/supabase';
import { Tables } from '../../../../../types/supabase';
import { ReportEmail } from '../../../../../lib/emails/report-email';

const resend = new Resend(process.env.RESEND_API_KEY);

type Order = Tables<'orders'>;
type Partner = Tables<'partners'>;
type Commission = Tables<'partner_referrals'>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Use `request.headers.get('authorization')` for security in production
  const cronSecret = searchParams.get('cron_secret') || request.headers.get('authorization')?.replace('Bearer ', '');

  // IMPORTANT: Add back CRON_SECRET check for production
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  // Calculate date range for the last month
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth);
  lastDayOfLastMonth.setDate(lastDayOfLastMonth.getDate() - 1);
  const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);

  const from = firstDayOfLastMonth.toISOString();
  const to = lastDayOfLastMonth.toISOString();

  try {
    // 1. Fetch data from Supabase
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('price, company_country, status, created_at, ref_code')
      .gte('created_at', from)
      .lte('created_at', to);

    if (ordersError) throw ordersError;

    const { data: influencers, error: influencersError } = await supabase
      .from('partners')
      .select('id, name, referral_code, created_at');

    if (influencersError) throw influencersError;

    const { data: commissions, error: commissionsError } = await supabase
      .from('partner_referrals')
      .select('amount, created_at, partner_id')
      .gte('created_at', from)
      .lte('created_at', to);

    if (commissionsError) throw commissionsError;

    // 2. Aggregate data
    const grossRevenue = (orders as Order[])
      .filter(order => order.status === 'paid' || order.status === 'active')
      .reduce((sum, order) => sum + (order.price || 0), 0);

    const newCustomers = orders.length;

    const ordersByRegion = (orders as Order[]).reduce((acc, order) => {
        const country = order.company_country;
        if (country === 'USA' || country === 'Canada') {
            acc.USACanada = (acc.USACanada || 0) + 1;
        }
        else if (country === 'United Kingdom') {
            acc.UK = (acc.UK || 0) + 1;
        }
        else {
            acc.Europe = (acc.Europe || 0) + 1;
        }
        return acc;
    }, { USACanada: 0, Europe: 0, UK: 0 });

    const orderStatusCounts = (orders as Order[]).reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalInfluencers = influencers.length;

    const newInfluencers = (influencers as Partner[]).filter(i => {
        const createdAt = new Date(i.created_at);
        return createdAt >= firstDayOfLastMonth && createdAt <= lastDayOfLastMonth;
    }).length;

    const totalCommissions = (commissions as Commission[]).reduce((sum, commission) => sum + (commission.amount || 0), 0);

    const netRevenue = grossRevenue - totalCommissions;

    const topInfluencers = (influencers as Partner[]).map(influencer => {
        const referredOrders = (orders as Order[]).filter(order => order.ref_code === influencer.referral_code);
        const commission = (commissions as Commission[])
            .filter(c => c.partner_id === influencer.id)
            .reduce((sum, c) => sum + (c.amount || 0), 0);

        return {
            name: influencer.name || 'N/A',
            referral_code: influencer.referral_code,
            customers: referredOrders.length,
            commission: commission
        }
    })
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 3);


    // 3. Send email
    await resend.emails.send({
      from: 'System <system@webs.baca.cz>',
      to: ['webs.baca@gmail.com'],
      subject: `Webs Bača - Executive Monthly Report: ${firstDayOfLastMonth.toLocaleDateString()} – ${lastDayOfLastMonth.toLocaleDateString()}`,
      react: <ReportEmail
        reportType="Monthly"
        fromDate={from}
        toDate={to}
        grossRevenue={grossRevenue}
        netRevenue={netRevenue}
        totalCommissions={totalCommissions}
        newCustomers={newCustomers}
        ordersByRegion={ordersByRegion}
        orderStatusCounts={orderStatusCounts}
        totalInfluencers={totalInfluencers}
        newInfluencers={newInfluencers}
        topInfluencers={topInfluencers}
      />,
    });

    return NextResponse.json({ message: 'Monthly report sent successfully.' });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    return NextResponse.json({ message: 'Error generating monthly report.' }, { status: 500 });
  }
}
