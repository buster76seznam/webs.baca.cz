import { ratelimit } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';
    
    // Použití ratelimit pokud existuje
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    } catch (e) {
      console.warn('Ratelimit error or not configured:', e);
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

    // Částka: buď z objednávky nebo fixních 150 USD
    const priceAmount = order.price ? Math.round(order.price * 100) : 15000;

    // Vytvoření Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: order.company_email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Webs.baca.cz – ${order.company_name}`,
              description: `Website subscription for ${order.company_name}`,
            },
            unit_amount: priceAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      metadata,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/preview/${orderId}`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
