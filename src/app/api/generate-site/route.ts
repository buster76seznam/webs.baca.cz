import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
import { sendPreviewEmail } from '@/lib/emails';

export const runtime = 'nodejs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; cta_text: string };
  about: { title: string; content: string };
  services: Array<{ title: string; description: string; icon: string }>;
  advantages: Array<{ title: string; description: string }>;
  contact: { email: string; phone: string; address: string };
  theme: { primary_color: string; secondary_color: string; font_style: string };
  layout: {
    hero_variant: 'variant_1' | 'variant_2' | 'variant_3';
    services_variant: 'grid' | 'list';
  };
}

export async function POST(request: NextRequest) {
  try {


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
- hero: { title, subtitle, cta_text }
- about: { title, content }
- services: array of { title, description, icon } (use simple emoji or icon name for icon)
- advantages: array of { title, description }
- contact: { email, phone, address }
- theme: { primary_color (hex), secondary_color (hex), font_style }
- layout: { hero_variant (one of: "variant_1", "variant_2", "variant_3"), services_variant (one of: "grid", "list") }

For layout: choose hero_variant and services_variant that best match the industry and brand personality:
- variant_1 (Split): good for service companies, local businesses
- variant_2 (Centered/Full-width): good for bold brands, tech, creative agencies
- variant_3 (Minimal): good for luxury, premium, design-focused brands
- grid: good when there are 3+ distinct services to display
- list: good when services have longer descriptions or fewer items (1-4)

Write all text content in the language specified (${formData.language || 'cs'}). Make it professional and compelling.`;

    // Call Anthropic Claude API
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        system: 'Respond ONLY with valid JSON. Do not include markdown formatting or extra text.',
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

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
      generatedJson = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON response:', rawContent);
      return NextResponse.json(
        { error: 'Claude returned invalid JSON', raw: rawContent },
        { status: 502 }
      );
    }

    // Save generated JSON to Supabase and update status
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        generated_site_json: generatedJson,
        status: 'preview_ready',
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
      const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${order_id}`;
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
