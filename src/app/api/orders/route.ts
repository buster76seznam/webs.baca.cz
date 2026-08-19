import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60;

export async function POST(request: Request) {
  console.log('--- ENDPOINT A: POST /api/orders START ---');
  try {
    // 1. Validace dat z body
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));

    const {
      companyName,
      companyPhone,
      companyEmail,
      companyAddress,
      industry,
      ownerName,
      ownerPhone,
      ownerEmail,
      domain,
      description,
      advantage,
      priceList,
      workingHours,
      primaryColor,
      secondaryColor,
      language,
      facebookUrl,
      instagramUrl,
      googleMapsUrl,
      turnstileToken
    } = body;

    // Turnstile validace (volitelná, ale ponecháme ji pokud tam byla)
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
        console.error('Turnstile verification failed (non-blocking):', tsErr);
      }
    }

    // 2. Vložení do Supabase se stavem "draft"
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert([
        {
          company_name: companyName,
          company_phone: companyPhone,
          company_email: companyEmail,
          company_address: companyAddress,
          industry,
          owner_name: ownerName,
          owner_phone: ownerPhone,
          owner_email: ownerEmail,
          domain,
          description,
          advantage,
          price_list: priceList,
          working_hours: workingHours,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          language,
          facebook_url: facebookUrl,
          instagram_url: instagramUrl,
          google_maps_url: googleMapsUrl,
          status: 'draft',
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Database insertion failed' },
        { status: 500 }
      );
    }

    const orderId = order.id;
    console.log('Order created successfully:', orderId);

    // 3. Volání Endpoint B na pozadí (nečekáme na výsledek)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000');
    
    // Asynchronní volání bez await
    fetch(`${baseUrl}/api/orders/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    }).catch(err => console.error('Error triggering background generation:', err));

    // 4. Ihned vrátit odpověď
    return NextResponse.json({ success: true, orderId });

  } catch (error) {
    console.error('❌ ERROR IN POST /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
