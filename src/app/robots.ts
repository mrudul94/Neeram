import type { MetadataRoute } from "next";
import { site } from "@/data/content";
import { isSiteLive, robotsRules } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return robotsRules(isSiteLive(), site.url);
}
