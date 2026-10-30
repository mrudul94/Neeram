import { newOrderNumber, priceLines, validateDetails, type CheckoutDetails, type CheckoutLine } from "@/lib/checkout";
import { appendRecord } from "@/lib/store-json";

/**
 * Creates an order. With RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET set (and every price known)
 * it creates a Razorpay order for the client to pay; otherwise it returns a mock order
 * that goes straight to the thank-you page.
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
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && total !== null) {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ amount: total * 100, currency: "INR", receipt: orderNumber, notes: { email: details.email } }),
    });
    if (!res.ok) {
      console.error("Razorpay order failed", res.status, await res.text());
      return Response.json({ error: "Payment could not be started. Please try again." }, { status: 502 });
    }
    const order = (await res.json()) as { id: string; amount: number };
    await appendRecord("orders", { orderNumber, status: "pending", razorpayOrderId: order.id, items, total, details });
    return Response.json({ mode: "razorpay", orderNumber, keyId, razorpayOrderId: order.id, amount: order.amount });
  }

  await appendRecord("orders", { orderNumber, status: "mock-paid", items, total, details });
  return Response.json({ mode: "mock", orderNumber });
}
