import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The dev badge defaults to bottom-left, where it covers the feature caption.
  devIndicators: { position: "bottom-right" },
  partialPrefetching: true,
  // Served as-is: every image in public/ is already a WebP sized for its largest use, so
  // Cloudflare needs no paid image resizing (see docs/LAUNCH_CHECKLIST.md).
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
