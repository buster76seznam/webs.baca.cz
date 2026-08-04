import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Webs.baca.cz <notifikace@webs.baca.cz>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://webs.baca.cz';

export async function sendPreviewEmail(
  clientEmail: string,
  previewUrl: string,
  orderId: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject: 'Váš web je připraven k nahlédnutí! 🚀',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Váš web je hotový! 🚀</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Připravili jsme pro vás náhled webu. Podívejte se na něj a dejte nám vědět, jestli vám vše vyhovuje.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Pokud budete chtít něco upravit, stačí nám napsat — rádi vše doladíme.
        </p>
        <div style="margin: 32px 0;">
          <a href="${previewUrl}" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            Zobrazit náhled webu
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Nebo zkopírujte tento odkaz do prohlížeče:<br>
          <a href="${previewUrl}" style="color: #2563eb;">${previewUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Objednávka č. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">webs.baca.cz</a>
        </p>
      </div>
    `,
  });
}

export async function sendDomainUnavailableEmail(
  clientEmail: string,
  orderId: string,
  domainName: string
) {
  const fixUrl = `${BASE_URL}/fix-domain/${orderId}`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject: `Důležité: Doména ${domainName} není dostupná`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Doména není dostupná</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Bohužel doména <strong>${domainName}</strong>, kterou jste si vybrali, je již zabraná a není možné ji zaregistrovat.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Nic se neděje — klikněte na tlačítko níže a zadejte novou doménu. Celý proces zabere jen chvilku.
        </p>
        <div style="margin: 32px 0;">
          <a href="${fixUrl}" style="background-color: #dc2626; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            Zadat novou doménu
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Nebo zkopírujte tento odkaz:<br>
          <a href="${fixUrl}" style="color: #2563eb;">${fixUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Objednávka č. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">webs.baca.cz</a>
        </p>
      </div>
    `,
  });
}

export async function sendPartnerCommissionEmail(
  partnerEmail: string,
  commissionAmount: number,
  clientDomain: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: partnerEmail,
    subject: `Nová provize $${commissionAmount} připsána! 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Provize připsána! 🎉</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Gratulujem! Zákazník přes váš referral kód úspěšně dokončil objednávku webu pro doménu <strong>${clientDomain}</strong>.
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="color: #166534; font-size: 14px; margin: 0 0 4px 0;">Vaše provize</p>
          <p style="color: #15803d; font-size: 36px; font-weight: 700; margin: 0;">$${commissionAmount}</p>
        </div>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Provize bude zpracována dle podmínek partnerského programu. Přehled všech provizí najdete ve svém partnerském účtu.
        </p>
        <div style="margin: 32px 0;">
          <a href="${BASE_URL}/partnerprogram" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            Zobrazit partnerský účet
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          <a href="${BASE_URL}" style="color: #aaa;">webs.baca.cz</a> — Partnerský program
        </p>
      </div>
    `,
  });
}
