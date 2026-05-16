import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO = "webs.baca@gmail.com";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Neplatný požadavek" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Vyplňte jméno" }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ error: "Vyplňte platný e-mail" }, { status: 400 });
  }
  if (phone.length > 40) {
    return NextResponse.json({ error: "Telefon je příliš dlouhý" }, { status: 400 });
  }
  if (!message || message.length > 8000) {
    return NextResponse.json({ error: "Napište zprávu" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Odesílání e-mailu není na serveru nastaveno" },
      { status: 503 },
    );
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Webs Bača <noreply@webs.baca.cz>";

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Kontakt z webu: ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">
        <h2 style="color:#7C3AED;margin:0 0 24px">Nová poptávka z webs.baca.cz</h2>
        <p><strong>Jméno:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>Zpráva:</strong></p>
        <pre style="white-space:pre-wrap;font-family:sans-serif;color:#d4d4d8">${escapeHtml(message)}</pre>
        <p style="color:#52525b;font-size:11px;margin-top:24px">${new Date().toLocaleString("cs-CZ")}</p>
      </div>
    `,
  });

  if (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Odeslání se nezdařilo, zkuste to prosím znovu" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
