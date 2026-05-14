import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Vyplň prosím všechna povinná pole.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'Webs Bača Web <onboarding@resend.dev>',
      to: 'webs.baca@gmail.com',
      replyTo: email,
      subject: `Nová poptávka od ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7C3AED; font-size: 28px; margin: 0; letter-spacing: -1px;">WEBS BAČA</h1>
            <p style="color: #52525b; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; margin: 8px 0 0;">Nová poptávka z webu</p>
          </div>

          <div style="background: #111111; border: 1px solid #1f1f1f; border-radius: 12px; padding: 28px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; width: 120px;">Jméno</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">E-mail</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #a78bfa;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Telefon</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #1f1f1f; color: #ffffff;">${phone}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 16px 0 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">Zpráva</td>
                <td style="padding: 16px 0 0; color: #d4d4d8; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>

          <p style="color: #3f3f46; font-size: 11px; text-align: center; margin: 0;">
            Odesláno z webs.baca.cz • ${new Date().toLocaleString('cs-CZ')}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Nepodařilo se odeslat zprávu.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send email error:', err);
    return NextResponse.json({ error: 'Serverová chyba.' }, { status: 500 });
  }
}
