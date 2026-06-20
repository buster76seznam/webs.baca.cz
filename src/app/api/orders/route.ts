import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

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
      images: [],
      primary_color: formData.get('primaryColor') || null,
      secondary_color: formData.get('secondaryColor') || null,
      language: formData.get('language') || null,
      facebook_url: formData.get('facebookUrl') || null,
      instagram_url: formData.get('instagramUrl') || null,
      google_maps_url: formData.get('googleMapsUrl') || null,
    };

    console.log('Insert data:', insertData);

    const { data, error } = await supabase
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Insert success:', data);
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

    let query = supabase
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
    } else {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('GET success:', data?.length, 'orders');

    return NextResponse.json({ orders: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
