import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/supabase';
import { COMMISSION_STRUCTURE } from '@/lib/affiliate-types';
import { sendPreviewEmail, sendAdminDomainPurchaseEmail, sendOrderConfirmationEmail } from '@/lib/emails';

export const runtime = 'nodejs';

// Ochrana – route je dostupná pouze v testovacím/dev prostředí
const ALLOWED_ENVS = ['development', 'test'];

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Stripe Test Mode klíč – pokud máš test klíč v .env jako STRIPE_TEST_SECRET_KEY, použij ho
// jinak použijeme hlavní klíč (který ale MUSÍ být test klíč sk_test_...)
const STRIPE_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY!;

interface StepResult {
  step: number;
  name: string;
  status: 'ok' | 'error' | 'skipped';
  data?: unknown;
  error?: string;
  durationMs: number;
}

interface PipelineResult {
  success: boolean;
  totalDurationMs: number;
  steps: StepResult[];
  orderId?: string;
  stripeSessionUrl?: string;
}

// ─── Pomocná funkce: volání Claude API ─────────────────────────────────────────
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  console.log("Key check:", process.env.ANTHROPIC_API_KEY ? "EXISTS (starts with " + process.env.ANTHROPIC_API_KEY.slice(0, 7) + ")" : "MISSING!");
  
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY není nastaven');

  let response;
  try {
    console.log("🤖 CLAUDE MODEL SENT:", "claude-5-sonnet");
    response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-5-sonnet',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
  } catch (claudeErr: any) {
    console.error("❌ ANTHROPIC API ERROR FULL:", JSON.stringify(claudeErr, null, 2));
    console.error("❌ ANTHROPIC MESSAGE:", claudeErr?.message);
    throw claudeErr;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text;
  if (!content) throw new Error('Claude nevrátil žádný obsah');
  return content;
}

// ─── Pomocná funkce: měření doby trvání ────────────────────────────────────────
async function runStep<T>(
  step: number,
  name: string,
  fn: () => Promise<T>
): Promise<{ result: StepResult; value?: T }> {
  const start = Date.now();
  console.log(`\n[TEST-PIPELINE] Krok ${step}: ${name} – spouštím...`);

  try {
    const value = await fn();
    const durationMs = Date.now() - start;
    console.log(`[TEST-PIPELINE] Krok ${step}: ${name} – OK (${durationMs}ms)`);
    return {
      result: { step, name, status: 'ok', data: value as unknown, durationMs },
      value,
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[TEST-PIPELINE] Krok ${step}: ${name} – CHYBA (${durationMs}ms):`, errorMsg);
    return {
      result: { step, name, status: 'error', error: errorMsg, durationMs },
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
export async function GET(request: NextRequest) {
  const pipelineStart = Date.now();
  const steps: StepResult[] = [];
  let orderId: string | undefined;
  let stripeSessionUrl: string | undefined;

  // Bezpečnostní kontrola – v produkci s LIVE klíčem odmítnout
  const stripeIsLive = STRIPE_SECRET_KEY?.startsWith('sk_live_');
  if (stripeIsLive) {
    console.error('[TEST-PIPELINE] ODMÍTNUTO – detekován živý Stripe klíč (sk_live_). Přidej STRIPE_TEST_SECRET_KEY=sk_test_... do .env');
    return NextResponse.json(
      {
        error: 'BEZPEČNOSTNÍ BLOKACE: Detekován živý Stripe klíč (sk_live_). Test pipeline je zakázán v produkci. Přidej STRIPE_TEST_SECRET_KEY=sk_test_... do .env a použij testovací klíč.',
      },
      { status: 403 }
    );
  }

  // ─── KROK 1: Vytvoření testovací objednávky v Supabase ─────────────────────
  const step1 = await runStep(1, 'Referral & Objednávka – vytvoření v Supabase', async () => {
    const testFormData = {
      company_name: 'Austin Roofing Co.',
      industry: 'roofing',
      description: 'Professional roofing services in Austin, TX. Residential and commercial.',
      advantage: 'Fast turnaround, licensed and insured, 10+ years experience',
      price_list: 'Roof inspection: $150, Repair: from $300, Full replacement: from $5,000',
      working_hours: 'Mon–Fri 7am–6pm, Sat 8am–4pm',
      company_email: 'test@austinroofingco.com',
      company_phone: '+1 (512) 555-0199',
      company_address: '1234 South Congress Ave, Austin, TX 78704',
      company_country: 'US',
      domain: 'test-austinroofing.com',
      language: 'en',
    };

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        ref_code: 'TEST_HONZA',
        status: 'queued',
        ...testFormData,
      })
      .select()
      .single();

    if (error) throw new Error(`Supabase insert chyba: ${error.message}`);
    if (!data?.id) throw new Error('Supabase nevrátil ID objednávky');

    return {
      orderId: data.id,
      ref_code: data.ref_code,
      company_name: data.company_name,
      status: data.status,
    };
  });

  steps.push(step1.result);
  if (step1.result.status !== 'ok' || !step1.value) {
    return buildResponse(false, steps, pipelineStart);
  }
  orderId = (step1.value as { orderId: string }).orderId;
  console.log(`[TEST-PIPELINE] orderId = ${orderId}`);

  // ─── KROK 2: AI Generování webu přes Claude ────────────────────────────────
  const step2 = await runStep(2, 'AI Generování – volání Claude API', async () => {
    const userPrompt = `Generate a complete website content JSON for the following business:

Company Name: Austin Roofing Co.
Industry: roofing
Description: Professional roofing services in Austin, TX. Residential and commercial.
Advantages / Unique Selling Points: Fast turnaround, licensed and insured, 10+ years experience
Services / Price List: Roof inspection: $150, Repair: from $300, Full replacement: from $5,000
Working Hours: Mon–Fri 7am–6pm, Sat 8am–4pm
Email: test@austinroofingco.com
Phone: +1 (512) 555-0199
Address: 1234 South Congress Ave, Austin, TX 78704
Country: US
Language: en

Generate the JSON with these exact keys:
- hero: { title, subtitle, cta_text }
- about: { title, content }
- services: array of { title, description, icon }
- advantages: array of { title, description }
- contact: { email, phone, address }
- theme: { primary_color (hex), secondary_color (hex), font_style }
- layout: { hero_variant (one of: "variant_1", "variant_2", "variant_3"), services_variant (one of: "grid", "list") }

Write all text content in English. Make it professional and compelling.`;

    const rawJson = await callClaude(
      'Respond ONLY with valid JSON. Do not include markdown formatting or extra text.',
      userPrompt
    );

    let generatedJson: unknown;
    // Odstranit markdown code fences pokud Claude je přidal
    const cleanedJson = rawJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    try {
      generatedJson = JSON.parse(cleanedJson);
    } catch {
      throw new Error(`Claude vrátil neplatný JSON: ${rawJson.slice(0, 200)}`);
    }

    // Ověření struktury
    const json = generatedJson as Record<string, unknown>;
    const requiredKeys = ['hero', 'services', 'theme'];
    const missingKeys = requiredKeys.filter((k) => !(k in json));
    if (missingKeys.length > 0) {
      throw new Error(`Chybějící klíče v JSON: ${missingKeys.join(', ')}`);
    }

    // Uložit do Supabase – status 'development' = generováno (dle CHECK constraint v DB)
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ generated_site_json: generatedJson, status: 'development' })
      .eq('id', orderId!);

    if (updateError) throw new Error(`Supabase update chyba: ${updateError.message}`);

    return {
      validatedKeys: requiredKeys,
      heroTitle: (json.hero as Record<string, unknown>)?.title,
      themeColor: (json.theme as Record<string, unknown>)?.primary_color,
      servicesCount: Array.isArray(json.services) ? json.services.length : 0,
    };
  });

  steps.push(step2.result);
  if (step2.result.status !== 'ok') {
    return buildResponse(false, steps, pipelineStart, orderId);
  }

  // ─── KROK 3: AI Revize – požadavek na změnu barvy ──────────────────────────
  const step3 = await runStep(3, 'AI Revize – simulace požadavku na změnu barvy', async () => {
    // Načtení aktuálního JSON z Supabase
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('generated_site_json, revision_count')
      .eq('id', orderId!)
      .single();

    if (fetchError || !order) throw new Error('Objednávka pro revizi nenalezena');
    if (!order.generated_site_json) throw new Error('generated_site_json je prázdný');

    const currentJson = JSON.stringify(order.generated_site_json, null, 2);
    const revisionPrompt = `Zde je stávající JSON webu:\n${currentJson}\n\nKlient požaduje tyto změny: změň barvu na modrou (primary_color: #1d4ed8, secondary_color: #93c5fd)\n\nUprav JSON a vrať ZMĚNĚNOU kompletní strukturu v platném JSON formátu.`;

    const rawJson = await callClaude(
      'Respond ONLY with valid JSON. Do not include markdown formatting, code blocks, or any extra text.',
      revisionPrompt
    );

    let updatedJson: unknown;
    const cleanedRevisionJson = rawJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    try {
      updatedJson = JSON.parse(cleanedRevisionJson);
    } catch {
      throw new Error(`Claude vrátil neplatný JSON pro revizi: ${rawJson.slice(0, 200)}`);
    }

    const currentRevisionCount = order.revision_count ?? 0;

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        generated_site_json: updatedJson,
        revision_count: currentRevisionCount + 1,
      })
      .eq('id', orderId!)
      .select('revision_count')
      .single();

    if (updateError) throw new Error(`Supabase revize update chyba: ${updateError.message}`);

    const newPrimaryColor = (updatedJson as Record<string, Record<string, unknown>>)?.theme
      ?.primary_color;

    return {
      revision_count: updatedOrder?.revision_count,
      new_primary_color: newPrimaryColor,
      colorIsBlue:
        typeof newPrimaryColor === 'string' &&
        newPrimaryColor.toLowerCase().includes('1d4ed8'),
    };
  });

  steps.push(step3.result);
  if (step3.result.status !== 'ok') {
    return buildResponse(false, steps, pipelineStart, orderId);
  }

  // ─── KROK 4: Stripe Checkout Session (Test Mode) ───────────────────────────
  const step4 = await runStep(4, 'Stripe Checkout – vytvoření testovací session', async () => {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webs.baca.cz';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: 'test@austinroofingco.com',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Webs.baca.cz – Monthly Subscription (TEST)',
              description: 'Test objednávka – Austin Roofing Co.',
            },
            unit_amount: 15000, // $150.00
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      metadata: {
        orderId: orderId!,
        ref_code: 'TEST_HONZA',
      },
      success_url: `${baseUrl}/preview/${orderId}?status=success`,
      cancel_url: `${baseUrl}/preview/${orderId}`,
    });

    if (!session.url) throw new Error('Stripe nevrátil URL checkoutu');

    return {
      sessionId: session.id,
      url: session.url,
      mode: session.mode,
      automatic_tax_enabled: session.automatic_tax?.enabled,
      metadata_orderId: session.metadata?.orderId,
      metadata_ref_code: session.metadata?.ref_code,
      livemode: session.livemode,
    };
  });

  steps.push(step4.result);
  if (step4.result.status === 'ok' && step4.value) {
    stripeSessionUrl = (step4.value as { url: string }).url;
  }
  // Krok 4 chyba je nezablokující pro krok 5 (simulujeme webhook přímo)

  // ─── KROK 5: Simulace Stripe Webhook – checkout.session.completed ──────────
  const step5 = await runStep(5, 'Stripe Webhook Simulace – checkout.session.completed', async () => {
    // 5a: Aktualizace statusu objednávky na 'completed' (status 'paid' neexistuje v CHECK constraint)
    const { error: updateOrderError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId!);

    if (updateOrderError) {
      throw new Error(`Nepodařilo se nastavit status 'paid': ${updateOrderError.message}`);
    }
    console.log(`[TEST-PIPELINE] 5a: objednávka ${orderId} → status = completed`);

    // 5b: Nalezení partnera 'TEST_HONZA' a přičtení provize
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('id, total_earned, active_clients, email')
      .eq('referral_code', 'TEST_HONZA')
      .single();

    let commissionResult: Record<string, unknown> = { skipped: true, reason: 'Partner TEST_HONZA nenalezen v DB' };

    if (partnerError || !partner) {
      console.warn('[TEST-PIPELINE] 5b: Partner TEST_HONZA nenalezen – provize přeskočena');
    } else {
      const activeClients = (partner.active_clients ?? 0) + 1;
      let commission = COMMISSION_STRUCTURE[1].usd;
      if (activeClients >= 126) commission = COMMISSION_STRUCTURE[3].usd;
      else if (activeClients >= 51) commission = COMMISSION_STRUCTURE[2].usd;

      const { error: commissionError } = await supabaseAdmin
        .from('partners')
        .update({
          total_earned: (partner.total_earned ?? 0) + commission,
          active_clients: activeClients,
        })
        .eq('id', partner.id);

      if (commissionError) {
        throw new Error(`Chyba při přičítání provize: ${commissionError.message}`);
      }

      console.log(`[TEST-PIPELINE] 5b: provize $${commission} připsána partnerovi ${partner.id}`);
      commissionResult = {
        skipped: false,
        partnerId: partner.id,
        commissionAdded: commission,
        newActiveClients: activeClients,
      };
    }

    // 5c: Odeslání testovacích e-mailů přes Resend (admin + zákazník paralelně)
    let emailResult: Record<string, unknown> = {};
    try {
      const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://webs.baca.cz'}/preview/${orderId}`;
      const [adminEmailResponse, confirmationEmailResponse] = await Promise.all([
        sendAdminDomainPurchaseEmail(
          orderId!,
          'Austin Roofing Co.',
          'test-austinroofing.com',
          'test@austinroofingco.com'
        ),
        sendOrderConfirmationEmail(
          'test@austinroofingco.com',
          'Austin Roofing Co.',
          'test-austinroofing.com',
          orderId!
        ),
      ]);
      // Odeslat i preview e-mail (jako dříve)
      const previewEmailResponse = await sendPreviewEmail(
        'test@austinroofingco.com',
        previewUrl,
        orderId!
      );
      console.log('[TEST-PIPELINE] 5c: admin e-mail odeslán', adminEmailResponse);
      console.log('[TEST-PIPELINE] 5c: potvrzovací e-mail zákazníkovi odeslán', confirmationEmailResponse);
      console.log('[TEST-PIPELINE] 5c: preview e-mail odeslán', previewEmailResponse);
      emailResult = {
        sent: true,
        adminEmailId: (adminEmailResponse as { id?: string })?.id,
        confirmationEmailId: (confirmationEmailResponse as { id?: string })?.id,
        previewEmailId: (previewEmailResponse as { id?: string })?.id,
      };
    } catch (emailErr) {
      const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.warn('[TEST-PIPELINE] 5c: e-mail se nepodařilo odeslat:', msg);
      emailResult = { sent: false, error: msg };
    }

    return {
        orderStatusUpdated: 'dokončená',
        commission: commissionResult,
        email: emailResult,
      };
  });

  steps.push(step5.result);

  // ─── Finální odpověď ────────────────────────────────────────────────────────
  const allOk = steps.every((s) => s.status === 'ok');
  return buildResponse(allOk, steps, pipelineStart, orderId, stripeSessionUrl);
}

function buildResponse(
  success: boolean,
  steps: StepResult[],
  pipelineStart: number,
  orderId?: string,
  stripeSessionUrl?: string
): NextResponse<PipelineResult> {
  const totalDurationMs = Date.now() - pipelineStart;
  const result: PipelineResult = {
    success,
    totalDurationMs,
    steps,
    ...(orderId && { orderId }),
    ...(stripeSessionUrl && { stripeSessionUrl }),
  };

  console.log(
    `\n[TEST-PIPELINE] ════ VÝSLEDEK: ${success ? '✅ ÚSPĚCH' : '❌ CHYBA'} (${totalDurationMs}ms) ════`
  );
  steps.forEach((s) => {
    const icon = s.status === 'ok' ? '✅' : s.status === 'error' ? '❌' : '⏭️';
    console.log(`  ${icon} Krok ${s.step}: ${s.name} – ${s.status.toUpperCase()} (${s.durationMs}ms)`);
    if (s.error) console.log(`     Chyba: ${s.error}`);
  });

  return NextResponse.json(result, { status: success ? 200 : 207 });
}
