import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const PASSWORD = 'Filip_23.2010';

async function testInfra() {
  console.log('🚀 Starting Domain Infrastructure Test');

  // 1. Test unauthorized access
  console.log('\nTesting unauthorized access to action API...');
  const resAuth = await fetch(`${BASE_URL}/api/domains/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrong' })
  });
  if (resAuth.status === 401) {
    console.log('✅ Correct: 401 Unauthorized for wrong password');
  } else {
    console.log('❌ Error: Expected 401, got', resAuth.status);
  }

  // 2. Test fetching orders (indirectly via Supabase logic if we had a token, but let's test the action endpoint)
  // We need a dummy order for this. I'll use a test order ID if possible, or just check if the endpoint responds correctly to a non-existent order.
  console.log('\nTesting action API with correct password but non-existent order...');
  const resAction = await fetch(`${BASE_URL}/api/domains/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      password: PASSWORD,
      orderId: '00000000-0000-0000-0000-000000000000',
      action: 'bought'
    })
  });
  if (resAction.status === 404) {
    console.log('✅ Correct: 404 for non-existent order');
  } else {
    console.log('❌ Error: Expected 404, got', resAction.status);
  }

  // 3. Test domain change API
  console.log('\nTesting domain change API...');
  const resChange = await fetch(`${BASE_URL}/api/domains/change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      orderId: '00000000-0000-0000-0000-000000000000',
      newDomain: 'test-domain.com'
    })
  });
  // Since it checks for existence, it should fail with 500 or 404 depending on how I handled it.
  // In my implementation: if (!order) throw new Error('Order not found'); -> 500
  if (resChange.status === 500) {
    console.log('✅ Correct: 500 (Order not found) for domain change');
  } else {
    console.log('❌ Error: Expected 500, got', resChange.status);
  }

  console.log('\nInfrastructure test completed. To test full flow, manual check of /domains is recommended.');
}

testInfra().catch(console.error);
