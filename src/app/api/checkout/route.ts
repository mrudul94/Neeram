import { newOrderNumber, orderMessage, priceLines, validateDetails, type CheckoutDetails, type CheckoutLine } from "@/lib/checkout";
import { appendRecord } from "@/lib/store-json";

/**
 * Records an order and returns the message the customer sends us on WhatsApp (or by SMS,
 * email or phone). No payment is taken on the site: customers pay before delivery, after we confirm.
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
  const message = orderMessage({ orderNumber, items, total, details: details as CheckoutDetails });
  await appendRecord("orders", { orderNumber, status: "awaiting-message", items, total, details });
  return Response.json({ orderNumber, message });
}
