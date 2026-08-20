import { NextRequest, NextResponse, after } from 'next/server';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isTrash = searchParams.get('trash') === 'true';

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (isTrash) {
      query = query.not('deleted_at', 'is', null);
    } else {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (error) {
    console.error('❌ ERROR IN GET /api/orders:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('--- ENDPOINT A: POST /api/orders START ---');
  try {
    // 1. Validace dat z body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse JSON body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload. Please ensure you are sending application/json.' },
        { status: 400 }
      );
    }

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
      turnstileToken,
      refCode
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

    // 2. Vložení do Supabase se stavem "draft" - Striktní zápis
    const { data: newOrder, error: insertError } = await supabase
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
          ref_code: refCode,
          status: 'draft',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("❌ CRITICAL SUPABASE INSERT ERROR:", insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    if (!newOrder || !newOrder.id) {
      console.error("❌ SUPABASE INSERT SUCCESSFUL BUT NO ID RETURNED");
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve new order ID' },
        { status: 500 }
      );
    }

    const orderId = newOrder.id;
    console.log("✅ ORDER SUCCESSFULLY CREATED IN SUPABASE WITH ID:", orderId);

    // 3. Spolehlivé volání Endpoint B na pozadí pomocí after()
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host');
    const generateUrl = `${protocol}://${host}/api/orders/generate`;

    after(async () => {
      try {
        console.log("🚀 TRIGGERING GENERATE ENDPOINT FOR ORDER:", orderId);
        const genRes = await fetch(generateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });
        
        if (!genRes.ok) {
          console.error("❌ GENERATE ENDPOINT RETURNED ERROR:", genRes.status);
        } else {
          console.log("✅ GENERATE ENDPOINT TRIGGERED SUCCESSFULLY");
        }
      } catch (err) {
        console.error("❌ FAILED TO TRIGGER GENERATE ENDPOINT:", err);
      }
    });

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
