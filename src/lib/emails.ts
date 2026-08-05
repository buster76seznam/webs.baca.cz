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

export async function sendAdminDomainPurchaseEmail(
  orderId: string,
  companyName: string,
  domain: string,
  customerEmail: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'filip@baca.cz';
  const porkbunUrl = `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}`;
  const namecheapUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
  const supabaseOrderUrl = `https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0]}/editor?table=orders&filter=id%3Aeq%3A${orderId}`;
  const dnsGuideUrl = `${BASE_URL}/admin/dns-guide`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `[AKCE VYŽADOVÁNA] Koupit doménu: ${domain} pro ${companyName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 2px solid #f59e0b; border-radius: 12px;">
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0;">⚡ AKCE VYŽADOVÁNA — Zákazník zaplatil, je potřeba koupit doménu</p>
        </div>
        <h1 style="color: #111; font-size: 22px; margin-bottom: 20px;">Nová objednávka — Koupě domény</h1>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 160px;">Firma</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Doména</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111; font-weight: 700; font-size: 18px;">${domain}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">E-mail zákazníka</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111;">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">ID objednávky</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #6b7280; font-family: monospace; font-size: 13px;">${orderId}</td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 15px; font-weight: 600; margin-bottom: 12px;">Koupit doménu (1 klik):</p>
        <div style="display: flex; gap: 12px; margin-bottom: 28px;">
          <a href="${porkbunUrl}" style="background-color: #7c3aed; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block; margin-right: 12px;">
            🐷 Koupit na Porkbun
          </a>
          <a href="${namecheapUrl}" style="background-color: #ea580c; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">
            🔍 Koupit na Namecheap
          </a>
        </div>

        <p style="color: #374151; font-size: 15px; font-weight: 600; margin-bottom: 12px;">Další kroky:</p>
        <div style="margin-bottom: 28px;">
          <a href="${supabaseOrderUrl}" style="background-color: #16a34a; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block; margin-right: 12px; margin-bottom: 10px;">
            🗄️ Zobrazit objednávku v Supabase
          </a>
          <a href="${dnsGuideUrl}" style="background-color: #0284c7; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
            🌐 DNS návod (A/CNAME záznamy)
          </a>
        </div>

        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #0369a1; font-size: 13px; margin: 0 0 6px 0; font-weight: 600;">Po koupi domény nastav tyto DNS záznamy:</p>
          <p style="color: #0c4a6e; font-size: 13px; margin: 0; font-family: monospace;">
            A record: @ → 76.76.21.21 (Vercel)<br>
            CNAME: www → cname.vercel-dns.com
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Objednávka č. <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${orderId}</code> · <a href="${BASE_URL}" style="color: #9ca3af;">webs.baca.cz</a>
        </p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(
  clientEmail: string,
  companyName: string,
  domain: string,
  orderId: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject: `Objednávka přijata — ${domain} 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Platba proběhla úspěšně! 🎉</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Děkujeme, <strong>${companyName}</strong>! Vaše platba byla přijata a my se okamžitě pustíme do práce.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Váš web bude brzy dostupný na doméně <strong>${domain}</strong>. Jakmile bude připraven, dostanete e-mail s odkazem k nahlédnutí.
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="color: #166534; font-size: 14px; margin: 0 0 4px 0;">Vaše doména</p>
          <p style="color: #15803d; font-size: 22px; font-weight: 700; margin: 0;">${domain}</p>
        </div>
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
