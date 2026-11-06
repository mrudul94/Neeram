import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { isSiteLive, pageLinks, robotsRules, sharedOpenGraph, sitemapEntries } from "./seo";

const url = "https://neeram.example";

describe("isSiteLive", () => {
  it.each([undefined, "", "0", "false"])("treats SITE_LIVE=%j as the test site", (SITE_LIVE) => {
    expect(isSiteLive({ SITE_LIVE })).toBe(false);
  });

  it.each(["1", "true"])("treats SITE_LIVE=%j as live", (SITE_LIVE) => {
    expect(isSiteLive({ SITE_LIVE })).toBe(true);
  });
});

describe("pageLinks", () => {
  it("gives the page's own address as both its canonical link and og:url", () => {
    const links = pageLinks("/about");
    expect(links.alternates).toEqual({ canonical: "/about" });
    expect(links.openGraph).toMatchObject({ url: "/about" });
  });

  it("keeps the shared preview details alongside a page's own", () => {
    const links = pageLinks("/products/turmeric", { title: "Turmeric · Neeram", images: [{ url: "/t.webp" }] });
    expect(links.openGraph).toMatchObject({ ...sharedOpenGraph, title: "Turmeric · Neeram", images: [{ url: "/t.webp" }], url: "/products/turmeric" });
  });
});

describe("robotsRules", () => {
  it("lets crawlers read the test site, so they can see its noindex tag", () => {
    const robots = robotsRules(false, url);
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(robots.sitemap).toBeUndefined();
  });

  it("points to the sitemap and keeps the API out when live", () => {
    const robots = robotsRules(true, url);
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(robots.sitemap).toBe(`${url}/sitemap.xml`);
  });
});

describe("sitemapEntries", () => {
  it("is empty on the test site", () => {
    expect(sitemapEntries(false, url)).toEqual([]);
  });

  it("lists the main pages and every product when live", () => {
    const urls = sitemapEntries(true, url).map((e) => e.url);
    expect(urls).toEqual(expect.arrayContaining([url, `${url}/shop`, `${url}/about`, `${url}/help`, `${url}/privacy`, `${url}/terms`]));
    for (const p of products) expect(urls).toContain(`${url}/products/${p.slug}`);
  });

  it("leaves out checkout, which is not for search", () => {
    expect(sitemapEntries(true, url).map((e) => e.url)).not.toContain(`${url}/checkout`);
  });
});
