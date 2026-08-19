import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';

// @ts-ignore
import webpush from 'web-push';

export const runtime = 'nodejs';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:webs.baca@gmail.com',
    publicVapidKey,
    privateVapidKey
  );
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    credentials: 'omit',
  });
  const data = await res.json();
  return data.success === true;
}

import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '0.0.0.0';

    const formData = await request.formData();

    console.log("Orders API triggered successfully");
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    
    /* 
    // Verify Turnstile token
    const turnstileToken = formData.get('turnstileToken') as string | null;
    if (turnstileToken) {
      const turnstileOk = await verifyTurnstile(turnstileToken, ip);
      if (!turnstileOk) {
        return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 });
      }
    }
    */

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many orders from your IP. Please try again later.' },
        { status: 429 }
      );
    }

    // Log which key is being used
    console.log('Service role key from env:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

    // Extract images from FormData
    const imageUrls: string[] = [];
    let imageIndex = 0;
    try {
      console.log('Starting image upload...');
      while (formData.get(`image_${imageIndex}`) as File) {
        const file = formData.get(`image_${imageIndex}`) as File;
        const normalizedFileName = (file.name || 'image').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const fileName = `${Date.now()}-${imageIndex}-${normalizedFileName}`;
        console.log('Uploading image:', fileName, 'size:', file.size);
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('order-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          const cleanFileName = (file.name || 'image').replace(/[^\x00-\x7F]/g, "");
          return NextResponse.json({ 
            error: `Failed to upload image ${cleanFileName}: ${uploadError.message}` 
          }, { status: 500 });
        } else {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('order-images')
            .getPublicUrl(fileName);
          imageUrls.push(publicUrlData.publicUrl);
          console.log('Image uploaded successfully:', publicUrlData.publicUrl);
        }
        imageIndex++;
      }
    } catch (imgError) {
      console.error('CRITICAL IMAGE ERROR:', imgError);
      throw imgError;
    }
    console.log('Total images uploaded:', imageUrls.length);

    const insertData = {
      company_name: String(formData.get('companyName') || ''),
      company_phone: String(formData.get('companyPhone') || ''),
      company_email: String(formData.get('companyEmail') || ''),
      company_address: String(formData.get('companyAddress') || ''),
      company_country: String(formData.get('companyCountry') || '') || null,
      industry: String(formData.get('industry') || ''),
      owner_name: String(formData.get('ownerName') || '') || null,
      owner_phone: String(formData.get('ownerPhone') || '') || null,
      owner_email: String(formData.get('ownerEmail') || '') || null,
      domain: String(formData.get('domain') || ''),
      description: String(formData.get('description') || ''),
      advantage: String(formData.get('advantage') || ''),
      price_list: String(formData.get('priceList') || '') || null,
      working_hours: String(formData.get('workingHours') || ''),
      status: 'queued', 
      images: imageUrls,
      primary_color: String(formData.get('primaryColor') || '') || null,
      secondary_color: String(formData.get('secondaryColor') || '') || null,
      language: String(formData.get('language') || '') || null,
      facebook_url: String(formData.get('facebookUrl') || '') || null,
      instagram_url: String(formData.get('instagramUrl') || '') || null,
      google_maps_url: String(formData.get('googleMapsUrl') || '') || null,
      legal_business_name: String(formData.get('legalBusinessName') || '') || null,
      state_of_incorporation: String(formData.get('stateOfIncorporation') || '') || null,
      principal_place_of_business: String(formData.get('principalPlaceOfBusiness') || '') || null,
      authorized_signatory: String(formData.get('authorizedSignatory') || '') || null,
      contract_email: String(formData.get('contractEmail') || '') || null,
      ip_address: ip,
    };

    console.log('Inserting data into Supabase...');
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Email sending bypassed for testing");
    /*
    console.log('Insert success. Triggering cron...');

    const host = request.headers.get('host') || 'www.websbaca.cz';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const processOrderUrl = `${protocol}://${host}/api/crons/process-orders`;
    
    // Immediately trigger the processing of the order
    try {
      let safeHost = host;
      // Remove any non-ASCII characters from host to prevent ByteString errors in fetch
      if (/[^\x00-\x7F]/.test(safeHost)) {
        console.warn(`Non-ASCII characters detected in host: ${safeHost}. Falling back to localhost in dev or stripping characters.`);
        if (process.env.NODE_ENV === 'development') {
          safeHost = '127.0.0.1:3000'; // Use IP to be even safer
        } else {
          safeHost = safeHost.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "");
        }
      }
      
      const safeProcessOrderUrl = `${protocol}://${safeHost}/api/crons/process-orders`;
      console.log(`Fetching ${safeProcessOrderUrl}`);
      
      // Ensure CRON_SECRET is ASCII
      const safeCronSecret = (process.env.CRON_SECRET || '').replace(/[^\x00-\x7F]/g, "");

      const cronRes = await fetch(safeProcessOrderUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${safeCronSecret}`,
        },
        credentials: 'omit', // CRITICAL: Prevent forwarding non-ASCII cookies
      });
      console.log('Cron triggered status:', cronRes.status);
    } catch (fetchError) {
      console.error('Error triggering process-orders cron:', fetchError);
    }

    // Send push notification
    try {
      console.log('Checking for push subscriptions...');
      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from('push_subscriptions')
        .select('subscription');

      if (!subError && subscriptions && subscriptions.length > 0) {
        console.log(`Sending to ${subscriptions.length} subscribers`);
        const cleanCompanyName = String(formData.get('companyName') || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "");
        const payload = JSON.stringify({
          title: 'New Order!',
          body: `New order from ${cleanCompanyName}`,
          icon: '/Logo.png',
          badge: '/Logo.png',
          data: { url: '/program', orderId: data.id }
        });

        for (const sub of subscriptions) {
          try {
            const subscription = typeof sub.subscription === 'string' ? JSON.parse(sub.subscription) : sub.subscription;
            // webpush might internally use fetch or http.request, let's ensure it doesn't crash the whole flow
            await webpush.sendNotification(subscription, payload).catch((e: any) => console.error('webpush error:', e));
          } catch (err) {
            console.error('Push failed for sub:', err);
          }
        }
      }
    } catch (pushError) {
      console.error('Push notification system error:', pushError);
    }
    */

    return NextResponse.json({ success: true, message: "Order processed successfully" }, { status: 200 });
  } catch (error) {
    const errorAsError = error as Error;
    console.error("ORDER CREATION ERROR:", errorAsError);
    return NextResponse.json(
      { 
        error: errorAsError.message || 'Internal Server Error', 
        details: JSON.stringify(errorAsError, Object.getOwnPropertyNames(errorAsError)) 
      }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const trash = searchParams.get('trash');

    console.log('GET /api/orders:', { search, status, trash });

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('company_name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (trash === 'true') {
      query = query.not('deleted_at', 'is', null);
      console.log('Filtering for trash (deleted_at is not null)');
    } else {
      query = query.is('deleted_at', null);
      console.log('Filtering for active orders (deleted_at is null)');
    }

    const { data, error } = await query;

    if (error) {
      console.error('GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('GET success:', data?.length, 'orders');
    if (data && data.length > 0) {
      console.log('First order deleted_at:', data[0].deleted_at);
    }

    return NextResponse.json({ orders: data || [] }, { status: 200 });
  } catch (error) {
    const errorAsError = error as Error;
    console.error("ORDER CREATION ERROR:", errorAsError);
    return NextResponse.json(
      { 
        error: errorAsError.message || 'Internal Server Error', 
        details: JSON.stringify(errorAsError, Object.getOwnPropertyNames(errorAsError)) 
      }, 
      { status: 500 }
    );
  }
}
