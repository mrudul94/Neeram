# Content the client needs to supply

Everything below is a placeholder on the live site today. File references show where to change it.

## Prices and product facts — `src/data/products.ts`

- [x] **Coconut Oil prices** — 1 L ₹260, 500 ml ₹130, 200 ml ₹70, 500 ml packet ₹125.
- [ ] Prices for the five spices (needed when each launches).
- [ ] Coconut oil **ingredients** wording for the listing (currently "100% coconut oil. [Confirm …]") — product page,
      *Ingredients* accordion.
- [ ] Confirm all spec-table values (Also called / Goes into / How to use / Container) for every product. Spice specs
      for Black Pepper, Tamarind and Shankupushpam were written to fill the layout.
- [ ] Spice product descriptions for Black Pepper, Tamarind and Shankupushpam (the design only had the one-line shop
      text).

## Copy written for Phase 1 (approve or replace)

- [ ] Home hero: headline "THE OIL EVERY KERALA KITCHEN STARTS WITH." (placeholder from the brief) and sub-copy —
      `src/data/content.ts` → `heroSlides`.
- [ ] Coconut oil feature: headline "THE FIRST THING IN THE PAN.", body copy and spec rows —
      `src/components/home/OilFeature.tsx`.
- [ ] "A short shelf, on purpose." intro (adapted to say spices are coming soon) — `src/app/(site)/page.tsx`.
- [ ] "Look before you open." callouts: *Double filtered*, *Clear bottle*, *Neeram label* text —
      `src/components/home/LookBeforeYouOpen.tsx`.
- [ ] "The tempering that starts it." method text on the product page — `src/app/(site)/products/[slug]/page.tsx`.

## Brand and business

- [ ] **About Neeram** text: "[Two or three sentences about who started Neeram …]" — `src/data/content.ts` → `aboutText`.
- [ ] **Business address** for the footer: "[Business address, Kerala]" — `src/data/content.ts` → `address`.
- [ ] **Logo as SVG** (optional). The supplied PNG logo is in use (`public/images/logo/neeram-logo.png`, a trimmed
      480 px copy of `public/images/Main logo/`); an SVG would stay sharper at every size — `src/components/Logo.tsx`.
- [ ] **Social links** (Instagram, Facebook, YouTube, WhatsApp). They show as plain text until a URL is set —
      `src/data/content.ts` → `socials`.
- [ ] Favicon / app icon (`src/app/favicon.ico` is the Next.js default).

## Legal and help pages — `src/app/(site)/help/page.tsx`

- [ ] Shipping & delivery: areas, times, charges.
- [ ] Returns & refunds policy.
- [ ] How to track an order.
- [ ] Contact details: phone, WhatsApp, email, hours.
- [ ] Privacy policy.
- [ ] Terms of service, including **FSSAI licence number** and registered business address (the bottle label shows
      FSSAI 11321014000289 and Govindan Oil Mill, Kasaragod — confirm what should appear on the site).
      Set it as `fssaiLicence` in `src/data/content.ts`; it then shows in the footer and on product pages.
- [ ] **Certificates** (FSSAI licence, Agmark, ISO 22000, organic, …) — scans of Neeram's own certificates for the
      About page. Add each to `certificates` in `src/data/content.ts` and the image to `public/images/certificates/`;
      the "Certified & licensed" strip appears once there is one. Do **not** use the certificates on
      neeram.vercel.app/about: they belong to other companies (Marudhar Impex, ISSCO Inc., Zongle Therapeutics).

## Checkout — `src/components/checkout/CheckoutForm.tsx`

- [ ] Standard delivery: time and charge ("[Delivery time and charge]").
- [ ] Second delivery option, if any ("[Second delivery option, if offered]" is shown disabled).
- [ ] Discount codes — the field is there but replies "not available yet".
- [ ] Razorpay account and keys (test, then live).
- [ ] Order emails / SMS — the thank-you page promises them; nothing is sent yet.

## Photography

All non-bottle imagery was cropped from the Figma export and is low resolution for large use:

- [ ] Hero / tempering photo (`public/images/photos/tempering-pan.webp`, only 720 × 680 — upscaled in the hero).
- [ ] Sambar photo for "What goes into what." (`public/images/photos/sambar.webp`, 380 × 469).
- [ ] Studio cut-outs of the five spice jars (current ones are ~280 × 590, extracted from the design).
- [ ] Optional: a lifestyle photo for the dark left panel of the coconut-oil feature (currently a plain stage, which
      keeps the landing bottle readable).
- [ ] Coconut oil gallery: real close-ups (label and cap crops are currently cut from the supplied bottle photo).

## Services to connect

- [ ] Email service for newsletter + "Notify me" sign-ups (currently written to `data/subscribers.jsonl` locally,
      only logged on Vercel) — `src/app/api/subscribe/route.ts`.
- [ ] Order storage / admin (orders are written to `data/orders.jsonl` locally) — `src/app/api/checkout/route.ts`.

## Phase 2

- [ ] Our story page, The kitchen page and recipe pages. Until then "The kitchen" and "Our story" links point at the
      home-page sections, and "The recipe" points at the tempering band on the coconut oil page.
- [ ] Accounts — the design's account icon is left out of the header for Phase 1, because there are no accounts yet.
