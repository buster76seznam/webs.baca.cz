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

    // 3. Vercel AI SDK: Volání Claude (claude-3-5-sonnet-latest)
    console.log('Calling Claude AI for content generation...');
    const { object: generatedJson } = await generateObject({
      model: anthropic('claude-3-5-sonnet-latest'),
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
      system: `Jsi expert na tvorbu webového obsahu. Vytvoř strukturovaný obsah pro web v českém jazyce. 
Všechny texty musí být v češtině. Nepoužívej emotikony.`,
      prompt: `Vytvoř kompletní JSON pro web na základě těchto informací:
Název firmy: ${order.company_name}
Obor: ${order.industry}
Popis: ${order.description}
Přednosti: ${order.advantage}
Služby/Ceník: ${order.price_list}
Pracovní doba: ${order.working_hours}
Email: ${order.company_email}
Telefon: ${order.company_phone}
Adresa: ${order.company_address}
Preferovaná primární barva: ${order.primary_color}
Preferovaná sekundární barva: ${order.secondary_color}
Jazyk: ${order.language || 'cs'}`
    });

    console.log('Content generated successfully');

    // 4. Uložení vygenerovaného obsahu do Supabase a změna stavu na "preview_ready"
    const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || SITE_URL}/preview/${orderId}`;
    
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
