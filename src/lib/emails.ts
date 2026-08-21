import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Webs Baca <info@websbaca.cz>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.websbaca.cz';

export async function sendPreviewEmail(
  clientEmail: string,
  previewUrl: string,
  orderId: string
) {
  console.log(`Sending preview email for order ${orderId} to ${clientEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: 'Your website is ready for review! 🚀',
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Your website is ready! 🚀</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          We have prepared a preview of your website. Take a look and let us know if everything is to your satisfaction.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          If you'd like to make any changes, just let us know — we'll be happy to fine-tune everything.
        </p>
        <div style="margin: 32px 0;">
          <a href="${previewUrl}" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            View website preview
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Or copy this link into your browser:<br>
          <a href="${previewUrl}" style="color: #2563eb;">${previewUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Order No. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Preview email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND PREVIEW EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendRevisionCompleteEmail(
  clientEmail: string,
  previewUrl: string,
  orderId: string
) {
  console.log(`Sending revision complete email for order ${orderId} to ${clientEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: 'Your website design has been updated! 🚀',
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Your website has been updated! 🚀</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Great news! We have successfully incorporated your feedback and updated your website design.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          You can view the updated version by clicking the button below.
        </p>
        <div style="margin: 32px 0;">
          <a href="${previewUrl}" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            View updated website
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Or copy this link into your browser:<br>
          <a href="${previewUrl}" style="color: #2563eb;">${previewUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Order No. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Revision complete email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND REVISION COMPLETE EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendDomainUnavailableEmail(
  clientEmail: string,
  orderId: string,
  domainName: string
) {
  const fixUrl = `${BASE_URL}/fix-domain/${orderId}`;
  console.log(`Sending domain unavailable email for order ${orderId} to ${clientEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Important: Domain ${domainName} is not available`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Domain is not available</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Unfortunately, the domain <strong>${domainName}</strong> you selected is already taken and cannot be registered.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          No worries — click the button below to enter a new domain. The whole process only takes a moment.
        </p>
        <div style="margin: 32px 0;">
          <a href="${fixUrl}" style="background-color: #dc2626; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            Enter new domain
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Or copy this link:<br>
          <a href="${fixUrl}" style="color: #2563eb;">${fixUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Order No. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Domain unavailable email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND DOMAIN UNAVAILABLE EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendDomainBoughtEmail(
  clientEmail: string,
  companyName: string,
  domain: string,
  orderId: string
) {
  console.log(`Sending domain bought email for order ${orderId} to ${clientEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Your domain ${domain} is officially registered! 🚀`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Your website is live! 🚀</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Great news, <strong>${companyName}</strong>! Your domain <strong>${domain}</strong> has been officially purchased and your website is now online.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Everything is fully functional and ready for your visitors.
        </p>
        <div style="margin: 32px 0;">
          <a href="https://${domain}" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            Visit your website
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">
          Or copy this link into your browser:<br>
          <a href="https://${domain}" style="color: #2563eb;">https://${domain}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Order No. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Domain bought email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND DOMAIN BOUGHT EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendAdminNewDomainSelectedEmail(
  orderId: string,
  companyName: string,
  newDomain: string
) {
  const adminEmail = 'webs.baca.support@gmail.com';
  console.log(`Sending admin notification for new domain selection: ${newDomain}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🚨 New Domain Selected: ${companyName}`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 2px solid #3b82f6; border-radius: 12px;">
        <h1 style="color: #111; font-size: 22px; margin-bottom: 20px;">Customer selected a new domain</h1>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 160px;">Company</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">New Domain</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111; font-weight: 700; font-size: 18px;">${newDomain}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Order ID</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #6b7280; font-family: monospace;">${orderId}</td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 15px;">Please check the domain management dashboard to approve this domain.</p>
        
        <div style="margin-top: 24px;">
          <a href="${BASE_URL}/domains" style="background-color: #3b82f6; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">
            Open Domain Dashboard
          </a>
        </div>
      </div>
    `,
    });
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND ADMIN NEW DOMAIN NOTIFICATION:`, error);
    throw error;
  }
}

export async function sendAdminDomainPurchaseEmail(
  orderId: string,
  companyName: string,
  domain: string,
  customerEmail: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'webs.baca.support@gmail.com';
  const porkbunUrl = `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}`;
  const namecheapUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
  const supabaseOrderUrl = `https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0]}/editor?table=orders&filter=id%3Aeq%3A${orderId}`;
  const dnsGuideUrl = `${BASE_URL}/admin/dns-guide`;

  console.log(`Sending admin domain purchase email for order ${orderId} to ${adminEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🚨 NOVÁ PLATBA: Koupit doménu pro ${companyName}`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 2px solid #f59e0b; border-radius: 12px;">
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0;">⚡ NOVÁ PLATBA — Koupit doménu: ${domain}</p>
        </div>
        <h1 style="color: #111; font-size: 22px; margin-bottom: 20px;">Detail objednávky</h1>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 160px;">Název firmy</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Vybraná doména</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111; font-weight: 700; font-size: 18px;">${domain}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Customer Email</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #111;">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Order ID</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #6b7280; font-family: monospace; font-size: 13px;">${orderId}</td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 15px; font-weight: 600; margin-bottom: 12px;">Purchase domain (1 click):</p>
        <div style="display: flex; gap: 12px; margin-bottom: 28px;">
          <a href="${porkbunUrl}" style="background-color: #7c3aed; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block; margin-right: 12px;">
            🐷 Purchase on Porkbun
          </a>
          <a href="${namecheapUrl}" style="background-color: #ea580c; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">
            🔍 Purchase on Namecheap
          </a>
        </div>

        <p style="color: #374151; font-size: 15px; font-weight: 600; margin-bottom: 12px;">Next steps:</p>
        <div style="margin-bottom: 28px;">
          <a href="${supabaseOrderUrl}" style="background-color: #16a34a; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block; margin-right: 12px; margin-bottom: 10px;">
            🗄️ View order in Supabase
          </a>
          <a href="${dnsGuideUrl}" style="background-color: #0284c7; color: #fff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 10px;">
            🌐 DNS Guide (A/CNAME records)
          </a>
        </div>

        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #0369a1; font-size: 13px; margin: 0 0 6px 0; font-weight: 600;">After purchasing the domain, set these DNS records:</p>
          <p style="color: #0c4a6e; font-size: 13px; margin: 0; font-family: monospace;">
            A record: @ → 76.76.21.21 (Vercel)<br>
            CNAME: www → cname.vercel-dns.com
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Order No. <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${orderId}</code> · <a href="${BASE_URL}" style="color: #9ca3af;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Admin domain purchase email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND ADMIN DOMAIN PURCHASE EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(
  clientEmail: string,
  companyName: string,
  domain: string,
  orderId: string
) {
  console.log(`Sending order confirmation email for order ${orderId} to ${clientEmail}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Order received — ${domain} 🎉`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Payment successful! 🎉</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Thank you, <strong>${companyName}</strong>! Your payment has been received and we'll get to work immediately.
        </p>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Your website will soon be available at the domain <strong>${domain}</strong>. Once it's ready, you'll receive an email with a preview link.
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="color: #166534; font-size: 14px; margin: 0 0 4px 0;">Your domain</p>
          <p style="color: #15803d; font-size: 22px; font-weight: 700; margin: 0;">${domain}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          Order No. ${orderId} · <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a>
        </p>
      </div>
    `,
    });
    console.log(`Order confirmation email sent successfully for order ${orderId}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND ORDER CONFIRMATION EMAIL for order ${orderId}:`, error);
    throw error;
  }
}

export async function sendPartnerCommissionEmail(
  partnerEmail: string,
  commissionAmount: number,
  clientDomain: string
) {
  console.log(`Sending partner commission email to ${partnerEmail} for domain ${clientDomain}`);
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: partnerEmail,
      subject: `New commission of $${commissionAmount} credited! 🎉`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #111; font-size: 24px; margin-bottom: 16px;">Commission credited! 🎉</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Congratulations! A customer using your referral code has successfully completed a website order for the domain <strong>${clientDomain}</strong>.
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="color: #166534; font-size: 14px; margin: 0 0 4px 0;">Your commission</p>
          <p style="color: #15803d; font-size: 36px; font-weight: 700; margin: 0;">$${commissionAmount}</p>
        </div>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Commission will be processed according to the partner program terms. You can find an overview of all commissions in your partner account.
        </p>
        <div style="margin: 32px 0;">
          <a href="${BASE_URL}/partnerprogram" style="background-color: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
            View partner account
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
        <p style="color: #aaa; font-size: 12px;">
          <a href="${BASE_URL}" style="color: #aaa;">websbaca.cz</a> — Partner Program
        </p>
      </div>
    `,
    });
    console.log(`Partner commission email sent successfully to ${partnerEmail}:`, data);
    return data;
  } catch (error) {
    console.error(`FAILED TO SEND PARTNER COMMISSION EMAIL to ${partnerEmail}:`, error);
    throw error;
  }
}
