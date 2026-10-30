import { getProduct } from "@/data/products";
import { appendRecord } from "@/lib/store-json";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter ("newsletter") and "Notify me" (product slug) sign-ups. */
export async function POST(request: Request) {
  let body: { email?: unknown; topic?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const topic = typeof body.topic === "string" ? body.topic : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (topic !== "newsletter" && !getProduct(topic)) {
    return Response.json({ error: "Unknown sign-up." }, { status: 400 });
  }
  // TODO: send to the email service (e.g. Mailchimp / Brevo / Resend audience).
  await appendRecord("subscribers", { email, topic });
  return Response.json({ ok: true });
}
