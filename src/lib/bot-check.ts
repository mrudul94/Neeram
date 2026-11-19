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

/**
 * True when a browser says the request came from another website (Sec-Fetch-Site: cross-site),
 * e.g. a page elsewhere that makes its visitors post to our forms. Browsers set this header and
 * page scripts can't change it. Requests without it (curl, old browsers) are left to the other checks.
 */
export function fromOtherSite(request: Request): boolean {
  return request.headers.get("sec-fetch-site") === "cross-site";
}

export const CROSS_SITE_REFUSED = () => Response.json({ error: "Please send this from the Neeram website." }, { status: 403 });
