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

    if (!status || !ORDER_STATUSES.includes(status)) {
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

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
