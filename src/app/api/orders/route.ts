import { NextResponse, after } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/supabase';
import { ratelimit } from '@/lib/ratelimit';
import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site';
import Anthropic from '@anthropic-ai/sdk';
import { sendPreviewEmail } from '@/lib/emails';

export const maxDuration = 60;

const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateWebWithClaude(orderId: string, email: string, domain: string, formData: any) {
  console.log("🚀 STARTING CLAUDE GENERATION FOR:", email);
  console.log("SENDING REQUEST TO ANTHROPIC...");

  try {
    const userPrompt = `Generate a complete website content JSON for the following business:

Company Name: ${formData.companyName || ''}
Industry: ${formData.industry || ''}
Description: ${formData.description || ''}
Advantages / Unique Selling Points: ${formData.advantage || ''}
Services / Price List: ${formData.priceList || ''}
Working Hours: ${formData.workingHours || ''}
Email: ${formData.companyEmail || ''}
Phone: ${formData.companyPhone || ''}
Address: ${formData.companyAddress || ''}
Country: ${formData.companyCountry || ''}
Preferred Primary Color: ${formData.primaryColor || ''}
Preferred Secondary Color: ${formData.secondaryColor || ''}
Language: ${formData.language || 'cs'}

Generate the JSON with these exact keys:
{
  "hero": { "title": "...", "subtitle": "...", "ctaText": "..." },
  "about": { "title": "...", "text": "..." },
  "services": [ { "title": "...", "description": "..." } ],
  "contact": { "address": "...", "phone": "...", "hours": "..." },
  "theme": { "primaryColor": "#...", "secondaryColor": "#..." }
}

Write all text content in the language specified (${formData.language || 'cs'}). Make it professional and compelling.`;

    console.log("🤖 CLAUDE MODEL SENT:", "claude-sonnet-4-5-20250929");
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      system: 'Respond strictly with raw JSON. Do NOT wrap the JSON in markdown code blocks like ```json.',
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    console.log("✅ ANTHROPIC RESPONSE RECEIVED SUCCESSFULLY!");

    const rawContent = response.content[0].type === 'text' ? response.content[0].text : '';

    if (!rawContent) {
      console.error('No content in Anthropic response');
      return;
    }

    // Parse JSON
    let generatedJson;
    try {
      const cleanedJsonText = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      generatedJson = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON response:', rawContent);
      return;
    }

    // Save to Supabase
    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || SITE_URL}/preview/${orderId}`;
    
    // Ujistíme se, že posíláme čistá data v body, bez extra headers
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with AI content:', updateError);
      return;
    }

    console.log('Site generated successfully for order:', orderId);

    // Send preview email
    if (email) {
      await sendPreviewEmail(email, previewUrl, orderId);
      console.log('Preview email sent to:', email);
    }
  } catch (err: any) {
    console.error("❌ ANTHROPIC CRASH ERROR:", err);
    console.error("❌ ERROR MESSAGE:", err?.message);
    console.error("❌ ERROR STATUS:", err?.status);
  }
}

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
          status: 'pending',
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
    // Using after() for background processing (Next.js 15 feature)
    after(async () => {
      try {
        await generateWebWithClaude(
          order.id, 
          body.companyEmail, 
          body.domain, 
          body
        );
      } catch (err) {
        console.error("Error in background generation:", err);
      }
    });

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
