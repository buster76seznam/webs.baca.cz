import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';
import { ORDER_STATUSES } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, developer_id, notes } = await request.json();

    console.log('PATCH request:', { id, status, developer_id, notes });
    console.log('ORDER_STATUSES:', ORDER_STATUSES);

    if (!status || !ORDER_STATUSES.includes(status)) {
      console.error('Invalid status:', status);
      return NextResponse.json({ error: 'Neplatný status.' }, { status: 400 });
    }

    const updateData: any = {
      status,
      status_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (developer_id) {
      updateData.developer_id = developer_id;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Chyba při aktualizaci objednávky.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Chyba při načítání objednávky.' }, { status: 500 });
    }

    // Map database field names to match program page's Order interface
    const mappedOrder = {
      ...data,
      company_phone: data.phone,
      company_email: data.email,
      company_address: data.address,
      description: data.services,
      domain: data.website_url,
      // Normalize status values
      status: data.status === 'Čeká ve frontě' ? 'čeká' :
             data.status === 'Ve vývoji' ? 'vývoj' :
             data.status === 'Dokončeno' ? 'dokončená' :
             data.status?.toLowerCase() || 'čeká',
    };

    return NextResponse.json({ order: mappedOrder }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { permanent } = await request.json();

    if (permanent) {
      // Permanent delete
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Chyba při mazání objednávky.' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Soft delete
      const { error } = await supabase
        .from('orders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Chyba při přesunu objednávky do koše.' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === 'restore') {
      // Restore from trash
      const { error } = await supabase
        .from('orders')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Chyba při obnově objednávky.' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Neplatná akce.' }, { status: 400 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
