import { describe, expect, it } from "vitest";
import { verifyTurnstile } from "./turnstile";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Stands in for Cloudflare's siteverify: answers with `reply`, or "network" / "hang". */
function harness(env: Record<string, string>, reply: { status?: number; success?: boolean } | "network" | "hang" = { success: true }) {
  const calls: { url: string; body: URLSearchParams }[] = [];
  const logged: string[] = [];
  const deps = {
    env,
    timeoutMs: 50,
    logError: (...args: unknown[]) => void logged.push(args.join(" ")),
    fetch: (async (url: string | URL | Request, init: RequestInit = {}) => {
      calls.push({ url: String(url), body: new URLSearchParams(String(init.body)) });
      if (reply === "network") throw new TypeError("fetch failed");
      if (reply === "hang") return new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(init.signal!.reason)));
      return Response.json({ success: reply.success ?? false }, { status: reply.status ?? 200 });
    }) as typeof fetch,
  };
  return { deps, calls, logged };
}

const live = { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "0x-secret" };

describe("verifyTurnstile", () => {
  it("passes a token Cloudflare accepts, sending the secret, token and visitor IP", async () => {
    const h = harness(live, { success: true });
    expect(await verifyTurnstile("tok", "203.0.113.7", h.deps)).toBe("passed");
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0].url).toBe(SITEVERIFY);
    expect(Object.fromEntries(h.calls[0].body)).toEqual({ secret: "0x-secret", response: "tok", remoteip: "203.0.113.7" });
  });

  it("fails a token Cloudflare rejects", async () => {
    expect(await verifyTurnstile("tok", null, harness(live, { success: false }).deps)).toBe("failed");
  });

  it.each([undefined, "", 42, "x".repeat(2049)])("fails a missing or malformed token (%j) without asking Cloudflare", async (token) => {
    const h = harness(live);
    expect(await verifyTurnstile(token, null, h.deps)).toBe("failed");
    expect(h.calls).toEqual([]);
  });

  it("leaves out the IP when it's unknown", async () => {
    const h = harness(live);
    await verifyTurnstile("tok", null, h.deps);
    expect(h.calls[0].body.has("remoteip")).toBe(false);
  });

  it.each([["network", "network"], ["a 500", { status: 500 }], ["a timeout", "hang"]] as const)(
    "lets the request through when siteverify can't be reached (%s), and logs it",
    async (_, reply) => {
      const h = harness(live, reply);
      expect(await verifyTurnstile("tok", null, h.deps)).toBe("unavailable");
      expect(h.logged.join(" ")).toContain("TURNSTILE CHECK UNAVAILABLE");
    },
  );

  it("skips the check when no secret is set, warning in production", async () => {
    const h = harness({ NODE_ENV: "production" });
    expect(await verifyTurnstile("tok", null, h.deps)).toBe("not-set-up");
    expect(h.calls).toEqual([]);
    expect(h.logged.join(" ")).toContain("TURNSTILE NOT SET UP");
  });

  it("skips the check quietly in development", async () => {
    const h = harness({ NODE_ENV: "development" });
    expect(await verifyTurnstile(undefined, null, h.deps)).toBe("not-set-up");
    expect(h.logged).toEqual([]);
  });
});
