import { products } from "@/data/products";

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
