import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ratelimit } from '@/lib/ratelimit';
import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // 1. Redis Rate Limiter (Fail-Safe)
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        console.warn(`Rate limit exceeded for IP: ${ip}`);
        // Continuing anyway as per fail-safe logic requirements
      }
    }
  } catch (rlErr) {
    console.warn('Redis rate-limiter failed or missing config:', rlErr);
  }

  // 2. Parse Body (FormData or JSON)
  let body: any;
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      body = await request.json();
    }
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // 3. Turnstile Token Check (Fail-Safe)
  const turnstileToken = body.turnstileToken;
  if (turnstileToken) {
    try {
      const secretKey = process.env.TURNSTILE_SECRET_KEY;
      if (secretKey) {
        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(
              turnstileToken
            )}`,
          }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          console.warn('Turnstile verification failed:', verifyData['error-codes']);
        }
      } else {
        console.warn('TURNSTILE_SECRET_KEY is not defined');
      }
    } catch (tsErr) {
      console.warn('Turnstile check failed:', tsErr);
    }
  } else {
    console.warn('Turnstile token missing in request');
  }

  // 4. Save to Database (Supabase)
  try {
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([
        {
          company_name: body.companyName,
          company_phone: body.companyPhone,
          company_email: body.companyEmail,
          company_address: body.companyAddress,
          industry: body.industry,
          owner_name: body.ownerName,
          owner_phone: body.ownerPhone,
          owner_email: body.ownerEmail,
          domain: body.domain,
          description: body.description,
          advantage: body.advantage,
          price_list: body.priceList,
          working_hours: body.workingHours,
          primary_color: body.primaryColor,
          secondary_color: body.secondaryColor,
          language: body.language,
          facebook_url: body.facebookUrl,
          instagram_url: body.instagramUrl,
          google_maps_url: body.googleMapsUrl,
          status: 'čeká',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('SUPABASE DB ERROR:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Supabase error: ${dbError.message}`,
          code: dbError.code,
          details: dbError.details 
        },
        { status: 500 }
      );
    }

    // 5. Send Confirmation Email (Fail-Safe)
    try {
      // DŮLEŽITÉ: from pole striktně ASCII bez diakritiky
      const FROM_EMAIL = 'Webs Baca <info@websbaca.cz>';
      const companyName = body.companyName || 'Customer';
      const domain = body.domain || 'your new website';
      const orderId = order?.id || 'N/A';

      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.companyEmail,
        subject: `Order received — ${domain} 🎉`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #111;">
            <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Order received! 🎉</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Thank you, <strong>${companyName}</strong>! We have received your order and we'll get to work immediately.
            </p>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Your website will soon be available at the domain <strong>${domain}</strong>. Once it's ready, you'll receive an email with a preview link.
            </p>
            <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="color: #166534; font-size: 14px; margin: 0 0 4px 0;">Your domain</p>
              <p style="color: #15803d; font-size: 22px; font-weight: 700; margin: 0;">${domain}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
            <p style="color: #aaa; font-size: 12px;">
              Order ID: ${orderId} · <a href="https://webs.baca.cz" style="color: #aaa;">webs.baca.cz</a>
            </p>
          </div>
        `,
      });
      console.info(`Confirmation email sent for order: ${orderId}`);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    // 6. Trigger AI Site Generation via Claude API
    try {
      console.log("🚀 STARTING CLAUDE GENERATION FOR:", body.companyEmail);
      
      // We trigger the generation asynchronously to not block the response
      // but we still want to log the start. In a production environment with Vercel, 
      // you might want to use a background job or Vercel's waitUntil.
      fetch(`${SITE_URL}/api/generate-site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: order.id }),
      }).then(async (res) => {
        if (res.ok) {
          console.log("✅ CLAUDE GENERATION SUCCESS");
        } else {
          const errorText = await res.text();
          console.error("❌ CLAUDE GENERATION FAILED:", errorText);
        }
      }).catch((claudeError) => {
        console.error("❌ CLAUDE GENERATION FAILED:", claudeError);
      });

    } catch (claudeError) {
      console.error("❌ CLAUDE GENERATION FAILED:", claudeError);
    }

    // 7. Final Response (No custom headers with user text)
    return NextResponse.json(
      { success: true, message: 'Order created' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Unexpected error in /api/orders:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}
