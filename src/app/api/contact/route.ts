import { BOT_CHECK_FAILED, CROSS_SITE_REFUSED, filledHoneypot, fromOtherSite } from "@/lib/bot-check";
import { pickContact, sendContactEmail, validateContact } from "@/lib/contact";
import { verifyTurnstile } from "@/lib/turnstile";
import { site } from "@/data/content";

const MAX_BODY = 12_000;

/** Emails a contact-form message to Neeram through Resend. */
export async function POST(request: Request) {
  if (fromOtherSite(request)) return CROSS_SITE_REFUSED();
  let body: { fields?: unknown; turnstileToken?: unknown };
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return Response.json({ error: "Your message is too long." }, { status: 413 });
    body = JSON.parse(text);
    if (!body || typeof body !== "object") throw new Error("not an object");
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const message = pickContact(body.fields);
  const errors = validateContact(message);
  if (Object.keys(errors).length) return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });

  // A bot filled in the hidden field: say it worked so it learns nothing, but send nothing.
  if (filledHoneypot(body.fields)) return Response.json({ ok: true });
  // Checked after the fields, since each Turnstile token can only be checked once.
  const check = await verifyTurnstile(body.turnstileToken, request.headers.get("CF-Connecting-IP"));
  if (check === "failed") return BOT_CHECK_FAILED();
  // Unlike an order, a message lands straight in the inbox: on the live site, send nothing
  // until the bot check is set up, so a script can't flood the inbox or use up Resend's quota.
  if (check === "not-set-up" && process.env.NODE_ENV === "production" && process.env.ORDERS_TEST_MODE !== "1") return unavailable();

  return (await sendContactEmail(message)) === "sent" ? Response.json({ ok: true }) : unavailable();
}

function unavailable() {
  const fallback = site.support.email ? ` Please email us at ${site.support.email}.` : "";
  return Response.json({ error: `Your message couldn't be sent just now.${fallback}` }, { status: 502 });
}
