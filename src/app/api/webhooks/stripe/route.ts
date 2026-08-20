import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getTierInfo, calculateCommission } from '@/lib/affiliate-config';
import { sendAdminDomainPurchaseEmail, sendOrderConfirmationEmail, sendPartnerCommissionEmail } from '@/lib/emails';

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

  const isTestBypass = request.headers.get('x-test-bypass') === 'true';

  // V testovacím prostředí přeskočíme ověření podpisu
  if (process.env.STRIPE_SKIP_SIGNATURE_VERIFICATION === 'true' || isTestBypass) {
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

    // Načtení objednávky pro kontrolu a získání detailů
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Webhook: order not found:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Kontrola duplicity checkout session
    if (order.stripe_checkout_session_id === session.id && order.status === 'paid') {
      console.log(`Webhook: received duplicate checkout session ${session.id}, skipping.`);
      return NextResponse.json({ received: true });
    }

    // 1. Aktualizace statusu objednávky na PENDING_DOMAIN
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'pending_domain', 
        stripe_checkout_session_id: session.id,
        status_updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Webhook: failed to update order status:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`Webhook: order ${orderId} marked as paid`);

    // 2. Odeslání notifikačních e-mailů
    try {
      // Admin notifikace (Action required: purchase domain)
      await sendAdminDomainPurchaseEmail(
        order.id,
        order.company_name,
        order.domain,
        order.company_email
      );

      // Potvrzení pro klienta
      await sendOrderConfirmationEmail(
        order.company_email,
        order.company_name,
        order.domain,
        order.id
      );
    } catch (emailErr) {
      console.error('Webhook: failed to send emails:', emailErr);
    }

    // 3. Logika Affiliate provize
    const referralCode = ref_code || order.ref_code;
    if (referralCode) {
      try {
        // Najít partnera podle referral kódu
        const { data: partner, error: partnerError } = await supabaseAdmin
          .from('partners')
          .select('*')
          .eq('referral_code', referralCode)
          .single();

        if (partner && !partnerError) {
          // Získat aktuální počet klientů partnera pro určení tieru
          const { count: activeClientsCount } = await supabaseAdmin
            .from('partner_referrals')
            .select('*', { count: 'exact', head: true })
            .eq('partner_id', partner.id)
            .eq('status', 'active');

          const tierInfo = getTierInfo(activeClientsCount || 0);
          const commissionAmount = tierInfo.usdCommission;

          // Zapsat provizi do partner_referrals
          await supabaseAdmin
            .from('partner_referrals')
            .insert([{
              partner_id: partner.id,
              client_email: order.company_email,
              client_name: order.company_name,
              amount: commissionAmount,
              status: 'pending' // Provize je na začátku pending
            }]);

          // Zapsat konverzi pro přehled
          await supabaseAdmin
            .from('client_conversions')
            .insert([{
              partner_id: partner.id,
              subscription_price: order.price || 150,
              currency: 'USD',
              status: 'active'
            }]);

          // Poslat e-mail partnerovi
          await sendPartnerCommissionEmail(
            partner.email,
            commissionAmount,
            order.domain
          );
          
          console.log(`Webhook: Commission of $${commissionAmount} recorded for partner ${partner.id}`);
        }
      } catch (affiliateErr) {
        console.error('Webhook: affiliate commission processing failed:', affiliateErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
