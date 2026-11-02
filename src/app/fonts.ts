import { Anton, Inter } from "next/font/google";
import localFont from "next/font/local";

// Only the headline face is preloaded; the rest load when text needs them, with display: swap.
export const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Separate, so the few italic captions don't cost every page a preloaded font.
export const interItalic = Inter({ subsets: ["latin"], style: "italic", variable: "--font-inter-italic", display: "swap", preload: false });

// Malayalam fonts cut down to the characters the site uses (fonts/malayalam-chars.txt), a fraction
// of their full size. A test fails if new text needs a character that isn't in them; then re-run
// the subset from the full fonts (Baloo Chettan 2 ExtraBold, Noto Sans Malayalam; both SIL OFL).
export const balooChettan = localFont({
  src: "./fonts/baloo-malayalam-subset.woff2",
  weight: "800",
  variable: "--font-baloo-chettan",
  display: "swap",
  preload: false,
});

export const notoMalayalam = localFont({
  src: "./fonts/noto-malayalam-subset.woff2",
  weight: "100 900",
  variable: "--font-noto-ml",
  display: "swap",
  preload: false,
});

// The rupee sign lives in Inter's and Anton's extended sets, so one ₹ would pull in 84 KB and 20 KB
// fonts. These hold just that glyph, cut from those same fonts, and sit first in the font stacks.
export const interRupee = localFont({
  src: "./fonts/inter-rupee.woff2",
  weight: "100 900",
  variable: "--font-inter-rupee",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: [],
  declarations: [{ prop: "unicode-range", value: "U+20B9" }],
});

export const antonRupee = localFont({
  src: "./fonts/anton-rupee.woff2",
  weight: "400",
  variable: "--font-anton-rupee",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: [],
  declarations: [{ prop: "unicode-range", value: "U+20B9" }],
});

export const fontVariables = [anton, inter, interItalic, balooChettan, notoMalayalam, interRupee, antonRupee].map((f) => f.variable).join(" ");
