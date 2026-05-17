import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO = "webs.baca@gmail.com";
const DEFAULT_FROM = "Webs Bača <noreply@websbaca.cz>";

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

/** Resend vyžaduje odesílatele z ověřené domény — ne Gmail/Seznam. */
function resolveFromAddress(): { from: string; note?: string } {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw) {
    return { from: DEFAULT_FROM, note: "RESEND_FROM_EMAIL není nastaveno, použit výchozí odesílatel." };
  }

  const emailMatch = raw.match(/<([^>]+)>/) ?? [null, raw];
  const email = (emailMatch[1] ?? raw).trim().toLowerCase();

  const publicInbox =
    /@(gmail\.com|googlemail\.com|seznam\.cz|email\.cz|outlook\.com|hotmail\.com|yahoo\.)/i.test(
      email,
    );

  if (publicInbox) {
    return {
      from: DEFAULT_FROM,
      note:
        "RESEND_FROM_EMAIL nesmí být veřejná schránka (Gmail apod.). Nastavte např. Webs Bača <noreply@websbaca.cz> v Resend u ověřené domény.",
    };
  }

  if (raw.includes("<") && raw.includes(">")) {
    return { from: raw };
  }

  if (isValidEmail(email)) {
    return { from: `Webs Bača <${email}>` };
  }

  return { from: DEFAULT_FROM, note: "RESEND_FROM_EMAIL má neplatný formát, použit výchozí odesílatel." };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek", code: "INVALID_JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Neplatný požadavek", code: "INVALID_BODY" }, { status: 400 });
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
    return NextResponse.json({ error: "Vyplňte jméno", code: "VALIDATION_NAME" }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ error: "Vyplňte platný e-mail", code: "VALIDATION_EMAIL" }, { status: 400 });
  }
  if (phone.length > 40) {
    return NextResponse.json({ error: "Telefon je příliš dlouhý", code: "VALIDATION_PHONE" }, { status: 400 });
  }
  if (!message || message.length > 8000) {
    return NextResponse.json({ error: "Napište zprávu", code: "VALIDATION_MESSAGE" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Odesílání e-mailu není na serveru nastaveno",
        code: "MISSING_RESEND_API_KEY",
        hint: "Na Vercelu přidejte RESEND_API_KEY a redeploy.",
      },
      { status: 503 },
    );
  }

  const { from, note } = resolveFromAddress();
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Kontakt z webu: ${name}`,
    html: [
      '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:16px">',
      "<h2 style=\"color:#7C3AED;margin:0 0 24px\">Nová poptávka z webu</h2>",
      `<p><strong>Jméno:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Telefon:</strong> ${escapeHtml(phone || "—")}</p>`,
      "<p><strong>Zpráva:</strong></p>",
      `<pre style="white-space:pre-wrap;font-family:sans-serif;color:#d4d4d8">${escapeHtml(message)}</pre>`,
      `<p style="color:#52525b;font-size:11px;margin-top:24px">${new Date().toLocaleString("cs-CZ")}</p>`,
      "</div>",
    ].join(""),
  });

  if (error) {
    const resendMessage =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

    console.error("[contact] Resend send failed", {
      resendMessage,
      from,
      to: CONTACT_TO,
      note,
      resendError: error,
    });

    return NextResponse.json(
      {
        error:
          "E-mail se nepodařilo odeslat. Zkontrolujte v Resend ověřenou doménu a RESEND_FROM_EMAIL.",
        code: "RESEND_SEND_FAILED",
        hint:
          "RESEND_FROM_EMAIL musí být adresa z ověřené domény (např. Webs Bača <noreply@websbaca.cz>), ne webs.baca@gmail.com. Gmail je jen příjemce.",
        fromUsed: from,
        resendMessage,
        configNote: note,
      },
      { status: 502 },
    );
  }

  console.info("[contact] Email sent", { id: data?.id, from, to: CONTACT_TO });

  return NextResponse.json({ ok: true, id: data?.id });
}
