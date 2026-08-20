import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendAdminNewDomainSelectedEmail } from '@/lib/emails';

export async function POST(request: NextRequest) {
  try {
    const { orderId, newDomain } = await request.json();

    if (!orderId || !newDomain) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Aktualizuj požadovanou doménu u dané objednávky v databázi
    const { data: order, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        domain: newDomain,
        status_updated_at: new Date().toISOString()
        // Ponecháme status 'pending_domain', aby se zobrazila v /domains
      })
      .eq('id', orderId)
      .select('company_name')
      .single();

    if (updateError) throw updateError;
    if (!order) throw new Error('Order not found');

    // 2. Pošli notifikační e-mail administrátorovi
    await sendAdminNewDomainSelectedEmail(
      orderId,
      order.company_name,
      newDomain
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Domain change error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
