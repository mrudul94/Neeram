import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";
const TURNSTILE = "https://challenges.cloudflare.com";

// The only third-party code in the browser is Turnstile, on checkout. Scripts may be inline because
// Next.js streams page data in inline <script> tags; a per-request nonce would end static rendering.
// The dev server also needs eval and a websocket for hot reload.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE}${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  `frame-src ${TURNSTILE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
