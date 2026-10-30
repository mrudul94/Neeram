import { after } from "next/server";
import { BOT_CHECK_FAILED, filledHoneypot } from "@/lib/bot-check";
import { newOrderNumber, orderMessage, pickDetails, priceLines, validateDetails, type CheckoutDetails, type CheckoutLine } from "@/lib/checkout";
import { saveOrder } from "@/lib/records";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Returns the message the customer sends us on WhatsApp (or by SMS, email or phone), then
 * records the order once the response is sent, so the customer never waits for Google.
 * No payment is taken on the site: customers pay before delivery, after we confirm.
 */
export async function POST(request: Request) {
  let body: { lines?: CheckoutLine[]; details?: unknown; turnstileToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const details = pickDetails(body.details);
  const errors = validateDetails(details);
  if (Object.keys(errors).length) return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });

  const { items, total } = priceLines(Array.isArray(body.lines) ? body.lines : []);
  if (!items.length) return Response.json({ error: "Your cart is empty." }, { status: 400 });

  const orderNumber = newOrderNumber();
  const order = { orderNumber, items, total, details: details as CheckoutDetails };
  const reply = Response.json({ orderNumber, message: orderMessage(order) });

  // A bot filled in the hidden field: answer as usual so it learns nothing, but don't save.
  if (filledHoneypot(body.details)) return reply;
  // Checked after the fields, since each Turnstile token can only be checked once.
  if ((await verifyTurnstile(body.turnstileToken, request.headers.get("CF-Connecting-IP"))) === "failed") return BOT_CHECK_FAILED();

  after(() => saveOrder(order));
  return reply;
}
