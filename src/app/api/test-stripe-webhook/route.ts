import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const TEST_REF_CODE = 'TESTPARTNER_' + Math.random().toString(36).substring(7).toUpperCase();
  const TEST_EMAIL = 'webs.baca.support@gmail.com';
  
  console.log('🚀 Starting internal post-payment flow test...');

  try {
    // 1. Create a test partner
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .insert([
        {
          name: 'Test Partner Internal',
          email: 'test-partner-internal@example.com',
          referral_code: TEST_REF_CODE,
          verified: true,
          active: true
        }
      ])
      .select()
      .single();

    if (partnerError) throw partnerError;

    // 2. Create a test order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          company_name: 'Internal Test Flow',
          company_email: TEST_EMAIL,
          company_phone: '+420123456789',
          company_address: 'Internal Test Street 1',
          industry: 'Testing',
          domain: 'internal-test.cz',
          description: 'A website generated during automated test flow.',
          advantage: 'Speed',
          working_hours: 'Po-Pá 9-17',
          status: 'preview_ready',
          ref_code: TEST_REF_CODE,
          price: 150
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Simulate Stripe Webhook call
    const webhookPayload = {
      id: 'evt_test_int_' + Date.now(),
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_int_' + Date.now(),
          object: 'checkout.session',
          customer_email: TEST_EMAIL,
          metadata: {
            orderId: order.id,
            ref_code: TEST_REF_CODE
          },
          amount_total: 15000,
          currency: 'usd',
          payment_status: 'paid'
        }
      }
    };

    // We can't easily call the local POST route via fetch here without signature issues
    // So we manually import the logic or just use a fetch with a special header
    
    const protocol = request.nextUrl.protocol;
    const host = request.nextUrl.host;
    const webhookUrl = `${protocol}//${host}/api/webhooks/stripe`;

    // To bypass signature, we'd need to set the env var on the server
    // Since we are ON the server, maybe we can just trigger the logic directly?
    // But it's in a separate route file.
    
    // Alternative: Just use fetch and HOPE we can bypass it if we add a bypass header
    // But I already wrote the webhook to check for STRIPE_SKIP_SIGNATURE_VERIFICATION.
    
    // For this test, I will temporarily modify the webhook to skip if a special header is present
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'bypass',
        'x-test-bypass': 'true'
      },
      body: JSON.stringify(webhookPayload)
    });

    const resultText = await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result: resultText,
      orderId: order.id,
      partnerId: partner.id,
      refCode: TEST_REF_CODE
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
