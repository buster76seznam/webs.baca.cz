import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status: 'vývoj' })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status to vývoj:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server error in /api/orders/revision:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
