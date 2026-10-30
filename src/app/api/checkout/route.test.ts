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

const checkout = () => POST(new Request("http://localhost/api/checkout", { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/checkout", () => {
  const googleCalls: string[] = [];

  beforeEach(() => {
    scheduled.length = 0;
    googleCalls.length = 0;
    vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "orders@neeram.iam.gserviceaccount.com");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", privateKey);
    vi.stubEnv("GOOGLE_SHEET_ID", "1AbC");
    vi.stubEnv("STORE_JSON_SUFFIX", "");
    // Google never answers: if the response waited for the sheet, it would never arrive.
    vi.stubGlobal("fetch", (url: string) => {
      googleCalls.push(String(url));
      return new Promise(() => {});
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
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
    const res = await POST(new Request("http://localhost/api/checkout", { method: "POST", body: JSON.stringify({ ...body, lines: [] }) }));
    expect(res.status).toBe(400);
    expect(scheduled).toEqual([]);
  });
});
