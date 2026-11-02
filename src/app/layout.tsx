import type { Metadata, Viewport } from "next";
import { CartDrawerLazy } from "@/components/CartDrawerLazy";
import { CookieNoticeLazy } from "@/components/CookieNoticeLazy";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/data/content";
import { isSiteLive } from "@/lib/seo";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Neeram Coconut Oil — Pure Coconut Oil from Kasaragod, Kerala",
    template: "%s · Neeram",
  },
  description:
    "Double-filtered coconut oil from Neeram, made at our own mill in Anakkallu, Kasaragod, Kerala. In clear bottles and packets, from 200 ml to 1 L.",
  // The test site stays out of search until SITE_LIVE is set (src/lib/seo.ts).
  ...(isSiteLive() ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    siteName: "Neeram",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-coconut-oil.jpg", width: 1200, height: 630, alt: "Neeram Coconut Oil, 500 ml" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#16130f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-50 bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        {children}
        <CartDrawerLazy />
        <SmoothScroll />
        <CookieNoticeLazy />
      </body>
    </html>
  );
}
