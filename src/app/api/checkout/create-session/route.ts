import { ratelimit } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Načtení objednávky ze Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, company_name, company_email, company_country, price, ref_code')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://websbaca.cz';

    // Metadata pro webhook
    const metadata: Record<string, string> = { orderId };
    if (order.ref_code) {
      metadata.ref_code = order.ref_code;
    }

    // Vytvoření Stripe Checkout Session pro měsíční předplatné
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: order.company_email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Webs.baca.cz – Monthly Subscription',
              description: `Website subscription for ${order.company_name}`,
            },
            unit_amount: 15000, // $150.00
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      metadata,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preview/${orderId}`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe create-session error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
