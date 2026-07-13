import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
// @ts-ignore
import webpush from 'web-push';
import { Resend } from 'resend';

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

// Email notification helper
async function sendOrderEmail(orderData: {
  companyName: string;
  companyEmail: string;
  industry: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY_2;
  
  if (!resendApiKey) {
    console.log('RESEND_API_KEY_2 not configured, skipping email notification');
    return;
  }

  const resend = new Resend(resendApiKey);
  
  // Get US date and time
  const now = new Date();
  const usDate = now.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' });
  const usTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true });
  
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; padding: 20px;">
      <div style="max-width: 400px; margin: 0 auto; background: #111; border-radius: 12px; padding: 24px; border: 1px solid #222;">
        <div style="background: linear-gradient(135deg, #7C3AED, #5B21B6); border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 14px; opacity: 0.9;">Nová objednávka</div>
          <div style="font-size: 20px; font-weight: bold; margin-top: 4px;">${orderData.companyName}</div>
        </div>
        
        <div style="color: #888; font-size: 12px; margin-bottom: 4px;">EMAIL</div>
        <div style="color: #fff; font-size: 14px; margin-bottom: 16px;">${orderData.companyEmail}</div>
        
        <div style="color: #888; font-size: 12px; margin-bottom: 4px;">OBOR</div>
        <div style="color: #fff; font-size: 14px; margin-bottom: 16px;">${orderData.industry}</div>
        
        <div style="background: #1a1a1a; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">USA (ET)</div>
          <div style="color: #7C3AED; font-size: 18px; font-weight: bold; margin-top: 4px;">${usTime}</div>
          <div style="color: #888; font-size: 13px; margin-top: 4px;">${usDate}</div>
        </div>
      </div>
    </div>
  `;

  try {
    console.log('Attempting to send email with Resend...');
    console.log('API Key present:', !!resendApiKey, resendApiKey?.substring(0, 10) + '...');
    
    const { data, error } = await resend.emails.send({
      from: 'Webs Bača <noreply@webs.baca.cz>',
      to: ['webs.baca.support@gmail.com'],
      subject: `Nová objednávka: ${orderData.companyName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    } else {
      console.log('Email sent successfully:', data?.id);
      return { success: true, id: data?.id };
    }
  } catch (err) {
    console.error('Email sending failed:', err);
    return { success: false, error: err };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Log which key is being used
    console.log('Service role key from env:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
    console.log('Using service role key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...');

    // Extract images from FormData
    const imageUrls: string[] = [];
    let imageIndex = 0;
    console.log('Starting image upload...');
    while (formData.get(`image_${imageIndex}`) as File) {
      const file = formData.get(`image_${imageIndex}`) as File;
      const fileName = `${Date.now()}-${imageIndex}-${file.name}`;
      console.log('Uploading image:', fileName, 'size:', file.size);
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('order-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({ 
          error: `Failed to upload image ${file.name}: ${uploadError.message}` 
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
    console.log('Total images uploaded:', imageUrls.length);

    const insertData = {
      company_name: formData.get('companyName'),
      company_phone: formData.get('companyPhone'),
      company_email: formData.get('companyEmail'),
      company_address: formData.get('companyAddress'),
      industry: formData.get('industry'),
      owner_name: formData.get('ownerName') || null,
      owner_phone: formData.get('ownerPhone') || null,
      owner_email: formData.get('ownerEmail') || null,
      domain: formData.get('domain'),
      description: formData.get('description'),
      advantage: formData.get('advantage'),
      price_list: formData.get('priceList') || null,
      working_hours: formData.get('workingHours'),
      status: 'čeká',
      images: imageUrls,
      primary_color: formData.get('primaryColor') || null,
      secondary_color: formData.get('secondaryColor') || null,
      language: formData.get('language') || null,
      facebook_url: formData.get('facebookUrl') || null,
      instagram_url: formData.get('instagramUrl') || null,
      google_maps_url: formData.get('googleMapsUrl') || null,
      legal_business_name: formData.get('legalBusinessName') || null,
      state_of_incorporation: formData.get('stateOfIncorporation') || null,
      principal_place_of_business: formData.get('principalPlaceOfBusiness') || null,
      authorized_signatory: formData.get('authorizedSignatory') || null,
      contract_email: formData.get('contractEmail') || null,
    };

    console.log('Insert data:', insertData);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Insert success:', data);

    // Send email notification
    const emailResult = await sendOrderEmail({
      companyName: formData.get('companyName') as string,
      companyEmail: formData.get('companyEmail') as string,
      industry: formData.get('industry') as string,
    });
    console.log('Email result:', emailResult);

    // Send push notification if VAPID keys are configured
    if (publicVapidKey && privateVapidKey) {
      try {
        // Fetch all subscriptions from database
        const { data: subscriptions, error: subError } = await supabaseAdmin
          .from('push_subscriptions')
          .select('subscription');

        if (subError) {
          console.error('Error fetching subscriptions:', subError);
        } else if (subscriptions && subscriptions.length > 0) {
          const payload = JSON.stringify({
            title: 'Nová objednávka!',
            body: `Přišla nová objednávka od ${formData.get('companyName')}`,
            icon: '/Logo.png',
            badge: '/Logo.png',
            data: {
              url: '/program',
              orderId: data.id
            }
          });

          console.log(`Sending push notifications to ${subscriptions.length} subscribers`);
          
          // Send notifications to all subscribers
          for (const sub of subscriptions) {
            try {
              await webpush.sendNotification(sub.subscription, payload);
              console.log('Notification sent successfully');
            } catch (err) {
              console.error('Failed to send notification to subscriber:', err);
              // Remove invalid subscriptions
              if (err instanceof Error && err.message.includes('410')) {
                await supabaseAdmin
                  .from('push_subscriptions')
                  .delete()
                  .eq('subscription', sub.subscription);
              }
            }
          }
        }
      } catch (pushError) {
        console.error('Push notification error:', pushError);
        // Don't fail the order creation if push fails
      }
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
