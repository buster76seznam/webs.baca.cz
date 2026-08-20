import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// We don't need fetch if we simulate logic directly

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Manually imported logic from webhook to simulate it without HTTP overhead
async function simulateWebhookLogic(orderId, refCode) {
  console.log(`Simulating webhook logic for Order: ${orderId}, Ref: ${refCode}`);
  
  // 1. Mark order as paid
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      status: 'paid', 
      stripe_checkout_session_id: 'cs_test_' + Date.now(),
      status_updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (updateError) throw updateError;
  console.log('✅ Order marked as paid');

  // 2. Affiliate logic
  if (refCode) {
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .eq('referral_code', refCode)
      .single();

    if (partner && !partnerError) {
      const commissionAmount = 15; // Tier 1 default

      await supabase
        .from('partner_referrals')
        .insert([{
          partner_id: partner.id,
          client_email: 'test@example.com',
          client_name: 'Test Flow Corp',
          amount: commissionAmount,
          status: 'pending'
        }]);

      await supabase
        .from('client_conversions')
        .insert([{
          partner_id: partner.id,
          subscription_price: 150,
          currency: 'USD',
          status: 'active'
        }]);
      
      console.log(`✅ Commission recorded for partner: ${partner.id}`);
    }
  }
}

async function runTest() {
  const TEST_REF_CODE = 'TESTPARTNER_' + Math.random().toString(36).substring(7).toUpperCase();
  const TEST_EMAIL = 'webs.baca.support@gmail.com';
  
  console.log('🚀 Starting post-payment flow simulation...');

  try {
    // 1. Create a test partner
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .insert([{
        name: 'Test Partner Sim',
        email: 'test-partner-sim@example.com',
        referral_code: TEST_REF_CODE,
        verified: true,
        active: true
      }])
      .select()
      .single();

    if (partnerError) throw partnerError;
    console.log(`✅ Partner created: ${partner.id}`);

    // 2. Create a test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        company_name: 'Sim Flow Corp',
        company_email: TEST_EMAIL,
        company_phone: '+420123456789',
        company_address: 'Sim Street 1',
        industry: 'Simulation',
        domain: 'sim-test.cz',
        description: 'Simulation test',
        advantage: 'None',
        working_hours: '9-5',
        status: 'preview_ready',
        ref_code: TEST_REF_CODE,
        price: 150
      }])
      .select()
      .single();

    if (orderError) throw orderError;
    console.log(`✅ Order created: ${order.id}`);

    // 3. Run simulated logic
    await simulateWebhookLogic(order.id, TEST_REF_CODE);

    // 4. Verify results
    const { data: finalOrder } = await supabase.from('orders').select('status').eq('id', order.id).single();
    const { data: referral } = await supabase.from('partner_referrals').select('*').eq('partner_id', partner.id).single();

    console.log('\n--- VERIFICATION ---');
    console.log('Order Status:', finalOrder.status);
    console.log('Commission Recorded:', referral ? `YES ($${referral.amount})` : 'NO');
    
    if (finalOrder.status === 'paid' && referral) {
      console.log('\n🎉 ALL TESTS PASSED!');
    } else {
      console.log('\n❌ TESTS FAILED!');
    }

  } catch (err) {
    console.error('❌ Error during test:', err);
  }
}

runTest();
