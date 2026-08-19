import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

type Commission = {
  id: string;
  order_id: string;
  influencer_id: string;
  order_amount: number;
  commission_pct: number;
  commission_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  stripe_transfer_id: string | null;
};

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  global: {
    fetch: (url, options) => {
      const headers = new Headers();
      if (options?.headers) {
        const incomingHeaders = options.headers instanceof Headers 
          ? Object.fromEntries(options.headers.entries())
          : options.headers as Record<string, string>;

        Object.entries(incomingHeaders).forEach(([key, value]) => {
          try {
            const safeValue = String(value).replace(/[^\x00-\x7F]/g, '');
            headers.set(key, safeValue);
          } catch (e) {}
        });
      }
      return fetch(url, { ...options, headers });
    }
  }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // 1. Vyhledej všechny komise se statusem 'pending'
    const fetchResponse = await fetch(`${supabaseUrl}/rest/v1/commissions?status=eq.pending&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Accept': 'application/json'
      }
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('Error fetching pending commissions (direct fetch):', errorText);
      return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
    }

    const pendingCommissions: Commission[] = await fetchResponse.json();

    if (!pendingCommissions || pendingCommissions.length === 0) {
      return NextResponse.json({ message: 'No pending commissions to process.' });
    }

    // 2. Seskup komise podle influencer_id
    const commissionsByInfluencer = pendingCommissions.reduce((acc: Record<string, Commission[]>, commission: Commission) => {
      const influencerId = commission.influencer_id;
      if (!acc[influencerId]) {
        acc[influencerId] = [];
      }
      acc[influencerId].push(commission);
      return acc;
    }, {} as Record<string, typeof pendingCommissions>);

    // 3. Projdi každého influencera a proveď výplatu
    for (const influencerId in commissionsByInfluencer) {
      const commissions = commissionsByInfluencer[influencerId];
      
      const partnerFetchResponse = await fetch(`${supabaseUrl}/rest/v1/partners?id=eq.${influencerId}&select=stripe_connect_account_id,status`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json'
        }
      });

      if (!partnerFetchResponse.ok) {
        console.warn(`Failed to fetch partner info for ${influencerId}`);
        continue;
      }

      const partners = await partnerFetchResponse.json();
      const influencer = partners[0];

      if (!influencer || !influencer.stripe_connect_account_id || influencer.status !== 'active') {
        console.warn(`Skipping payout for influencer ${influencerId}: No active Stripe account or influencer is not active.`);
        continue;
      }

      try {
        const totalPayout = commissions.reduce((sum, c) => sum + c.commission_amount, 0);

        if (totalPayout <= 0) {
          console.log(`Skipping payout for influencer ${influencerId}: No amount to pay out.`);
          continue;
        }

        // 4. Proveď převod přes Stripe
        const transfer = await stripe.transfers.create({
          amount: Math.round(totalPayout * 100), // v centech
          currency: 'usd',
          destination: influencer.stripe_connect_account_id,
          description: `Affiliate payout for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        });

        // 5. Aktualizuj stav komisí v DB přes direct fetch
        const commissionIds = commissions.map(c => c.id);
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/commissions?id=in.(${commissionIds.join(',')})`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_transfer_id: transfer.id,
          })
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error(`Failed to update status for commissions of influencer ${influencerId} (direct fetch):`, errorText);
        } else {
          console.log(`Successfully paid ${totalPayout} to influencer ${influencerId}.`);
        }

      } catch (payoutError) {
        console.error(`Payout failed for influencer ${influencerId}:`, payoutError);
      }
    }

    return NextResponse.json({ message: 'Payout process completed.' });

  } catch (error) {
    console.error('Cron job for payouts failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
