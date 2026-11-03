import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { CheckoutDetails } from "./checkout";
import { saveOrder } from "./records";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });

const sheetEnv = {
  NODE_ENV: "production",
  GOOGLE_SERVICE_ACCOUNT_EMAIL: "orders@neeram.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: privateKey,
  GOOGLE_SHEET_ID: "1AbC",
};

const order = {
  orderNumber: "NRM-UL032M",
  items: [{ slug: "coconut-oil", pack: "bottle-1l", name: "Coconut Oil (1 L bottle)", qty: 2, unitPrice: 260 }],
  total: 520,
  details: { phone: "9876543210", firstName: "Anu", lastName: "Thomas", street: "MG Road", city: "Kochi", pin: "682011", state: "Kerala" } as CheckoutDetails,
};

/**
 * Records everything a save does. Google answers each append with the next status in
 * `appendStatuses` (the last one repeats); "hang" never answers until the request is aborted,
 * and "network" fails as an unreachable server does.
 */
function harness(env: Record<string, string>, appendStatuses: (number | "hang" | "network")[] = [200]) {
  const appends: string[] = [];
  const localWrites: { file: string; record: Record<string, unknown> }[] = [];
  const errors: unknown[][] = [];
  const deps = {
    env,
    timeoutMs: 50,
    fetch: (async (url: string | URL | Request, init: RequestInit = {}) => {
      if (String(url).includes("oauth2")) return Response.json({ access_token: "tok" });
      appends.push(String(url));
      const status = appendStatuses[Math.min(appends.length, appendStatuses.length) - 1];
      if (status === "hang") {
        return new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(init.signal!.reason)));
      }
      if (status === "network") throw new TypeError("fetch failed");
      return new Response("{}", { status });
    }) as typeof fetch,
    appendLocal: async (file: string, record: Record<string, unknown>) => {
      localWrites.push({ file, record });
    },
    logError: (...args: unknown[]) => {
      errors.push(args);
    },
  };
  return { deps, appends, localWrites, errors };
}

describe("saveOrder", () => {
  it("appends the order to the sheet in production", async () => {
    const h = harness(sheetEnv);
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(1);
    expect(h.appends[0]).toContain("/spreadsheets/1AbC/values/A%3AP:append");
    expect(h.localWrites).toEqual([]);
    expect(h.errors).toEqual([]);
  });

  it.each([500, 503])("retries once after a %i from Google", async (status) => {
    const h = harness(sheetEnv, [status, 200]);
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(2);
    expect(h.errors).toEqual([]);
  });

  it("retries once after a network error", async () => {
    const h = harness(sheetEnv, ["network", 200]);
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(2);
    expect(h.errors).toEqual([]);
  });

  it.each([400, 403, 404])("doesn't retry a %i, which a retry can't fix, and logs the order at once", async (status) => {
    const h = harness(sheetEnv, [status, 200]);
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(1);
    expect(h.errors.flat().join(" ")).toContain("ORDER NOT SAVED TO SHEET");
  });

  it("gives up on an attempt that takes longer than the timeout, then retries", async () => {
    const h = harness(sheetEnv, ["hang", 200]);
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(2);
    expect(h.errors).toEqual([]);
  });

  it("logs the full order with a clear tag after two failed attempts, without throwing", async () => {
    const h = harness(sheetEnv, [500]);
    await expect(saveOrder(order, h.deps)).resolves.toBeUndefined();
    expect(h.appends).toHaveLength(2);
    const logged = h.errors.flat().join(" ");
    expect(logged).toContain("ORDER NOT SAVED TO SHEET");
    expect(logged).toContain("NRM-UL032M");
    expect(logged).toContain("MG Road");
  });

  it("saves and logs nothing in production when no sheet is set up", async () => {
    const h = harness({ NODE_ENV: "production" });
    await saveOrder(order, h.deps);
    expect(h.appends).toEqual([]);
    expect(h.localWrites).toEqual([]);
    expect(h.errors).toEqual([]);
  });

  it("never touches the sheet in test runs, even with credentials set", async () => {
    const h = harness({ ...sheetEnv, ORDERS_TEST_MODE: "1" });
    await saveOrder(order, h.deps);
    expect(h.appends).toEqual([]);
    expect(h.localWrites.map((w) => w.file)).toEqual(["orders"]);
    expect(h.errors).toEqual([]);
  });

  it("still saves to the sheet when only the file name suffix is set", async () => {
    const h = harness({ ...sheetEnv, STORE_JSON_SUFFIX: "test" });
    await saveOrder(order, h.deps);
    expect(h.appends).toHaveLength(1);
    expect(h.localWrites).toEqual([]);
  });

  it("keeps the local file log in development", async () => {
    const h = harness({ NODE_ENV: "development" });
    await saveOrder(order, h.deps);
    expect(h.localWrites).toEqual([{ file: "orders", record: expect.objectContaining({ orderNumber: "NRM-UL032M", total: 520 }) }]);
    expect(h.errors).toEqual([]);
  });
});
