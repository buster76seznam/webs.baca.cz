import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const insertData = {
      company_name: formData.get('companyName'),
      phone: formData.get('companyPhone'),
      email: formData.get('companyEmail'),
      address: formData.get('companyAddress'),
      industry: formData.get('industry'),
      owner_name: formData.get('ownerName') || null,
      owner_phone: formData.get('ownerPhone') || null,
      owner_email: formData.get('ownerEmail') || null,
      website_url: formData.get('domain'),
      services: formData.get('description'),
      advantage: formData.get('advantage'),
      price_list: formData.get('priceList') || null,
      working_hours: formData.get('workingHours'),
      status: 'Čeká ve frontě',
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

    // Map old field names to new field names for frontend
    const mappedOrders = (data || []).map(order => ({
      ...order,
      company_phone: order.phone,
      company_email: order.email,
      company_address: order.address,
      description: order.services,
      domain: order.website_url,
      status: order.status === 'Čeká ve frontě' ? 'čeká' :
             order.status === 'Ve vývoji' ? 'vývoj' :
             order.status === 'Dokončeno' ? 'dokončená' :
             order.status?.toLowerCase() || 'čeká',
    }));

    return NextResponse.json({ orders: mappedOrders }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
