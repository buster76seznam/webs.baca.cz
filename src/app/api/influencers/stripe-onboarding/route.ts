import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, socialLinks } = await req.json();

    if (!name || !email || !socialLinks) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }



    // Create a new partner (influencer) record
    const { data: partner, error: createError } = await supabase
      .from('partners')
      .insert([
        { name, email, social_links: socialLinks, status: 'pending_onboarding' }
      ])
      .select()
      .single();

    if (createError || !partner) {
      console.error('Error creating partner:', createError);
      return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email: partner.email,
      business_type: 'individual',
      metadata: {
        partner_id: partner.id,
      },
      capabilities: {
        card_payments: { requested: false },
        transfers: { requested: true },
      },
    });

    const accountId = account.id;

    const { error: updateError } = await supabase
      .from('partners')
      .update({ stripe_connect_account_id: accountId })
      .eq('id', partner.id);

    if (updateError) {
      console.error('Error updating partner with Stripe account ID:', updateError);
      // Even if this fails, we can still proceed with onboarding and handle it later
    }

    const returnUrl = new URL('/partnerprogram/success', req.nextUrl.origin).toString();
    const refreshUrl = new URL('/partnerprogram', req.nextUrl.origin).toString();

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: 'account_onboarding',
    });

    return NextResponse.json({ onboardingUrl: accountLink.url });

  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
