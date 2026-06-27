import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import webpush from 'web-push';

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
    const { subscription, data } = await request.json();
    
    const payload = JSON.stringify({
      title: data.title || 'Nová objednávka',
      body: data.body || 'Přišla nová objednávka na Webs Bača',
      icon: '/Logo.png',
      badge: '/Logo.png',
      data: {
        url: '/program'
      }
    });
    
    await webpush.sendNotification(subscription, payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ error: 'Push notification failed' }, { status: 500 });
  }
}
