import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const companyName = formData.get('companyName') as string;
    const companyPhone = formData.get('companyPhone') as string;
    const companyEmail = formData.get('companyEmail') as string;
    const companyAddress = formData.get('companyAddress') as string;
    const industry = formData.get('industry') as string;
    const ownerName = formData.get('ownerName') as string;
    const ownerPhone = formData.get('ownerPhone') as string;
    const ownerEmail = formData.get('ownerEmail') as string;
    const domain = formData.get('domain') as string;
    const description = formData.get('description') as string;
    const advantage = formData.get('advantage') as string;
    const priceList = formData.get('priceList') as string;
    const workingHours = formData.get('workingHours') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    const language = formData.get('language') as string;
    const facebookUrl = formData.get('facebookUrl') as string;
    const instagramUrl = formData.get('instagramUrl') as string;
    const googleMapsUrl = formData.get('googleMapsUrl') as string;

    // Log received data for debugging
    console.log('Received order data:', {
      companyName,
      companyPhone,
      companyEmail,
      companyAddress,
      industry,
      domain,
      description,
      advantage,
      workingHours,
    });

    // Validate required fields
    if (!companyName || !companyPhone || !companyEmail || !companyAddress || !industry || !domain || !description || !advantage || !workingHours) {
      console.error('Missing required fields:', { companyName, companyPhone, companyEmail, companyAddress, industry, domain, description, advantage, workingHours });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload images (optional - continue even if upload fails)
    const imageUrls: string[] = [];
    const imageKeys = Array.from(formData.keys()).filter((key): key is string => typeof key === 'string' && key.startsWith('image_'));
    
    try {
      for (const key of imageKeys) {
        const file = formData.get(key) as File;
        if (file) {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('Attempting to upload image:', fileName);
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('order-images')
              .upload(filePath, file);

            if (uploadError) {
              console.error('Image upload error:', uploadError);
              console.error('Image upload error details:', JSON.stringify(uploadError, null, 2));
              // Continue with order creation even if image upload fails
              continue;
            }

            if (uploadData) {
              const { data: publicUrlData } = supabase.storage
                .from('order-images')
                .getPublicUrl(filePath);
              
              if (publicUrlData) {
                imageUrls.push(publicUrlData.publicUrl);
              }
            }
          } catch (uploadErr) {
            console.error('Exception during image upload:', uploadErr);
            console.error('Exception details:', JSON.stringify(uploadErr, null, 2));
            // Continue with order creation even if image upload fails
            continue;
          }
        }
      }
    } catch (storageErr) {
      console.error('Storage bucket error:', storageErr);
      // Continue with order creation even if storage bucket doesn't exist
    }

    // Insert order into database
    const insertData = {
        company_name: companyName,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_address: companyAddress,
        industry,
        description: description,
        domain: domain,
        status: 'čeká',
        // New fields
        primary_color: primaryColor || null,
        secondary_color: secondaryColor || null,
        language: language || null,
        facebook_url: facebookUrl || null,
        instagram_url: instagramUrl || null,
        google_maps_url: googleMapsUrl || null,
        images: imageUrls,
        owner_name: ownerName || null,
        owner_phone: ownerPhone || null,
        owner_email: ownerEmail || null,
        advantage: advantage || null,
        price_list: priceList || null,
        working_hours: workingHours || null,
      };

    console.log('Inserting order data:', insertData);

    const { data, error } = await supabase
      .from('web_orders')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Database error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: `Chyba při ukládání objednávky: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    console.error('Server error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: `Interní chyba serveru: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const trash = searchParams.get('trash');

    let query = supabase
      .from('web_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('company_name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Filter by trash status
    if (trash === 'true') {
      query = query.not('deleted_at', 'is', null);
    } else {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Chyba při načítání objednávek.' }, { status: 500 });
    }

    return NextResponse.json({ orders: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
