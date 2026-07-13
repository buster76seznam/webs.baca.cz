import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
import { Resend } from 'resend';

export const runtime = 'nodejs';

async function sendInternalOrderEmail(orderData: {
  companyName: string;
  email: string;
  industry: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY_2;
  
  if (!resendApiKey) {
    console.log('RESEND_API_KEY_2 not configured, skipping email notification');
    return;
  }

  const resend = new Resend(resendApiKey);

  // Get US date and time
  const now = new Date();
  const usDate = now.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' });
  const usTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true });

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; padding: 20px;">
      <div style="max-width: 400px; margin: 0 auto; background: #111; border-radius: 12px; padding: 24px; border: 1px solid #222;">
        <div style="background: linear-gradient(135deg, #10B981, #059669); border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 14px; opacity: 0.9;">Nová objednávka</div>
          <div style="font-size: 20px; font-weight: bold; margin-top: 4px;">${orderData.companyName}</div>
        </div>
        
        <div style="color: #888; font-size: 12px; margin-bottom: 4px;">EMAIL</div>
        <div style="color: #fff; font-size: 14px; margin-bottom: 16px;">${orderData.email}</div>
        
        <div style="color: #888; font-size: 12px; margin-bottom: 4px;">OBOR</div>
        <div style="color: #fff; font-size: 14px; margin-bottom: 16px;">${orderData.industry}</div>
        
        <div style="background: #1a1a1a; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">USA (ET)</div>
          <div style="color: #10B981; font-size: 18px; font-weight: bold; margin-top: 4px;">${usTime}</div>
          <div style="color: #888; font-size: 13px; margin-top: 4px;">${usDate}</div>
        </div>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Webs Bača <noreply@webs.baca.cz>',
      to: ['webs.baca.support@gmail.com'],
      subject: `Nová objednávka: ${orderData.companyName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Email send error:', error);
    } else {
      console.log('Internal order email sent:', data?.id);
    }
  } catch (err) {
    console.error('Email sending failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      salesUserId,
      companyName,
      email,
      phone,
      address,
      industry,
      hasPhotos,
      services,
      websiteUrl,
      pricingType,
    } = body;

    if (!companyName || !email || !phone || !address || !industry || 
        hasPhotos === undefined || !services || !websiteUrl || !pricingType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        sales_user_id: salesUserId,
        company_name: companyName,
        phone: phone,
        email: email,
        address: address,
        industry: industry,
        has_photos: hasPhotos,
        services: services,
        website_url: websiteUrl,
        pricing_type: pricingType,
        status: 'Čeká ve frontě',
        status_updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Internal order created:', data);

    await sendInternalOrderEmail({
      companyName,
      email,
      industry,
    });

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
