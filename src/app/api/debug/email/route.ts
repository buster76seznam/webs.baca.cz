import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function GET() {
  const resendApiKey = process.env.RESEND_API_KEY_2;
  
  return NextResponse.json({
    envPresent: !!resendApiKey,
    envKey: resendApiKey ? resendApiKey.substring(0, 10) + '...' : null,
  });
}

export async function POST() {
  const resendApiKey = process.env.RESEND_API_KEY_2;
  
  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY_2 not set' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);
  
  try {
    const result = await resend.emails.send({
      from: 'Webs Bača <noreply@webs.baca.cz>',
      to: ['webs.baca.support@gmail.com'],
      subject: 'Test email from debug',
      html: '<h1>Test</h1><p>This is a test email.</p>',
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || error }, { status: 500 });
  }
}
