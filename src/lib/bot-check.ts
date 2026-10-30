/** Hidden form field that people never see or fill in; bots that fill every field do. */
export const HONEYPOT_FIELD = "website";

/** True when `fields` (a form's values from the request) has the hidden field filled in. */
export function filledHoneypot(fields: unknown): boolean {
  const value = fields && typeof fields === "object" ? (fields as Record<string, unknown>)[HONEYPOT_FIELD] : undefined;
  return typeof value === "string" && value.trim() !== "";
}
