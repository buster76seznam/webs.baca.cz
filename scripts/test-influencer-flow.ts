
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Initialize Supabase and Stripe
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const TEST_INFLUENCER = {
    name: "Test Influencer Alex",
    email: "test.influencer." + Math.random().toString(36).substring(7) + "@example.com",
    referral_code: "TESTALEX" + Math.random().toString(36).substring(7).toUpperCase(),
    commission_pct: 0.20,
    stripe_connect_account_id: "acct_1PGHqRRxS12gM42N", // Replace with a valid test account ID
    status: "active",
};

const TEST_ORDER = {
    amount: 150,
    currency: "usd",
    client_email: "test.client." + Math.random().toString(36).substring(7) + "@example.com",
    company_name: "Test Company",
    company_phone: "123456789",
    company_address: "123 Test St",
    industry: "Test Industry",
    domain: "test.com",
    description: "Test Description",
    advantage: "Test Advantage",
    working_hours: "9-5"
};

const log = (status: string, message: string, data?: any) => {
    console.log(`[${status}] ${message}`);
    if (data) {
        console.log(JSON.stringify(data, null, 2));
    }
};

async function runTest() {
    let testInfluencerId: string | undefined;
    let testOrderId: string | undefined;
    let testCommissionId: string | undefined;

    try {
        console.log('--- STARTING INFLUENCER TEST FLOW ---');
        
        // Phase 0: Cleanup existing test data to ensure a clean run
        log('INFO', 'Cleaning up previous test data...');
        await supabase.from('partners').delete().like('email', 'test.influencer.%');

        // Phase 1: Create test influencer
        const { data: influencer, error: influencerError } = await supabase
            .from('partners')
            .insert(TEST_INFLUENCER)
            .select()
            .single();

        if (influencerError || !influencer) {
            throw new Error(`Failed to create influencer: ${influencerError?.message}`);
        }
        testInfluencerId = influencer.id;
        log('PASS', '1. Influencer created', { id: testInfluencerId, name: TEST_INFLUENCER.name, referral_code: TEST_INFLUENCER.referral_code });

        // Phase 2: Create test order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                status: 'preview_ready',
                company_email: TEST_ORDER.client_email,
                referral_code: TEST_INFLUENCER.referral_code, // Use the created influencer's code
                price: TEST_ORDER.amount, 
                company_name: TEST_ORDER.company_name,
                company_phone: TEST_ORDER.company_phone,
                company_address: TEST_ORDER.company_address,
                industry: TEST_ORDER.industry,
                domain: TEST_ORDER.domain,
                description: TEST_ORDER.description,
                advantage: TEST_ORDER.advantage,
                working_hours: TEST_ORDER.working_hours,
                company_country: 'CZ'
            })
            .select()
            .single();

        if (orderError || !order) {
            throw new Error(`Failed to create order: ${orderError?.message}`);
        }
        testOrderId = order.id;
        log('PASS', '2. Order created & referral tracked', { orderId: testOrderId, referral: order.referral_code });
        
        // Phase 3: Simulate Stripe Webhook for payment completion
        console.log('\n--- Simulating Payment & Webhook ---');
        const webhookPayload = {
            id: `evt_${Date.now()}`,
            object: 'event',
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: `cs_test_${Date.now()}`,
                    object: 'checkout.session',
                    amount_total: TEST_ORDER.amount * 100,
                    currency: TEST_ORDER.currency,
                    metadata: {
                        orderId: testOrderId,
                        ref_code: TEST_INFLUENCER.referral_code
                    },
                    payment_status: "paid"
                }
            }
        };

        const webhookResponse = await fetch('http://localhost:3000/api/webhooks/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': 'dummy-signature-for-testing'
            },
            body: JSON.stringify(webhookPayload)
        });
        
        if (!webhookResponse.ok) {
            const errorBody = await webhookResponse.text();
            throw new Error(`Webhook endpoint returned an error: ${errorBody}`);
        }
        log('PASS', '3a. Webhook processed successfully');

        // Verify database state changes
        log('INFO', 'Verifying webhook effects on database...');
        const { data: updatedOrder, error: updatedOrderError } = await supabase
            .from('orders')
            .select('status')
            .eq('id', testOrderId)
            .single();

        if (updatedOrderError) throw new Error('Failed to re-fetch order after webhook.');

        if (updatedOrder.status !== 'paid') {
            throw new Error(`Order status was not updated to 'paid'. Current status: ${updatedOrder.status}`);
        }
        log('PASS', '3b. Order status successfully updated to "paid"');

        const { data: commission, error: commissionError } = await supabase
            .from('commissions')
            .select('*')
            .eq('order_id', testOrderId)
            .single();

        if (commissionError || !commission) {
            throw new Error(`Failed to find/create commission: ${commissionError ? commissionError.message : 'Not found'}`);
        }
        testCommissionId = commission.id;

        const expectedCommissionAmount = TEST_ORDER.amount * TEST_INFLUENCER.commission_pct;
        const commissionAmountMatch = Math.abs(commission.commission_amount - expectedCommissionAmount) < 0.01;

        if (!commissionAmountMatch || commission.status !== 'pending') {
            throw new Error(`Commission data validation failed. Expected ~${expectedCommissionAmount} (pending), got ${commission.commission_amount} (${commission.status})`);
        }
        log('PASS', `3c. Commission snapshotted correctly ($${commission.commission_amount})`);

        // Phase 4: Simulate Payout Cron Job
        console.log('\n--- Simulating Monthly Payout Cron ---');
        const cronResponse = await fetch('http://localhost:3000/api/crons/payouts', { method: 'GET' });
        
        if (!cronResponse.ok) {
            const errorBody = await cronResponse.text();
            throw new Error(`Payout cron failed with status ${cronResponse.status}: ${errorBody}`);
        }
        
        const cronResult = await cronResponse.json();
        log('INFO', 'Payout cron executed', cronResult);

        const { data: commissionAfterPayout } = await supabase
            .from('commissions')
            .select('*')
            .eq('id', testCommissionId)
            .single();

        if (commissionAfterPayout.status !== 'paid') {
            throw new Error(`Payout Cron did not update status to 'paid'. Status is: ${commissionAfterPayout.status}`);
        }
        log('PASS', `5. Payout Cron successful & Commission Status updated to 'paid'`);

        console.log('\n🎉 ALL SYSTEMS GO! Influencer flow test successful.\n');

    } catch (error) {
        log('FAIL', (error as Error).message, (error as Error).stack);
    } finally {
        // Cleanup
        console.log('\n--- Cleaning up test data ---');
        if (testCommissionId) {
            await supabase.from('commissions').delete().eq('id', testCommissionId);
            log('INFO', `Deleted commission ${testCommissionId}`);
        }
        if (testOrderId) {
            await supabase.from('orders').delete().eq('id', testOrderId);
            log('INFO', `Deleted order ${testOrderId}`);
        }
        if (testInfluencerId) {
            await supabase.from('partners').delete().eq('id', testInfluencerId);
            log('INFO', `Deleted partner ${testInfluencerId}`);
        }
        log('INFO', 'Cleanup complete.');
    }
}

runTest();
