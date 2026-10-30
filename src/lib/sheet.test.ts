import { createVerify, generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { CheckoutDetails, PricedItem } from "./checkout";
import { appendRow, NEWSLETTER_RANGE, ORDER_SHEET_HEADERS, ORDERS_RANGE, orderRow, SIGNUP_SHEET_HEADERS, sheetConfig, signupRow } from "./sheet";

const details: CheckoutDetails = {
  email: "",
  phone: "98765-43210",
  firstName: "Anu",
  lastName: "Thomas",
  street: "Kallarakkal House, MG Road",
  city: "Kochi",
  pin: "682011",
  state: "Kerala",
  landmark: "",
  note: "",
};

const oneLitre: PricedItem = { slug: "coconut-oil", pack: "bottle-1l", name: "Coconut Oil (1 L bottle)", qty: 2, unitPrice: 260 };

describe("orderRow", () => {
  it("fills one cell per column, in the sheet's column order", () => {
    const row = orderRow({
      orderNumber: "NRM-UL032M",
      items: [oneLitre],
      total: 520,
      details: { ...details, email: "anu@example.com", landmark: "St. Mary's Church", note: "Ring twice" },
      at: new Date("2026-10-30T06:18:43Z"),
    });
    expect(row).toEqual([
      "NRM-UL032M",
      "30 Oct 2026, 11:48",
      "Anu Thomas",
      "+91 98765 43210",
      "anu@example.com",
      "Kallarakkal House, MG Road",
      "St. Mary's Church",
      "Kochi",
      "Kerala",
      "682011",
      "Coconut Oil · 1 L bottle · 2",
      520,
      "",
      "",
      "",
      "Ring twice",
    ]);
    expect(row).toHaveLength(ORDER_SHEET_HEADERS.length);
  });

  it("writes the time in India, moving the date past midnight", () => {
    const row = orderRow({ orderNumber: "NRM-1", items: [oneLitre], total: 520, details, at: new Date("2026-10-30T20:00:00Z") });
    expect(row[1]).toBe("31 Oct 2026, 01:30");
  });

  it("puts each item on its own line within the cell", () => {
    const row = orderRow({
      orderNumber: "NRM-1",
      items: [oneLitre, { slug: "coconut-oil", pack: "pouch-500", name: "Coconut Oil (500 ml packet)", qty: 1, unitPrice: 125 }],
      total: 645,
      details,
      at: new Date(),
    });
    expect(row[10]).toBe("Coconut Oil · 1 L bottle · 2\nCoconut Oil · 500 ml packet · 1");
  });

  it("uses the product's size for products sold in one size", () => {
    const row = orderRow({ orderNumber: "NRM-1", items: [{ slug: "turmeric", name: "Turmeric", qty: 3, unitPrice: 90 }], total: 270, details, at: new Date() });
    expect(row[10]).toBe("Turmeric · 200 ml · 3");
  });

  it("leaves optional fields blank when only spaces were typed", () => {
    const row = orderRow({ orderNumber: "NRM-1", items: [oneLitre], total: 520, details: { ...details, email: " ", landmark: "  ", note: " " }, at: new Date() });
    expect([row[4], row[6], row[15]]).toEqual(["", "", ""]);
  });

  it("leaves the subtotal blank while a price is unknown", () => {
    const row = orderRow({ orderNumber: "NRM-1", items: [{ ...oneLitre, unitPrice: null }], total: null, details, at: new Date() });
    expect(row[11]).toBe("");
  });

  it("leaves Delivery, Total and Status blank for the shop to fill in", () => {
    const row = orderRow({ orderNumber: "NRM-1", items: [oneLitre], total: 520, details, at: new Date() });
    expect([row[12], row[13], row[14]]).toEqual(["", "", ""]);
    expect(ORDER_SHEET_HEADERS.slice(12, 15)).toEqual(["Delivery", "Total", "Status"]);
  });
});

describe("signupRow", () => {
  it("writes the time in India, the email and the page", () => {
    const row = signupRow({ email: "anu@example.com", topic: "newsletter", page: "/about", at: new Date("2026-10-30T06:18:43Z") });
    expect(row).toEqual(["30 Oct 2026, 11:48", "anu@example.com", "/about"]);
    expect(row).toHaveLength(SIGNUP_SHEET_HEADERS.length);
  });

  it("names the product for a Notify me sign-up, since product pages also have the footer newsletter", () => {
    const row = signupRow({ email: "anu@example.com", topic: "turmeric", page: "/products/turmeric", at: new Date() });
    expect(row[2]).toBe("/products/turmeric (Notify me: Turmeric)");
  });

  it("still names the product when the page is unknown", () => {
    const row = signupRow({ email: "anu@example.com", topic: "turmeric", page: "", at: new Date() });
    expect(row[2]).toBe("(Notify me: Turmeric)");
  });
});

describe("sheetConfig", () => {
  const env = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "orders@neeram.iam.gserviceaccount.com",
    GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
    GOOGLE_SHEET_ID: "1AbC",
  };

  it("reads the three values", () => {
    expect(sheetConfig(env)).toMatchObject({ email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, sheetId: "1AbC" });
  });

  it("turns \\n written as text back into line breaks in the key", () => {
    expect(sheetConfig(env)?.privateKey).toBe("-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n");
  });

  it("drops quotes pasted around the key", () => {
    expect(sheetConfig({ ...env, GOOGLE_PRIVATE_KEY: `"${env.GOOGLE_PRIVATE_KEY}"` })?.privateKey).toMatch(/^-----BEGIN/);
  });

  it.each(["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"])("is null while %s is missing", (name) => {
    expect(sheetConfig({ ...env, [name]: "" })).toBeNull();
  });
});

describe("appendRow", () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  const config = { email: "orders@neeram.iam.gserviceaccount.com", privateKey, sheetId: "1AbC" };
  const row = ["NRM-1", "30 Oct 2026, 11:48"];

  /** Stands in for Google: a token endpoint and the Sheets API. */
  function fakeGoogle(appendStatus = 200) {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetch = async (url: string | URL | Request, init: RequestInit = {}) => {
      calls.push({ url: String(url), init });
      if (String(url) === "https://oauth2.googleapis.com/token") return Response.json({ access_token: "tok" });
      return new Response("{}", { status: appendStatus });
    };
    return { calls, fetch: fetch as typeof globalThis.fetch };
  }

  const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString());

  it("asks for a token with only the Sheets scope, signed with the service account key", async () => {
    const google = fakeGoogle();
    await appendRow(config, ORDERS_RANGE, row, { fetch: google.fetch });

    const assertion = new URLSearchParams(String(google.calls[0].init.body)).get("assertion")!;
    const [header, claims, signature] = assertion.split(".");
    expect(decode(claims)).toMatchObject({
      iss: config.email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
    });
    const verify = createVerify("RSA-SHA256").update(`${header}.${claims}`);
    expect(verify.verify(publicKey, signature, "base64url")).toBe(true);
  });

  it("appends orders as plain text after the last row of the first tab, without reading the sheet", async () => {
    const google = fakeGoogle();
    await appendRow(config, ORDERS_RANGE, row, { fetch: google.fetch });

    expect(google.calls).toHaveLength(2);
    const append = google.calls[1];
    const url = new URL(append.url);
    expect(url.pathname).toBe("/v4/spreadsheets/1AbC/values/A%3AP:append");
    // RAW stores what the customer typed as text, so "=…" can't become a formula.
    expect(url.searchParams.get("valueInputOption")).toBe("RAW");
    expect(url.searchParams.get("insertDataOption")).toBe("INSERT_ROWS");
    expect(append.init.method).toBe("POST");
    expect(new Headers(append.init.headers).get("authorization")).toBe("Bearer tok");
    expect(JSON.parse(String(append.init.body))).toEqual({ values: [row] });
  });

  it("appends sign-ups to the Newsletter tab", async () => {
    const google = fakeGoogle();
    await appendRow(config, NEWSLETTER_RANGE, row, { fetch: google.fetch });
    expect(new URL(google.calls[1].url).pathname).toBe("/v4/spreadsheets/1AbC/values/Newsletter!A%3AC:append");
  });

  it("passes the abort signal to both requests", async () => {
    const google = fakeGoogle();
    const signal = new AbortController().signal;
    await appendRow(config, ORDERS_RANGE, row, { fetch: google.fetch, signal });
    expect(google.calls.map((c) => c.init.signal)).toEqual([signal, signal]);
  });

  it("throws when Google refuses the row", async () => {
    await expect(appendRow(config, ORDERS_RANGE, row, { fetch: fakeGoogle(403).fetch })).rejects.toThrow(/403/);
  });
});
