import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';

export const runtime = 'nodejs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_REVISIONS = 3;

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY není nakonfigurován' }, { status: 500 });
    }

    const { orderId, prompt } = await request.json();

    if (!orderId || !prompt) {
      return NextResponse.json({ error: 'orderId a prompt jsou povinné' }, { status: 400 });
    }

    // Načtení objednávky
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, generated_site_json, revision_count')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    if (!order.generated_site_json) {
      return NextResponse.json({ error: 'Web ještě nebyl vygenerován' }, { status: 400 });
    }

    const revisionCount = order.revision_count ?? 0;

    if (revisionCount >= MAX_REVISIONS) {
      return NextResponse.json(
        { error: `Byl dosažen maximální počet revizí (${MAX_REVISIONS})` },
        { status: 429 }
      );
    }

    const currentJson = JSON.stringify(order.generated_site_json, null, 2);

    const userPrompt = `Zde je stávající JSON webu:\n${currentJson}\n\nKlient požaduje tyto změny: ${prompt}\n\nUprav JSON a vrať ZMĚNĚNOU kompletní strukturu v platném JSON formátu.`;

    // Volání Claude API
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: 'Respond ONLY with valid JSON. Do not include markdown formatting, code blocks, or any extra text.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json(
        { error: `Chyba Anthropic API: ${anthropicResponse.status}` },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData?.content?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: 'Claude nevrátil žádný obsah' }, { status: 502 });
    }

    let updatedJson;
    try {
      updatedJson = JSON.parse(rawContent);
    } catch {
      console.error('Neplatný JSON od Claudea:', rawContent);
      return NextResponse.json({ error: 'Claude vrátil neplatný JSON' }, { status: 502 });
    }

    // Uložení do Supabase
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        generated_site_json: updatedJson,
        revision_count: revisionCount + 1,
      })
      .eq('id', orderId)
      .select('generated_site_json, revision_count')
      .single();

    if (updateError) {
      console.error('Chyba při ukládání revize:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        generated_site_json: updatedOrder.generated_site_json,
        revision_count: updatedOrder.revision_count,
        revisions_remaining: MAX_REVISIONS - (updatedOrder.revision_count ?? 0),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chyba v /api/orders/revision:', error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
