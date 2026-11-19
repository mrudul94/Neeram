import { describe, expect, it } from "vitest";
import { filledHoneypot, fromOtherSite } from "./bot-check";

const req = (headers: Record<string, string>) => new Request("https://neeram.in/api/contact", { method: "POST", headers });

describe("fromOtherSite", () => {
  it("refuses only what the browser marks as cross-site", () => {
    expect(fromOtherSite(req({ "Sec-Fetch-Site": "cross-site" }))).toBe(true);
    for (const value of ["same-origin", "same-site", "none"]) expect(fromOtherSite(req({ "Sec-Fetch-Site": value }))).toBe(false);
    expect(fromOtherSite(req({}))).toBe(false);
  });
});

describe("filledHoneypot", () => {
  it("is true only when the hidden field has text", () => {
    expect(filledHoneypot({ website: "x" })).toBe(true);
    expect(filledHoneypot({ website: " " })).toBe(false);
    expect(filledHoneypot(null)).toBe(false);
  });
});
