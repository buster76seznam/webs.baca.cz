import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import webpush from 'web-push';
import { supabaseAdmin } from '@/supabase';

export const runtime = 'nodejs';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

// Only set VAPID details if keys are available
if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:webs.baca@gmail.com',
    publicVapidKey,
    privateVapidKey
  );
}

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    // Store subscription in database
    const { data, error } = await supabaseAdmin
      .from('push_subscriptions')
      .insert({
        subscription: subscription,
        user_id: 'admin' // You can make this dynamic based on authentication
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to store subscription' }, { status: 500 });
    }

    console.log('Subscription stored:', data);
    return NextResponse.json({ success: true, subscription: data });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscription = searchParams.get('subscription');
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('subscription', subscription);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
