# Content the client needs to supply

Everything below is a placeholder on the live site today. File references show where to change it.

## Prices and product facts — `src/data/products.ts`

- [x] **Coconut Oil prices (MRP)** — 1 L bottle ₹340, 1 L packet ₹330, 500 ml bottle ₹200, 500 ml packet ₹190, 200 ml bottle ₹100.
- [ ] Prices for the five spices (needed when each launches).
- [x] Coconut oil **ingredients** — "100% coconut oil." Product page, *Ingredients* accordion.
- [x] **How the coconut oil is made** — mechanical dryer (12 + 8 hours), expeller, filtered twice —
      `src/data/content.ts` → `oilProcess`. The FAQ answers "cold pressed or wood pressed?" with "Neither".
- [ ] Approve the coconut oil page copy written from the content brief: heading "Kerala Coconut Oil", intro,
      *How our coconut oil is made*, *Sizes and prices*, *How to tell it's pure* — `src/components/product/OilStory.tsx`.
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

- [x] **About Neeram** text — written from the About page facts in `src/data/content.ts` → `aboutText`; check with the client.
- [ ] **Business address** for the footer: "[Business address, Kerala]" — `src/data/content.ts` → `address`.
- [ ] **Logo as SVG** (optional). The supplied PNG logo is in use (`public/images/logo/neeram-logo.png`, a trimmed
      480 px copy of `design-originals/logo/`); an SVG would stay sharper at every size — `src/components/Logo.tsx`.
- [ ] Favicon / app icon (`src/app/favicon.ico` is the Next.js default).

## Legal and help pages — `src/app/(site)/help/page.tsx`

- [x] Shipping & delivery: areas, times, charges.
- [x] Returns & refunds policy.
- [x] How to track an order.
- [x] Contact details: phone, email, hours. The order WhatsApp number is still to come (see Checkout).
- [ ] Lawyer review of the draft Privacy Policy (`/privacy`) and Terms (`/terms`).
- [ ] For `site` in `src/data/content.ts` (blanks show as "[to be confirmed]"):
  - the FSSAI licence lists the business as "Repacker - General Manufacturing" and 1 MT a day, while the site and label
    say the oil is made at the mill and the About page says 750 kg an hour: confirm the wording. Licence valid to 21 May 2027;
  - confirm Sharath K Sasikumar agrees to be named Grievance Officer, as Owner, with these contact details;
- [x] Delivery partners, for the Privacy Policy: DTDC and India Post.

## Search and local listings — `site` in `src/data/content.ts`

Nothing here is invented: blanks stay out of the search markup until they're filled.

- [ ] Map coordinates of the mill or office (`geo`), and its street address and PIN (`location`).
- [ ] Is there a shop or outlet customers can visit? If so, set `hasPublicLocation`. This also decides whether Neeram can
      have a Google Business Profile (`docs/SEO_PLAN.md`).
- [ ] Real stockists and towns where Neeram is sold. Don't list any town or shop that isn't confirmed.
- [x] Shelf life and delivery areas, for the FAQ on the coconut oil page.
- [ ] **Certificates** (FSSAI licence, Agmark, ISO 22000, organic, …) — scans of Neeram's own certificates for the
      About page. Add each to `certificates` in `src/data/content.ts` and the image to `public/images/certificates/`;
      the "Certified & licensed" strip appears once there is one. Do **not** use the certificates on
      neeram.vercel.app/about: they belong to other companies (Marudhar Impex, ISSCO Inc., Zongle Therapeutics).

## Checkout — `src/components/checkout/CheckoutForm.tsx`

- [x] Standard delivery time; the charge is confirmed on WhatsApp.
- [ ] Discount codes — the field is there but replies "not available yet".
- [x] **Order WhatsApp number** — +91 97478 44455, the customer care number. `src/data/content.ts` → `site.orders`.
- [ ] Order phone and email, for customers without WhatsApp — `site.orders`.
- [ ] Payment details (UPI ID / bank account) ready to send customers on WhatsApp after confirming. These don't go on the site.
- [ ] Set up the order sheet (`docs/ORDER_SHEET_SETUP.md`) so orders whose customer never sends the WhatsApp
      message aren't lost — until then they're only in Workers Logs.

## Photography

All non-bottle imagery was cropped from the Figma export and is low resolution for large use:

- [ ] Hero / tempering photo (`public/images/photos/mustard-seeds-curry-leaves-tempering-in-coconut-oil.webp`, only 720 × 680 — upscaled in the hero).
- [ ] Studio cut-outs of the five spice jars (current ones are ~280 × 590, extracted from the design).
- [ ] Optional: a lifestyle photo for the dark left panel of the coconut-oil feature (currently a plain stage, which
      keeps the landing bottle readable).
- [ ] Coconut oil gallery: real close-ups (label and cap crops are currently cut from the supplied bottle photo).

## Services to connect


## Phase 2

- [ ] Our story page, The kitchen page and recipe pages. Until then "Our story" links point at the
      home-page section, and "The recipe" points at the tempering band on the coconut oil page.
- [ ] Accounts — the design's account icon is left out of the header for Phase 1, because there are no accounts yet.
