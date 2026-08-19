import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPreviewEmail } from '@/lib/emails';

export const runtime = 'nodejs';

const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// NUCLEAR FIX: Ensure NO non-ASCII characters in headers or logs
const forceAscii = (str: string) => {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '');
};

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; ctaText: string };
  about: { title: string; text: string };
  services: Array<{ title: string; description: string }>;
  contact: { address: string; phone: string; hours: string };
  theme: { primaryColor: string; secondaryColor: string };
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 });
    }

    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    const fetchHeaders = new Headers();
    fetchHeaders.set('apikey', forceAscii(supabaseKey));
    fetchHeaders.set('Authorization', `Bearer ${forceAscii(supabaseKey)}`);
    fetchHeaders.set('Accept', 'application/json');

    const fetchResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}&select=*`, {
      method: 'GET',
      headers: fetchHeaders
    });

    if (!fetchResponse.ok) {
      return NextResponse.json({ error: 'Order not found or fetch failed' }, { status: 404 });
    }

    const orders = await fetchResponse.json();
    const order = orders[0];

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const formData = order;
    const userPrompt = `Generate a complete website content JSON for the following business:

Company Name: ${(formData.company_name || '').normalize('NFC')}
Industry: ${(formData.industry || '').normalize('NFC')}
Description: ${(formData.description || '').normalize('NFC')}
Advantages / Unique Selling Points: ${(formData.advantage || '').normalize('NFC')}
Services / Price List: ${(formData.price_list || '').normalize('NFC')}
Working Hours: ${(formData.working_hours || '').normalize('NFC')}
Email: ${(formData.company_email || '').normalize('NFC')}
Phone: ${(formData.company_phone || '').normalize('NFC')}
Address: ${(formData.company_address || '').normalize('NFC')}
Country: ${(formData.company_country || '').normalize('NFC')}
Preferred Primary Color: ${(formData.primary_color || '').normalize('NFC')}
Preferred Secondary Color: ${(formData.secondary_color || '').normalize('NFC')}
Language: ${(formData.language || 'cs').normalize('NFC')}

Generate the JSON with these exact keys:
{
  "hero": { "title": "...", "subtitle": "...", "ctaText": "..." },
  "about": { "title": "...", "text": "..." },
  "services": [ { "title": "...", "description": "..." } ],
  "contact": { "address": "...", "phone": "...", "hours": "..." },
  "theme": { "primaryColor": "#...", "secondaryColor": "#..." }
}

Write all text content in the language specified (${formData.language || 'cs'}). Make it professional and compelling.`;

    let anthropicResponse;
    try {
      const cleanHeaders = new Headers();
      cleanHeaders.set('content-type', 'application/json');
      cleanHeaders.set('x-api-key', forceAscii(ANTHROPIC_API_KEY));
      cleanHeaders.set('anthropic-version', '2023-06-01');

      anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: cleanHeaders,
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 4096,
          system: 'Respond strictly with raw JSON. Do NOT use emoji. Use only ASCII characters (no diacritics).',
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });
    } catch (claudeErr: any) {
      return NextResponse.json(
        { error: 'Claude API call failed', details: forceAscii(claudeErr?.message) },
        { status: 502 }
      );
    }

    if (!anthropicResponse.ok) {
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicResponse.status}` },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData?.content?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: 'No content returned from Claude' }, { status: 502 });
    }

    let generatedJson: GeneratedSiteJson;
    try {
      const cleanedJsonText = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      generatedJson = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Claude returned invalid JSON' },
        { status: 502 }
      );
    }

    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${order_id}`;
    
    const updateHeaders = new Headers();
    updateHeaders.set('apikey', forceAscii(supabaseKey));
    updateHeaders.set('Authorization', `Bearer ${forceAscii(supabaseKey)}`);
    updateHeaders.set('Content-Type', 'application/json');
    updateHeaders.set('Prefer', 'return=representation');

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}`, {
      method: 'PATCH',
      headers: updateHeaders,
      body: JSON.stringify({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
      })
    });

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    const updatedOrders = await updateResponse.json();
    const updatedOrder = updatedOrders[0];

    if (order.company_email) {
      sendPreviewEmail(order.company_email, previewUrl, order_id).catch(() => {});
    }

    return NextResponse.json(
      { success: true, order: updatedOrder, generated_site_json: generatedJson },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
