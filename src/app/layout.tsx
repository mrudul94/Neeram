import type { Metadata, Viewport } from "next";
import { CartDrawer } from "@/components/CartDrawer";
import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/data/content";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Neeram — Kerala coconut oil and spices",
    template: "%s · Neeram",
  },
  description:
    "Neeram Coconut Oil: double-filtered coconut oil in a clear bottle, with Malabar tamarind, turmeric, black pepper, tamarind and shankupushpam coming soon.",
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
        <Loader />
        <a href="#main" className="sr-only z-50 bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        {children}
        <CartDrawer />
        <SmoothScroll />
      </body>
    </html>
  );
}
