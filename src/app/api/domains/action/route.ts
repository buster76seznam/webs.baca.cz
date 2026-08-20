import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendDomainBoughtEmail, sendDomainUnavailableEmail } from '@/lib/emails';

export async function POST(request: NextRequest) {
  try {
    const { orderId, action, password } = await request.json();

    if (password !== 'Filip_23.2010') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'bought') {
      // 1. Změní status objednávky na vyřízenou/aktivní
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'active',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // 2. Automaticky odešle zákazníkovi e-mail v angličtině
      await sendDomainBoughtEmail(
        order.company_email,
        order.company_name,
        order.domain,
        order.id
      );

      return NextResponse.json({ success: true });
    } 
    
    if (action === 'unavailable') {
      // Odešle zákazníkovi e-mail v angličtině s informací, že požadovaná doména není k dispozici
      await sendDomainUnavailableEmail(
        order.company_email,
        order.id,
        order.domain
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Domain action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
