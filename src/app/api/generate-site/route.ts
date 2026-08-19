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
    // Izolovaný admin klient bez děděných hlaviček z požadavku
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
        global: { 
          fetch: (url, options) => {
            const headers = new Headers();
            if (options?.headers) {
              const incomingHeaders = options.headers instanceof Headers 
                ? Object.fromEntries(options.headers.entries())
                : options.headers as Record<string, string>;
  
              Object.entries(incomingHeaders).forEach(([key, value]) => {
                try {
                  const safeValue = String(value).replace(/[^\x00-\x7F]/g, '');
                  headers.set(key, safeValue);
                } catch (e) {}
              });
            }
            return fetch(url, { ...options, headers });
          }
        }
      }
    );


    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 });
    }

    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    // Fetch order from Supabase
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      console.error('Error fetching order:', fetchError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build prompt from form_data
    const formData = order;
    const userPrompt = `Generate a complete website content JSON for the following business:

Company Name: ${formData.company_name || ''}
Industry: ${formData.industry || ''}
Description: ${formData.description || ''}
Advantages / Unique Selling Points: ${formData.advantage || ''}
Services / Price List: ${formData.price_list || ''}
Working Hours: ${formData.working_hours || ''}
Email: ${formData.company_email || ''}
Phone: ${formData.company_phone || ''}
Address: ${formData.company_address || ''}
Country: ${formData.company_country || ''}
Preferred Primary Color: ${formData.primary_color || ''}
Preferred Secondary Color: ${formData.secondary_color || ''}
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

    // Call Anthropic Claude API
    console.log("Key check:", process.env.ANTHROPIC_API_KEY ? "EXISTS (starts with " + process.env.ANTHROPIC_API_KEY.slice(0, 7) + ")" : "MISSING!");

    console.log("🤖 CLAUDE MODEL SENT:", "claude-sonnet-4-5-20250929");
    let anthropicResponse;
    try {
      anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

    // Save generated JSON to Supabase and update status
    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${order_id}`;
    
    // Ujistíme se, že posíláme čistá data v body
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

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
