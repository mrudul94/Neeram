const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5000;

/**
 * - passed / failed: Cloudflare's verdict on the token.
 * - unavailable: siteverify couldn't be reached; the request is let through (the honeypot
 *   still applies) rather than turning away customers during a Cloudflare hiccup.
 * - not-set-up: no TURNSTILE_SECRET_KEY, e.g. local development.
 */
export type TurnstileResult = "passed" | "failed" | "unavailable" | "not-set-up";

type Deps = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  logError?: (...args: unknown[]) => void;
  timeoutMs?: number;
};

/** Checks a Turnstile token from a form with Cloudflare. Only "failed" should block the request. */
export async function verifyTurnstile(token: unknown, ip: string | null, deps: Deps = {}): Promise<TurnstileResult> {
  const { env = process.env, fetch: fetchFn = fetch, logError = console.error, timeoutMs = TIMEOUT_MS } = deps;
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (env.NODE_ENV === "production") logError("[TURNSTILE NOT SET UP] TURNSTILE_SECRET_KEY is missing; bot check skipped.");
    return "not-set-up";
  }
  // Tokens are at most 2048 characters.
  if (typeof token !== "string" || !token || token.length > 2048) return "failed";

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetchFn(SITEVERIFY, { method: "POST", body, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`siteverify answered ${res.status}`);
    const { success } = (await res.json()) as { success?: boolean };
    return success ? "passed" : "failed";
  } catch (err) {
    logError(`[TURNSTILE CHECK UNAVAILABLE] ${err instanceof Error ? err.message : String(err)}; request let through.`);
    return "unavailable";
  }
}
