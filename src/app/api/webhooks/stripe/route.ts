import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/supabase';
import { COMMISSION_STRUCTURE } from '@/lib/affiliate-types';

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
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId, ref_code } = session.metadata ?? {};

    if (!orderId) {
      console.error('Webhook: missing orderId in metadata');
      return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 });
    }

    // Aktualizace stavu objednávky na 'paid'
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      console.error('Webhook: failed to update order status:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`Webhook: order ${orderId} marked as paid`);

    // Pokud byl přítomen ref_code, připsat partnerovi provizi
    if (ref_code) {
      const { data: partner, error: partnerError } = await supabaseAdmin
        .from('partners')
        .select('id, total_earned, active_clients')
        .eq('referral_code', ref_code)
        .single();

      if (partnerError || !partner) {
        console.warn(`Webhook: partner with ref_code "${ref_code}" not found`);
      } else {
        // Zjistit počet aktivních klientů pro výpočet správné provize
        const activeClients: number = (partner.active_clients ?? 0) + 1;
        let commission = COMMISSION_STRUCTURE[1].usd; // výchozí $15
        if (activeClients >= 126) {
          commission = COMMISSION_STRUCTURE[3].usd;
        } else if (activeClients >= 51) {
          commission = COMMISSION_STRUCTURE[2].usd;
        }

        const { error: commissionError } = await supabaseAdmin
          .from('partners')
          .update({
            total_earned: (partner.total_earned ?? 0) + commission,
            active_clients: activeClients,
          })
          .eq('id', partner.id);

        if (commissionError) {
          console.error('Webhook: failed to update partner commission:', commissionError);
        } else {
          console.log(`Webhook: added $${commission} commission to partner ${partner.id}`);
        }
      }
    }

    // TODO: zavolat automatický nákup domény (připravíme v dalším kroku)
    // await purchaseDomain(orderId);
  }

  return NextResponse.json({ received: true });
}
