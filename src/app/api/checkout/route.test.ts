import { generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Capture work scheduled with after() instead of running it, as Next does once the response is sent.
const scheduled: (() => unknown)[] = [];
vi.mock("next/server", () => ({ after: (task: () => unknown) => void scheduled.push(task) }));

const { POST } = await import("./route");

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });

const body = {
  lines: [{ slug: "coconut-oil", qty: 2, pack: "bottle-1l" }],
  details: { phone: "98765 43210", firstName: "Anu", lastName: "Thomas", street: "MG Road", city: "Kochi", pin: "682011", state: "Kerala" },
};

const checkout = (b: unknown = body) => POST(new Request("http://localhost/api/checkout", { method: "POST", body: JSON.stringify(b) }));

describe("POST /api/checkout", () => {
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

  it("returns the WhatsApp message without waiting for the sheet", async () => {
    const res = await checkout();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderNumber).toMatch(/^NRM-/);
    expect(data.message).toContain("• 2 × Coconut Oil (1 L bottle): ₹ 520");
    expect(googleCalls).toEqual([]);
  });

  it("saves the order to the sheet after the response", async () => {
    await checkout();
    expect(scheduled).toHaveLength(1);
    void scheduled[0]();
    await vi.waitFor(() => expect(googleCalls).toContain("https://oauth2.googleapis.com/token"));
  });

  it("schedules nothing for a rejected order", async () => {
    const res = await checkout({ ...body, lines: [] });
    expect(res.status).toBe(400);
    expect(scheduled).toEqual([]);
  });

  it("answers a bot that filled in the hidden website field as if it worked, but saves nothing", async () => {
    const res = await checkout({ ...body, details: { ...body.details, website: "http://spam.example" } });
    expect(res.status).toBe(200);
    expect((await res.json()).orderNumber).toMatch(/^NRM-/);
    expect(scheduled).toEqual([]);
  });

  describe("with Turnstile set up", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "0x-secret"));

    it("accepts an order whose Turnstile token Cloudflare passes", async () => {
      const res = await checkout({ ...body, turnstileToken: "tok" });
      expect(res.status).toBe(200);
      expect(siteverify.calls).toBe(1);
      expect(scheduled).toHaveLength(1);
    });

    it("turns away an order whose token Cloudflare rejects, saving nothing", async () => {
      siteverify.success = false;
      const res = await checkout({ ...body, turnstileToken: "tok" });
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({ code: "bot-check" });
      expect(scheduled).toEqual([]);
    });

    it("turns away an order with no token", async () => {
      const res = await checkout(body);
      expect(res.status).toBe(400);
      expect(scheduled).toEqual([]);
    });

    it("checks the fields first, so a typo doesn't use up the one-time token", async () => {
      const res = await checkout({ ...body, details: { ...body.details, pin: "1" }, turnstileToken: "tok" });
      expect(res.status).toBe(400);
      expect(siteverify.calls).toBe(0);
    });

    it("answers a honeypot bot without asking Cloudflare", async () => {
      const res = await checkout({ ...body, details: { ...body.details, website: "x" } });
      expect(res.status).toBe(200);
      expect(siteverify.calls).toBe(0);
      expect(scheduled).toEqual([]);
    });
  });

  it("rejects a field that isn't text, instead of failing", async () => {
    const res = await checkout({ ...body, details: { ...body.details, firstName: 123 } });
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toHaveProperty("firstName");
  });

  it("saves only the checkout fields, never extra ones sent with the order", async () => {
    // No sheet set up in production: the order is logged, which shows exactly what is saved.
    vi.stubEnv("GOOGLE_SHEET_ID", "");
    vi.stubEnv("NODE_ENV", "production");
    const logged: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...args) => void logged.push(...args));

    await checkout({ ...body, details: { ...body.details, smuggled: "x".repeat(5000) } });
    await scheduled[0]();

    const record = logged.join(" ");
    expect(record).toContain("NRM-");
    expect(record).toContain("MG Road");
    expect(record).not.toContain("smuggled");
  });
});
