import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, developer_id, notes } = await request.json();

    console.log('PATCH request:', { id, status, developer_id, notes });

    const updateData: any = {
      status,
    };

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
