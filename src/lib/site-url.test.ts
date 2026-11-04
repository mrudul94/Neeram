import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("uses the given URL in production", () => {
    expect(resolveSiteUrl("https://neeram.skaylon.workers.dev", "production")).toBe("https://neeram.skaylon.workers.dev");
  });

  it.each([undefined, "", "   "])("stops a production build when the URL is %j", (url) => {
    expect(() => resolveSiteUrl(url, "production")).toThrow("NEXT_PUBLIC_SITE_URL: it is missing");
  });

  it.each(["http://localhost:3000", "https://localhost", "http://127.0.0.1:3000", "http://0.0.0.0:3000", "http://[::1]:3000"])("stops a production build for %s", (url) => {
    expect(() => resolveSiteUrl(url, "production")).toThrow("points to this computer");
  });

  it.each(["neeram.skaylon.workers.dev", "ftp://neeram.in"])("stops a production build for %s", (url) => {
    expect(() => resolveSiteUrl(url, "production")).toThrow("NEXT_PUBLIC_SITE_URL");
  });

  it("doesn't mistake a domain that only starts with localhost for this computer", () => {
    expect(resolveSiteUrl("https://localhost.example.com", "production")).toBe("https://localhost.example.com");
  });

  it.each(["development", "test", undefined])("falls back to localhost outside production (%s)", (env) => {
    expect(resolveSiteUrl(undefined, env)).toBe("http://localhost:3000");
  });
});
