import type { Metadata } from "next";
import { products } from "@/data/products";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** Social-preview details every page shares (the root layout's defaults). */
export const sharedOpenGraph: OpenGraph = {
  siteName: "Neeram",
  type: "website",
  locale: "en_IN",
  images: [{ url: "/og-coconut-oil.jpg", width: 1200, height: 630, alt: "Neeram Coconut Oil, 500 ml" }],
};

/**
 * A page's canonical link and its og:url, which are the same address. A page's own openGraph
 * replaces the layout's whole openGraph, so the shared details are repeated here. Paths are
 * made absolute with metadataBase (the site URL).
 */
export function pageLinks(path: string, openGraph: OpenGraph = {}): Pick<Metadata, "alternates" | "openGraph"> {
  return { alternates: { canonical: path }, openGraph: { ...sharedOpenGraph, ...openGraph, url: path } };
}

/**
 * The site stays out of search until SITE_LIVE=1 is set where it's built. Read at build time,
 * so changing it needs a new build.
 */
export function isSiteLive(env: Record<string, string | undefined> = process.env) {
  return env.SITE_LIVE === "1" || env.SITE_LIVE === "true";
}

/**
 * The test site is not blocked here on purpose: its pages carry a noindex tag, and Google can
 * only obey that if it's allowed to read the page.
 */
export function robotsRules(live: boolean, url: string) {
  if (!live) return { rules: { userAgent: "*", allow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${url}/sitemap.xml` };
}

export function sitemapEntries(live: boolean, url: string) {
  if (!live) return [];
  const paths = ["", "/shop", "/about", "/help", "/privacy", "/terms", ...products.map((p) => `/products/${p.slug}`)];
  return paths.map((path) => ({ url: `${url}${path}` }));
}
