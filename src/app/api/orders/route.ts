import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
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
