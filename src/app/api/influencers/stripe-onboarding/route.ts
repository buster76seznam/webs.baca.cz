import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import { Resend } from 'resend';
import QRCode from 'qrcode';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

const resend = new Resend(process.env.RESEND_API_KEY);

function generateReferralCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6 + Math.floor(Math.random() * 3);
  let result = 'ref_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, socialLinks } = await req.json();

    if (!name || !email || !socialLinks) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('partners')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered. Please log in with your Partner ID.' },
        { status: 400 }
      );
    }

    // Generate unique referral code (Partner ID)
    const referralCode = generateReferralCode();

    // Create a new partner (influencer) record
    const { data: partner, error: createError } = await supabase
      .from('partners')
      .insert([
        { name, email, social_links: socialLinks, referral_code: referralCode, status: 'pending_onboarding' }
      ])
      .select()
      .single();

    if (createError || !partner) {
      console.error('Error creating partner:', createError);
      return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email: partner.email,
      business_type: 'individual',
      metadata: {
        partner_id: partner.id,
      },
      capabilities: {
        card_payments: { requested: false },
        transfers: { requested: true },
      },
    });

    const accountId = account.id;

    const { error: updateError } = await supabase
      .from('partners')
      .update({ stripe_connect_account_id: accountId })
      .eq('id', partner.id);

    if (updateError) {
      console.error('Error updating partner with Stripe account ID:', updateError);
      // Even if this fails, we can still proceed with onboarding and handle it later
    }

    const returnUrl = new URL('/partnerprogram/success', req.nextUrl.origin).toString();
    const refreshUrl = new URL('/partnerprogram', req.nextUrl.origin).toString();

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: 'account_onboarding',
    });

    // Send welcome email with referral link, QR code and Partner ID (non-blocking)
    try {
      const referralLink = `https://websbaca.cz?ref=${referralCode}`;
      const qrBuffer = await QRCode.toBuffer(referralLink, { width: 512, margin: 2 });

      await resend.emails.send({
        from: 'Webs Bača <noreply@websbaca.cz>',
        to: email,
        subject: 'Welcome to Webs Bača Partner Program - Your Referral Link',
        attachments: [
          {
            filename: 'websbaca-referral-qr.png',
            content: qrBuffer.toString('base64'),
            contentType: 'image/png',
          },
        ],
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">Webs Bača</h1>
              <p style="color: #666; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Partner Program</p>
            </div>
            <h2 style="color: #111; font-size: 22px;">Welcome, ${name}! 🎉</h2>
            <p style="color: #444; line-height: 1.6;">
              Your registration was successful and your Stripe payout setup is ready.
              Below you will find everything you need to start earning.
            </p>

            <div style="background: #f5f3ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #7c3aed; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Your Partner ID</p>
              <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #111; font-family: monospace;">${referralCode}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Save it - you will need it to log in to your dashboard</p>
            </div>

            <div style="background: #f5f3ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #7c3aed; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Your Unique Referral Link</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: bold; color: #111; word-break: break-all;">${referralLink}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Share this link with your audience - every paying client earns you recurring commission</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <p style="margin: 0 0 8px 0; color: #7c3aed; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Your QR Code</p>
              <img src="cid:websbaca-referral-qr.png" alt="Referral QR Code" width="200" height="200" style="border-radius: 8px;" />
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">The QR code is also attached to this email as a PNG file</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://websbaca.cz/partnerprogram" style="display: inline-block; background: #7c3aed; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                Go to Your Dashboard
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">Webs Bača Partner Program - websbaca.cz</p>
          </div>
        `,
      });
      console.log(`Referral welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error('Failed to send referral welcome email:', emailErr);
    }

    return NextResponse.json({ onboardingUrl: accountLink.url });

  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}