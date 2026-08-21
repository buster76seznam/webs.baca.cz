import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = 'http://localhost:3000';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runE2ETest() {
  console.log('🚀 Starting Complete E2E Simulation...');
  
  const testCompany = {
    companyName: 'Test Company Inc.',
    companyEmail: 'webs.baca.support@gmail.com',
    companyPhone: '+420777888999',
    companyAddress: 'Testing Avenue 123, Prague',
    industry: 'Software Testing',
    ownerName: 'John Tester',
    ownerPhone: '+420111222333',
    ownerEmail: 'webs.baca.support@gmail.com',
    domain: 'test-company-inc.com',
    description: 'We provide automated E2E testing services.',
    advantage: 'We are the best in the market.',
    priceList: 'Standard: $99, Pro: $199',
    workingHours: 'Mon-Fri: 9am-5pm',
    primaryColor: '#0000FF',
    secondaryColor: '#00FF00',
    language: 'en',
    fingerprint: 'test-fingerprint-' + Math.random().toString(36).substring(7),
    token: 'test-token-' + Math.random().toString(36).substring(7)
  };

  let orderId;

  // 1. Simulate Order Creation
  console.log('\nStep 1: Creating test order...');
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCompany)
    });

    const data = await res.json();
    if (data.success) {
      orderId = data.orderId;
      console.log(`✅ Order created successfully! ID: ${orderId}`);
    } else {
      console.error('❌ Order creation failed:', data.error);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error creating order:', err.message);
    process.exit(1);
  }

  // 2. Test Spam Blocker
  console.log('\nStep 2: Testing Spam Blocker (immediate second request)...');
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCompany) // Same fingerprint/token
    });

    if (res.status === 429) {
      const data = await res.json();
      console.log('✅ Spam blocker caught the request correctly!');
      console.log(`   Status: 429 Too Many Requests`);
      console.log(`   Message: ${data.error}`);
    } else {
      console.error(`❌ Spam blocker FAILED! Expected 429 but got ${res.status}`);
      // We continue anyway but mark as fail
    }
  } catch (err) {
    console.error('❌ Error testing spam blocker:', err.message);
  }

  // Wait a bit for background generation to start
  console.log('\nWaiting for AI generation to initialize (5s)...');
  await new Promise(r => setTimeout(r, 5000));

  // 3. Simulate Revision
  console.log('\nStep 3: Simulating Revision...');
  try {
    const revisionRes = await fetch(`${baseUrl}/api/orders/revision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderId,
        prompt: 'Change header background to dark blue and make primary button emerald green'
      })
    });

    const revData = await revisionRes.json();
    if (revData.success) {
      console.log('✅ Revision successful!');
      console.log(`   New Revision Count: ${revData.revision_count}`);
      
      // Verify in Supabase
      const { data: order } = await supabase
        .from('orders')
        .select('feedback_history, generated_site_json')
        .eq('id', orderId)
        .single();
      
      if (order.feedback_history && order.feedback_history.length > 0) {
        console.log('✅ feedback_history updated in Supabase');
      } else {
        console.error('❌ feedback_history NOT updated in Supabase');
      }
    } else {
      console.error('❌ Revision failed:', revData.error);
    }
  } catch (err) {
    console.error('❌ Error during revision:', err.message);
  }

  // 4. Approve Order (Status pending_domain)
  console.log('\nStep 4: Simulating Order Approval & Payment...');
  try {
    // We simulate the Stripe webhook call directly since we want to reach pending_domain
    const webhookRes = await fetch(`${baseUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'stripe-signature': 't=' + Math.floor(Date.now() / 1000) + ',v1=dummy',
        'x-test-bypass': 'true'
      },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_' + Math.random().toString(36).substring(7),
            metadata: {
              orderId: orderId
            }
          }
        }
      })
    });

    const webData = await webhookRes.json();
    if (webData.received) {
      console.log('✅ Stripe Webhook simulation received');
      
      // Verify final status
      const { data: finalOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
      
      console.log(`✅ Final Order Status: ${finalOrder.status}`);
      if (finalOrder.status === 'pending_domain') {
        console.log('✅ Order successfully reached pending_domain status!');
      } else {
        console.error(`❌ Unexpected status: ${finalOrder.status}`);
      }
    } else {
      console.error('❌ Webhook simulation failed');
    }
  } catch (err) {
    console.error('❌ Error during approval simulation:', err.message);
  }

  console.log('\n--- E2E SIMULATION FINISHED ---');
}

runE2ETest();
