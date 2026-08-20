import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { sendPreviewEmail } from '@/lib/emails';
import { SITE_URL } from '@/lib/site';

export const maxDuration = 60;

export async function POST(request: Request) {
  console.log('--- ENDPOINT B: /api/orders/generate START ---');
  try {
    // 1. Přijme orderId z body
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      console.error('Missing orderId in request body');
      return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
    }

    console.log('Processing order:', orderId);

    // 2. Načte detail objednávky ze Supabase
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.error('Error fetching order details:', fetchError);
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 3. Vercel AI SDK: Volání Claude (claude-sonnet-4-5-20250929)
    console.log('Calling Claude AI for content generation...');
    const { object: generatedJson } = await generateObject({
      model: anthropic('claude-sonnet-4-5-20250929'),
      schema: z.object({
        hero: z.object({
          title: z.string(),
          subtitle: z.string(),
          ctaText: z.string()
        }),
        about: z.object({
          title: z.string(),
          text: z.string()
        }),
        services: z.array(z.object({
          title: z.string(),
          description: z.string()
        })),
        contact: z.object({
          address: z.string(),
          phone: z.string(),
          hours: z.string()
        }),
        theme: z.object({
          primaryColor: z.string(),
          secondaryColor: z.string()
        })
      }),
      system: `You are an expert web content creator.
CRITICAL: System MUST generate ALL JSON content strictly in the language specified in the order.
If language is 'en', all generated text (title, subtitle, services, etc.) MUST be 100% in English.
If language is 'cs', all generated text MUST be 100% in Czech.
Never fallback to Czech unless language is explicitly 'cs'. Never use emojis.`,
      prompt: `Create a complete JSON for a website based on this information:
Company Name: ${order.company_name}
Industry: ${order.industry}
Description: ${order.description}
Advantages: ${order.advantage}
Services/Pricing: ${order.price_list}
Working Hours: ${order.working_hours}
Email: ${order.company_email}
Phone: ${order.company_phone}
Address: ${order.company_address}
Preferred Primary Color: ${order.primary_color}
Preferred Secondary Color: ${order.secondary_color}
Language: ${order.language || 'cs'}

CRITICAL: All generated content MUST be strictly in ${order.language === 'en' ? 'English' : 'Czech'}.`
    });

    console.log('Content generated successfully');

    // 4. Uložení vygenerovaného obsahu do Supabase a změna stavu na "preview_ready"
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.websbaca.cz';
    const previewUrl = `${BASE_URL}/preview/${orderId}`;
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        generated_site_json: generatedJson,
        status: 'preview_ready',
        preview_url: previewUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with generated content:', updateError);
      throw new Error('Failed to update order with generated content');
    }

    console.log('Order updated to preview_ready');

    // 5. Zavolání odeslání notifikačního e-mailu přes Resend
    if (order.company_email) {
      try {
        await sendPreviewEmail(order.company_email, previewUrl, orderId);
        console.log('Notification email sent successfully');
      } catch (emailErr) {
        console.error('Error sending notification email (non-blocking):', emailErr);
      }
    }

    return NextResponse.json({ success: true, orderId, status: 'preview_ready' });

  } catch (error) {
    console.error('❌ ERROR IN POST /api/orders/generate:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
