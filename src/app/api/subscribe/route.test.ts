import { generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Capture work scheduled with after() instead of running it, as Next does once the response is sent.
const scheduled: (() => unknown)[] = [];
vi.mock("next/server", () => ({ after: (task: () => unknown) => void scheduled.push(task) }));

const { POST } = await import("./route");

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });

const subscribe = (body: unknown) => POST(new Request("http://localhost/api/subscribe", { method: "POST", body: JSON.stringify(body) }));

/** Runs the scheduled save with no sheet set up in production, and returns what it logged. */
async function savedRecord() {
  vi.stubEnv("GOOGLE_SHEET_ID", "");
  vi.stubEnv("NODE_ENV", "production");
  const logged: unknown[] = [];
  vi.spyOn(console, "error").mockImplementation((...args) => void logged.push(...args));
  await scheduled[0]();
  return logged.join(" ");
}

describe("POST /api/subscribe", () => {
  const googleCalls: string[] = [];
  const siteverify = { calls: 0, success: true };

  beforeEach(() => {
    scheduled.length = 0;
    googleCalls.length = 0;
    vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "orders@neeram.iam.gserviceaccount.com");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", privateKey);
    vi.stubEnv("GOOGLE_SHEET_ID", "1AbC");
    vi.stubEnv("ORDERS_TEST_MODE", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    siteverify.calls = 0;
    siteverify.success = true;
    // Turnstile answers siteverify.success; Google never answers: if the response waited for
    // the sheet, it would never arrive.
    vi.stubGlobal("fetch", (url: string) => {
      if (String(url).includes("siteverify")) {
        siteverify.calls++;
        return Promise.resolve(Response.json({ success: siteverify.success }));
      }
      googleCalls.push(String(url));
      return new Promise(() => {});
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("confirms the sign-up without waiting for the sheet", async () => {
    const res = await subscribe({ email: "anu@example.com", topic: "newsletter", page: "/about" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(googleCalls).toEqual([]);
    expect(scheduled).toHaveLength(1);
  });

  it("saves the email trimmed and lower-cased, with the page", async () => {
    await subscribe({ email: "  Anu@Example.COM ", topic: "turmeric", page: "/products/turmeric" });
    const record = await savedRecord();
    expect(record).toContain('"email":"anu@example.com"');
    expect(record).toContain('"topic":"turmeric"');
    expect(record).toContain('"page":"/products/turmeric"');
  });

  it.each(["https://evil.example/", "/about?x=<script>", "about", "/" + "a".repeat(300), 42])("drops the page %j", async (page) => {
    await subscribe({ email: "anu@example.com", topic: "newsletter", page });
    expect(await savedRecord()).toContain('"page":""');
  });

  it.each(["", "anu", "anu@example", `${"a".repeat(250)}@example.com`])("rejects the email %j", async (email) => {
    const res = await subscribe({ email, topic: "newsletter" });
    expect(res.status).toBe(400);
    expect(scheduled).toEqual([]);
  });

  it("answers a bot that filled in the hidden website field as if it worked, but saves nothing", async () => {
    const res = await subscribe({ email: "anu@example.com", topic: "newsletter", page: "/", website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(scheduled).toEqual([]);
  });

  describe("with Turnstile set up", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "0x-secret"));

    it("accepts a sign-up whose Turnstile token Cloudflare passes", async () => {
      const res = await subscribe({ email: "anu@example.com", topic: "newsletter", turnstileToken: "tok" });
      expect(res.status).toBe(200);
      expect(scheduled).toHaveLength(1);
    });

    it("turns away a sign-up whose token Cloudflare rejects, saving nothing", async () => {
      siteverify.success = false;
      const res = await subscribe({ email: "anu@example.com", topic: "newsletter", turnstileToken: "tok" });
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({ code: "bot-check" });
      expect(scheduled).toEqual([]);
    });

    it("checks the email first, so a typo doesn't use up the one-time token", async () => {
      const res = await subscribe({ email: "anu@", topic: "newsletter", turnstileToken: "tok" });
      expect(res.status).toBe(400);
      expect(siteverify.calls).toBe(0);
    });
  });

  it("rejects an unknown topic", async () => {
    const res = await subscribe({ email: "anu@example.com", topic: "ghee" });
    expect(res.status).toBe(400);
    expect(scheduled).toEqual([]);
  });

  it("rejects a body that isn't JSON", async () => {
    const res = await POST(new Request("http://localhost/api/subscribe", { method: "POST", body: "email=anu" }));
    expect(res.status).toBe(400);
  });
});
