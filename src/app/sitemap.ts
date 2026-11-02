import type { MetadataRoute } from "next";
import { site } from "@/data/content";
import { isSiteLive, sitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(isSiteLive(), site.url);
}
