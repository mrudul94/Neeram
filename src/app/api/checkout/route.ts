import { after } from "next/server";
import { newOrderNumber, orderMessage, priceLines, validateDetails, type CheckoutDetails, type CheckoutLine } from "@/lib/checkout";
import { saveOrder } from "@/lib/records";

/**
 * Returns the message the customer sends us on WhatsApp (or by SMS, email or phone), then
 * records the order once the response is sent, so the customer never waits for Google.
 * No payment is taken on the site: customers pay before delivery, after we confirm.
 */
export async function POST(request: Request) {
  let body: { lines?: CheckoutLine[]; details?: Partial<CheckoutDetails> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const details = body.details ?? {};
  const errors = validateDetails(details);
  if (Object.keys(errors).length) return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });

  const { items, total } = priceLines(Array.isArray(body.lines) ? body.lines : []);
  if (!items.length) return Response.json({ error: "Your cart is empty." }, { status: 400 });

  const orderNumber = newOrderNumber();
  const order = { orderNumber, items, total, details: details as CheckoutDetails };
  after(() => saveOrder(order));
  return Response.json({ orderNumber, message: orderMessage(order) });
}
