import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin as defaultSupabaseAdmin } from '@/supabase';
import { sendPreviewEmail } from '@/lib/emails';

export const runtime = 'nodejs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 });
    }

    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    // Fetch order from Supabase using direct fetch to avoid SDK header inheritance issues
    const fetchResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Accept': 'application/json'
      }
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('Error fetching order with direct fetch:', errorText);
      return NextResponse.json({ error: 'Order not found or fetch failed' }, { status: 404 });
    }

    const orders = await fetchResponse.json();
    const order = orders[0];

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build prompt from form_data
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

    // Call Anthropic Claude API
    console.log("Key check:", process.env.ANTHROPIC_API_KEY ? "EXISTS (starts with " + process.env.ANTHROPIC_API_KEY.slice(0, 7) + ")" : "MISSING!");

    console.log("🤖 CLAUDE MODEL SENT:", "claude-sonnet-4-5-20250929");
    let anthropicResponse;
    try {
      anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 4096,
          system: 'Respond strictly with raw JSON. Do NOT wrap the JSON in markdown code blocks like ```json. CRITICAL: Do NOT use emoji in the text. Do NOT use Czech characters š, č, and ř (use s, c, r instead) to avoid header encoding issues.',
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });
    } catch (claudeErr: any) {
      console.error("❌ ANTHROPIC API ERROR FULL:", JSON.stringify(claudeErr, null, 2));
      console.error("❌ ANTHROPIC MESSAGE:", claudeErr?.message);
      return NextResponse.json(
        { error: 'Claude API call failed', details: claudeErr?.message },
        { status: 502 }
      );
    }

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicResponse.status}`, details: errorText },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData?.content?.[0]?.text;

    if (!rawContent) {
      console.error('No content in Anthropic response:', anthropicData);
      return NextResponse.json({ error: 'No content returned from Claude' }, { status: 502 });
    }

    // Parse JSON from Claude's response
    let generatedJson: GeneratedSiteJson;
    try {
      const cleanedJsonText = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      generatedJson = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON response:', rawContent);
      return NextResponse.json(
        { error: 'Claude returned invalid JSON', raw: rawContent },
        { status: 502 }
      );
    }

    // Save generated JSON to Supabase using direct fetch
    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${order_id}`;
    
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Error updating order with direct fetch:', errorText);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    const updatedOrders = await updateResponse.json();
    const updatedOrder = updatedOrders[0];

    console.log('Site generated successfully for order:', order_id);

    // Send preview email to client
    if (order.company_email) {
      sendPreviewEmail(order.company_email, previewUrl, order_id).catch((err) =>
        console.error('Failed to send preview email:', err)
      );
    }

    return NextResponse.json(
      { success: true, order: updatedOrder, generated_site_json: generatedJson },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error in /api/generate-site:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
