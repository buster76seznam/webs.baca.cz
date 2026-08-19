import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/supabase';
import { COMMISSION_STRUCTURE } from '@/lib/affiliate-types';
import { sendAdminDomainPurchaseEmail, sendOrderConfirmationEmail } from '@/lib/emails';

export const runtime = 'nodejs';

// Vypnout automatický body parser – Stripe vyžaduje raw body pro ověření podpisu
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  // V testovacím prostředí přeskočíme ověření podpisu
  if (process.env.STRIPE_SKIP_SIGNATURE_VERIFICATION === 'true') {
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      console.error('Webhook JSON parsing failed:', err);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId, ref_code } = session.metadata ?? {};

    if (!orderId) {
      console.error('Webhook: missing orderId in metadata');
      return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 });
    }

    const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_checkout_session_id', session.id)
      .single();

    if (existingOrder) {
      console.log(`Webhook: received duplicate checkout session ${session.id}, skipping.`);
      return NextResponse.json({ received: true });
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'draft', stripe_checkout_session_id: session.id })
      .eq('id', orderId);

    if (updateError) {
      console.error('Webhook: failed to update order status:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`Webhook: order ${orderId} marked as paid`);
  }

  return NextResponse.json({ received: true });
}
