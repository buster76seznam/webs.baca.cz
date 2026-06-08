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

    // Upload images
    const imageUrls: string[] = [];
    const imageKeys = Array.from(formData.keys()).filter((key): key is string => typeof key === 'string' && key.startsWith('image_'));
    
    for (const key of imageKeys) {
      const file = formData.get(key) as File;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
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
      }
    }

    // Insert order into database
    const { data, error } = await supabase
      .from('web_orders')
      .insert({
        company_name: companyName,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_address: companyAddress,
        industry,
        owner_name: ownerName || null,
        owner_phone: ownerPhone || null,
        owner_email: ownerEmail || null,
        domain,
        description,
        advantage,
        price_list: priceList || null,
        working_hours: workingHours,
        images: imageUrls,
        status: 'čeká',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Chyba při ukládání objednávky.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');

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
