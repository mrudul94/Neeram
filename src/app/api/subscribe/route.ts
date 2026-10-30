import { after } from "next/server";
import { getProduct } from "@/data/products";
import { filledHoneypot } from "@/lib/bot-check";
import { saveSignup } from "@/lib/records";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter ("newsletter") and "Notify me" (product slug) sign-ups, saved after the response. */
export async function POST(request: Request) {
  let body: { email?: unknown; topic?: unknown; page?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const topic = typeof body.topic === "string" ? body.topic : "";
  // The path the form was on, e.g. "/about"; anything else is dropped.
  const page = typeof body.page === "string" && /^\/[\w\-/]{0,200}$/.test(body.page) ? body.page : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (topic !== "newsletter" && !getProduct(topic)) {
    return Response.json({ error: "Unknown sign-up." }, { status: 400 });
  }
  // A bot filled in the hidden field: answer as usual so it learns nothing, but don't save.
  if (filledHoneypot(body)) return Response.json({ ok: true });
  // TODO: send to the email service (e.g. Mailchimp / Brevo / Resend audience).
  after(() => saveSignup({ email, topic, page }));
  return Response.json({ ok: true });
}
