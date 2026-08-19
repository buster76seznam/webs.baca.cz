import { NextResponse, after } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site';
import Anthropic from '@anthropic-ai/sdk';
import { sendPreviewEmail } from '@/lib/emails';

export const maxDuration = 60;

// NUCLEAR FIX: Ensure NO non-ASCII characters in headers or logs
const forceAscii = (str: string) => {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '');
};

const resend = new Resend(process.env.RESEND_API_KEY);

const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY is missing!");
}

const anthropic = new Anthropic({
  apiKey: apiKey,
  fetch: async (url, init) => {
    const headers = new Headers();
    headers.set('x-api-key', forceAscii(apiKey));
    headers.set('anthropic-version', '2023-06-01');
    headers.set('content-type', 'application/json');

    const targetUrl = typeof url === 'string' ? url : (url as any).url;

    return fetch(targetUrl, {
      method: init?.method || 'POST',
      headers: headers,
      body: init?.body,
      signal: init?.signal,
    });
  }
});

async function generateWebWithClaude(orderId: string, email: string, domain: string, formData: any) {
  console.log("STARTING CLAUDE GENERATION FOR:", forceAscii(email));

  try {
    const sanitize = (str: string) => {
      if (!str) return '';
      return str.replace(/[^\x00-\x7F]/g, (char) => {
        const map: Record<string, string> = {
          'š': 's', 'č': 'c', 'ř': 'r', 'ž': 'z', 'ý': 'y', 'á': 'a',
          'í': 'i', 'é': 'e', 'ú': 'u', 'ů': 'u', 'ď': 'd', 'ť': 't',
          'ň': 'n', 'Š': 'S', 'Č': 'C', 'Ř': 'R', 'Ž': 'Z', 'Ý': 'Y',
          'Á': 'A', 'Í': 'I', 'É': 'E', 'Ú': 'U', 'Ů': 'U', 'Ď': 'D',
          'Ť': 'T', 'Ň': 'N'
        };
        return map[char] || '';
      });
    };

    const userPrompt = `Generate a complete website content JSON for the following business:

Company Name: ${sanitize(formData.companyName || '')}
Industry: ${sanitize(formData.industry || '')}
Description: ${sanitize(formData.description || '')}
Advantages / Unique Selling Points: ${sanitize(formData.advantage || '')}
Services / Price List: ${sanitize(formData.priceList || '')}
Working Hours: ${sanitize(formData.workingHours || '')}
Email: ${sanitize(formData.companyEmail || '')}
Phone: ${sanitize(formData.companyPhone || '')}
Address: ${sanitize(formData.companyAddress || '')}
Country: ${sanitize(formData.companyCountry || '')}
Preferred Primary Color: ${sanitize(formData.primaryColor || '')}
Preferred Secondary Color: ${sanitize(formData.secondaryColor || '')}
Language: ${sanitize(formData.language || 'cs')}

Generate the JSON with these exact keys:
{
  "hero": { "title": "...", "subtitle": "...", "ctaText": "..." },
  "about": { "title": "...", "text": "..." },
  "services": [ { "title": "...", "description": "..." } ],
  "contact": { "address": "...", "phone": "...", "hours": "..." },
  "theme": { "primaryColor": "#...", "secondaryColor": "#..." }
}

Write all text content in the language specified (${sanitize(formData.language || 'cs')}). Use only ASCII characters (no diacritics).`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      system: 'Respond strictly with raw JSON. Do NOT use emoji. Use only ASCII characters (no diacritics).',
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const rawContent = response.content[0].type === 'text' ? response.content[0].text : '';

    if (!rawContent) {
      console.error('No content in Anthropic response');
      return;
    }

    let generatedJson;
    try {
      const cleanedJsonText = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      generatedJson = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON response');
      return;
    }

    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || SITE_URL}/preview/${orderId}`;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
    
    const updateHeaders = new Headers();
    updateHeaders.set('apikey', forceAscii(supabaseKey));
    updateHeaders.set('Authorization', `Bearer ${forceAscii(supabaseKey)}`);
    updateHeaders.set('Content-Type', 'application/json');
    updateHeaders.set('Prefer', 'return=minimal');

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: updateHeaders,
      body: JSON.stringify({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
      })
    });

    if (!updateResponse.ok) {
      console.error('Error updating order with direct fetch');
      return;
    }

    if (email) {
      await sendPreviewEmail(email, previewUrl, orderId);
    }
  } catch (err: any) {
    console.error("ANTHROPIC CRASH ERROR");
    console.error("ERROR MESSAGE:", forceAscii(err?.message));
  }
}

export async function POST(request: Request) {
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
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const turnstileToken = body.turnstileToken;
  if (turnstileToken) {
    try {
      const secretKey = process.env.TURNSTILE_SECRET_KEY;
      if (secretKey) {
        await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(
              turnstileToken
            )}`,
          }
        );
      }
    } catch (tsErr) {
      // Fail-safe
    }
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    const insertHeaders = new Headers();
    insertHeaders.set('apikey', forceAscii(supabaseKey));
    insertHeaders.set('Authorization', `Bearer ${forceAscii(supabaseKey)}`);
    insertHeaders.set('Content-Type', 'application/json');
    insertHeaders.set('Prefer', 'return=representation');

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: insertHeaders,
      body: JSON.stringify({
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
        status: 'draft',
      })
    });

    if (!insertResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    const insertedOrders = await insertResponse.json();
    const order = insertedOrders[0];

    if (!order) {
      throw new Error('Failed to create order');
    }

    try {
      const FROM_EMAIL = 'Webs Baca <info@websbaca.cz>';
      const companyName = forceAscii(body.companyName || 'Customer');
      const domain = forceAscii(body.domain || 'your new website');
      const orderId = order?.id || 'N/A';

      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.companyEmail,
        subject: `Order received - ${domain}`,
        html: `Order received for ${companyName}. Domain: ${domain}. Order ID: ${orderId}`,
      });
    } catch (emailErr) {
      // Fail-safe
    }

    after(async () => {
      try {
        await generateWebWithClaude(
          order.id, 
          body.companyEmail, 
          body.domain, 
          body
        );
      } catch (err) {
        // Fail-safe
      }
    });

    return NextResponse.json(
      { success: true, message: 'Order created' },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
