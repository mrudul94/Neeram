import { site } from "@/data/content";

/** What the contact form sends. Only these fields are read from a request. */
export type ContactMessage = {
  name: string;
  email: string;
  order: string;
  subject: string;
  message: string;
};

export const CONTACT_LIMITS: Record<keyof ContactMessage, number> = {
  name: 100,
  email: 254,
  order: 40,
  subject: 150,
  message: 5000,
};

const FIELDS = Object.keys(CONTACT_LIMITS) as (keyof ContactMessage)[];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Text fields only, trimmed; anything else in the request is ignored. */
export function pickContact(input: unknown): ContactMessage {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  return Object.fromEntries(FIELDS.map((f) => [f, typeof source[f] === "string" ? (source[f] as string).trim() : ""])) as ContactMessage;
}

/** Field name → what's wrong with it. Empty when the message can be sent. */
export function validateContact(m: ContactMessage): Partial<Record<keyof ContactMessage, string>> {
  const errors: Partial<Record<keyof ContactMessage, string>> = {};
  if (!m.name) errors.name = "Please enter your name.";
  if (!m.email) errors.email = "Please enter your email, so we can reply.";
  else if (!EMAIL.test(m.email)) errors.email = "Please check your email address.";
  if (!m.message) errors.message = "Please write your message.";
  for (const f of FIELDS) if (m[f].length > CONTACT_LIMITS[f]) errors[f] = `Please keep this under ${CONTACT_LIMITS[f]} characters.`;
  return errors;
}

/** One line, so nothing a visitor types can break the subject line. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

/** The email Neeram receives. Reply goes straight back to the visitor. */
export function contactEmail(m: ContactMessage, env: Record<string, string | undefined> = process.env) {
  const subject = oneLine(m.subject) || "Question from the website";
  return {
    // Until a domain is verified in Resend, only its test sender works (and only to the account's own email).
    from: env.CONTACT_EMAIL_FROM || "Neeram website <onboarding@resend.dev>",
    to: [env.CONTACT_EMAIL_TO || site.support.email || ""],
    reply_to: m.email,
    subject: `Website enquiry: ${subject}`,
    text: [
      m.message,
      "",
      "—",
      `Name: ${oneLine(m.name)}`,
      `Email: ${m.email}`,
      ...(m.order ? [`Order number: ${oneLine(m.order)}`] : []),
      "",
      "Sent from the contact form on the Neeram website. Press Reply to answer.",
    ].join("\n"),
  };
}

/**
 * - sent: Resend accepted it (or, in tests and local work without a key, it was logged instead).
 * - not-set-up: no RESEND_API_KEY on the live site.
 * - failed: Resend refused it or couldn't be reached.
 */
export type SendResult = "sent" | "not-set-up" | "failed";

type Deps = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  log?: (...args: unknown[]) => void;
  logError?: (...args: unknown[]) => void;
  timeoutMs?: number;
};

export async function sendContactEmail(m: ContactMessage, deps: Deps = {}): Promise<SendResult> {
  const { env = process.env, fetch: fetchFn = fetch, log = console.log, logError = console.error, timeoutMs = 8000 } = deps;
  const email = contactEmail(m, env);
  const key = env.RESEND_API_KEY;

  // Tests and local work without a key: show the email in the terminal instead of sending it.
  if (env.ORDERS_TEST_MODE === "1" || (!key && env.NODE_ENV !== "production")) {
    log(`[CONTACT EMAIL NOT SENT: test or local run]\n${email.subject}\n${email.text}`);
    return "sent";
  }
  if (!key) {
    logError("[RESEND NOT SET UP] RESEND_API_KEY is missing; contact message not sent.");
    return "not-set-up";
  }
  if (!email.to[0]) {
    logError("[CONTACT EMAIL] No address to send to: set CONTACT_EMAIL_TO or site.support.email.");
    return "not-set-up";
  }
  try {
    const res = await fetchFn("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`Resend answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return "sent";
  } catch (err) {
    // No personal details in the log: just why it failed.
    logError(`[CONTACT EMAIL FAILED] ${err instanceof Error ? err.message : String(err)}`);
    return "failed";
  }
}
