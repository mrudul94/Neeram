/** Hidden form field that people never see or fill in; bots that fill every field do. */
export const HONEYPOT_FIELD = "website";

/** Turnstile turned the request away; `code` tells the form to reset its widget. */
export const BOT_CHECK_FAILED = () =>
  Response.json({ error: "The security check didn't go through. Please try again.", code: "bot-check" }, { status: 400 });

/** True when `fields` (a form's values from the request) has the hidden field filled in. */
export function filledHoneypot(fields: unknown): boolean {
  const value = fields && typeof fields === "object" ? (fields as Record<string, unknown>)[HONEYPOT_FIELD] : undefined;
  return typeof value === "string" && value.trim() !== "";
}
