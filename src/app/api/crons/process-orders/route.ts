import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
import { sendAdminDomainPurchaseEmail, sendOrderConfirmationEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { Database } from '@/types/supabase';

async function processOrder(order: Database['public']['Tables']['orders']['Row']) {
  try {
    console.log(`Processing order ${order.id}`);

    // 1. Send emails
    try {
      await Promise.all([
        sendAdminDomainPurchaseEmail(order.id, order.company_name, order.domain, order.company_email),
        order.company_email
          ? sendOrderConfirmationEmail(order.company_email, order.company_name, order.domain, order.id)
          : Promise.resolve(),
      ]);
      console.log(`Emails sent for order ${order.id}`);
    } catch (error) {
      console.error(`Failed to send emails for order ${order.id}:`, error);
      await supabaseAdmin.from('orders').update({ status: 'failed_email' }).eq('id', order.id);
      return;
    }

    // 2. Create commission
    if (order.ref_code) {
      const { data: partner, error: partnerError } = await supabaseAdmin
        .from('partners')
        .select('id, commission_pct')
        .eq('referral_code', order.ref_code)
        .single();

      if (partnerError || !partner) {
        console.warn(`Partner with ref_code "${order.ref_code}" not found for order ${order.id}`);
      } else {
        const orderAmount = order.price! / 100;
        const commissionAmount = orderAmount * partner.commission_pct;

        const { error: commissionError } = await supabaseAdmin
          .from('commissions')
          .insert({
            influencer_id: partner.id,
            order_id: order.id,
            order_amount: orderAmount,
            commission_pct: partner.commission_pct,
            commission_amount: commissionAmount,
            status: 'pending'
          });

        if (commissionError) {
          console.error(`Failed to create commission for order ${order.id}:`, commissionError);
          await supabaseAdmin.from('orders').update({ status: 'failed_email' }).eq('id', order.id);
          return;
        } else {
          console.log(`Created pending commission for order ${order.id}`);
        }
      }
    }

    // 3. Mark order as processed
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order.id);

    if (updateError) {
      console.error(`Failed to update order status for order ${order.id}:`, updateError);
      await supabaseAdmin.from('orders').update({ status: 'failed_email' }).eq('id', order.id);
      return;
    }

    console.log(`Finished processing order ${order.id}`);
  } catch (error) {
    console.error(`An unexpected error occurred while processing order ${order.id}:`, error);
    await supabaseAdmin.from('orders').update({ status: 'failed_email' }).eq('id', order.id);
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('status', 'draft')
    .limit(3); // Concurrency limit

  if (error) {
    console.error('Failed to fetch queued orders:', error);
    return NextResponse.json({ error: 'Failed to fetch queued orders' }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ message: 'No queued orders to process' });
  }

  // Process orders sequentially
  for (const order of orders) {
    await processOrder(order);
  }

  return NextResponse.json({ message: `Processed ${orders.length} orders` });
}
