import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateReferralCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6 + Math.floor(Math.random() * 3); // 6-8 chars
  let result = 'ref_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateVerificationToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, socialLinks, payoutMethod } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('partners')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered.' },
        { status: 400 }
      );
    }

    const referralCode = generateReferralCode();
    const verificationToken = generateVerificationToken();

    const { error: insertError } = await supabase.from('partners').insert({
      name,
      email,
      referral_code: referralCode,
      social_links: socialLinks || null,
      payout_method: { type: payoutMethod || 'bank-transfer' },
      verification_token: verificationToken,
      verified: false,
      active: true,
    });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Registration failed. Please try again.' },
        { status: 500 }
      );
    }

    // Send verification email via VPS email server
    const verificationLink = `https://websbaca.cz/partnerprogram/verify?token=${verificationToken}`;
    try {
      const emailResponse = await fetch('http://142.93.163.199:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Potvrzení registrace - Webs Bača Partner Program',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">Webs Bača</h1>
                <p style="color: #666; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Partner Program</p>
              </div>
              <h2 style="color: #111; font-size: 22px;">Vítej, ${name}! 🎉</h2>
              <p style="color: #444; line-height: 1.6;">Děkujeme za registraci do našeho partner programu. Pro dokončení registrace potvrď svůj email kliknutím na tlačítko níže:</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationLink}" style="display: inline-block; background: #7c3aed; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                  ✓ Potvrdit email
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">Nebo zkopíruj tento odkaz do prohlížeče:<br>
              <span style="color: #7c3aed;">${verificationLink}</span></p>
              <div style="background: #f5f3ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #7c3aed; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Tvůj Referral kód</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #111; font-family: monospace;">${referralCode}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Ulož si ho – budeš ho potřebovat pro přihlášení</p>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">Webs Bača Partner Program &bull; websbaca.cz</p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error('VPS email server error:', emailResponse.status, await emailResponse.text());
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue - registration is saved, email failure is not critical
    }

    return NextResponse.json({
      success: true,
      message: 'Registrace úspěšná! Zkontroluj svůj email pro potvrzení účtu.',
      referralCode,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
