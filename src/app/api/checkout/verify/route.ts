import { createHmac, timingSafeEqual } from "node:crypto";
import { appendRecord } from "@/lib/store-json";

/** Verifies the Razorpay payment signature returned to the browser after payment. */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return Response.json({ error: "Payments are not configured." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;
  if (typeof razorpay_order_id !== "string" || typeof razorpay_payment_id !== "string" || typeof razorpay_signature !== "string") {
    return Response.json({ error: "Invalid payment response" }, { status: 400 });
  }

  const expected = createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  // TODO: confirm with a Razorpay webhook (payment.captured) as well before fulfilling.
  await appendRecord("orders", { orderNumber, status: "paid", razorpay_order_id, razorpay_payment_id });
  return Response.json({ ok: true });
}
