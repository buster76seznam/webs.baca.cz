import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase';
import { sendPreviewEmail } from '@/lib/emails';

export const runtime = 'nodejs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 });
    }

    const { orderId, prompt: feedback } = await request.json();

    if (!orderId || !feedback) {
      return NextResponse.json({ error: 'orderId and prompt are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Fetch order from Supabase using direct fetch
    const fetchResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Accept': 'application/json'
      }
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('Error fetching order (direct fetch):', errorText);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orders = await fetchResponse.json();
    const order = orders[0];

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.revision_count >= 3) {
      return NextResponse.json({ error: 'Maximální počet revizí byl vyčerpán.' }, { status: 400 });
    }

    // Update feedback history
    const history = Array.isArray(order.feedback_history) ? order.feedback_history : [];
    const newHistory = [...history, { date: new Date().toISOString(), feedback }];

    // Build revision prompt
    const currentJson = JSON.stringify(order.generated_site_json, null, 2);
    const systemPrompt = 'You are a web designer expert. You will receive a website content JSON and a user feedback. Your task is to update the JSON based on the feedback. Respond strictly with raw JSON. Do NOT wrap the JSON in markdown code blocks like ```json. CRITICAL: Do NOT use emoji in the text. Do NOT use Czech characters š, č, and ř (use s, c, r instead) to avoid header encoding issues.';
    
    const userPrompt = `
Current Website JSON:
${currentJson}

User Feedback for Changes:
"${(feedback || '').normalize('NFC')}"

Business Context:
Company: ${(order.company_name || '').normalize('NFC')}
Industry: ${(order.industry || '').normalize('NFC')}
Description: ${(order.description || '').normalize('NFC')}

Update the JSON to reflect the user's feedback while maintaining the structure. Output the full updated JSON.
Structure must be exactly:
{
  "hero": { "title": "...", "subtitle": "...", "ctaText": "..." },
  "about": { "title": "...", "text": "..." },
  "services": [ { "title": "...", "description": "..." } ],
  "contact": { "address": "...", "phone": "...", "hours": "..." },
  "theme": { "primaryColor": "#...", "secondaryColor": "#..." }
}`;

    // Call Anthropic Claude API
    console.log("Key check:", process.env.ANTHROPIC_API_KEY ? "EXISTS (starts with " + process.env.ANTHROPIC_API_KEY.slice(0, 7) + ")" : "MISSING!");

    console.log("🤖 CLAUDE MODEL SENT:", "claude-sonnet-4-5-20250929");
    let anthropicResponse;
    try {
      anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });
    } catch (claudeErr: any) {
      console.error("❌ ANTHROPIC API ERROR FULL:", JSON.stringify(claudeErr, null, 2));
      console.error("❌ ANTHROPIC MESSAGE:", claudeErr?.message);
      return NextResponse.json(
        { error: 'Claude API call failed', details: claudeErr?.message },
        { status: 502 }
      );
    }

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json({ error: 'AI processing failed' }, { status: 502 });
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData?.content?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: 'No content returned from Claude' }, { status: 502 });
    }

    // Parse JSON
    let updatedJson;
    try {
      const cleanedJsonText = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      updatedJson = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON response:', rawContent);
      return NextResponse.json({ error: 'Invalid JSON returned by AI' }, { status: 502 });
    }

    // Save updated JSON and increment revision count using direct fetch
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        generated_site_json: updatedJson,
        status: 'revision_requested',
        revision_count: (order.revision_count || 0) + 1,
        feedback_history: newHistory,
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Error updating order after revision (direct fetch):', errorText);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    const updatedOrders = await updateResponse.json();
    const updatedOrder = updatedOrders[0];

    if (!updatedOrder) {
      throw new Error('Failed to update order');
    }

    // Send new preview email
    if (order.company_email) {
      const previewUrl = order.preview_url || `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${orderId}`;
      sendPreviewEmail(order.company_email, previewUrl, orderId).catch((err) =>
        console.error('Failed to send revision preview email:', err)
      );
    }

    return NextResponse.json({
      success: true,
      generated_site_json: updatedJson,
      revision_count: updatedOrder.revision_count,
      revisions_remaining: 3 - updatedOrder.revision_count
    });

  } catch (error) {
    console.error('Server error in /api/orders/revision:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
