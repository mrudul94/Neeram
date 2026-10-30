# NEERAM — Website Build Brief for Claude Code

You are building the e-commerce website for **Neeram** (Neeram Kerala Spices), a Kerala food brand.
**Phase 1 sells one product only: Neeram Coconut Oil (500 ml).** The five spices (Malabar Tamarind,
Turmeric, Black Pepper, Tamarind, Shankupushpam) appear as **"Coming soon"** — visible, but not buyable.

The signature feature is a **3D coconut oil bottle that spins 360° while the user scrolls and travels
down from the hero into the next section.**

Work in the phases below, in order. After each phase, run the site, check it in the browser at desktop
(1440 px) and mobile (390 px) widths, and tell me what's done before moving on.

---

## 0. Files in this folder

| File | What it is |
| --- | --- |
| `design/NEERAM___E-commerce_Website.png` | The full Figma export (all pages, desktop + mobile). It is huge (13690 × 15116 px). Crop/downscale it with a script to view sections — do not open it whole. |
| `blender/Neeram_Bottle.blend` | The 3D bottle scene (Blender 5.2). Camera, studio lights, materials and a 360° rotation over frames 1–120 are already set up. |
| `blender/Neeram_Bottle.glb` | Same bottle as a GLB (fallback only — not used in Phase 1). |
| `design/Neeram_Coconut_Oil_Bottle_Cutout.png` | Product photo of the bottle with label (transparent PNG). Use for thumbnails, cart, OG image. |

If the **Figma MCP server** is connected, use it to read exact fonts, colours, spacing and copy from the
Figma file. Otherwise use the tokens in section 2, which were sampled from the export.

---

## 1. Tech stack

- **Next.js (App Router) + TypeScript**, deployed to Vercel.
- **Tailwind CSS** with the design tokens below as theme values (no random hex codes in components).
- **GSAP + ScrollTrigger** for the bottle animation; **Lenis** for smooth scrolling (synced with ScrollTrigger).
- **Zustand** for the cart (persisted to localStorage).
- `next/image` for all photos; `next/font` for fonts.
- Product data in `src/data/products.ts` — no CMS in Phase 1.

---

## 2. Design tokens (from the design)

**Colours**
| Token | Hex | Used for |
| --- | --- | --- |
| `cream` | `#EEE8DC` | Main page background |
| `sand` | `#E3DAC7` | Panels, image backgrounds, footer-top |
| `ink` | `#16130F` | Dark sections, text, black buttons |
| `orange` | `#F26A0D` | Primary buttons, eyebrow lines, "NO. 01" labels, big NEERAM footer wordmark |
| `turmeric` | `#E3A21A` (approx.) | Large Malayalam display words |
| `muted` | `#6B6358` (approx.) | Body copy on cream |

**Type** (check against Figma; these are close free matches)
- **Display headlines:** heavy condensed grotesque, ALL CAPS, very tight leading (~0.88) — use **Anton** if Figma's font isn't available.
- **Body:** a book serif, ~18–20 px, generous line height — use **Newsreader**.
- **UI / labels / buttons / nav:** clean sans — use **Inter**; eyebrow labels are small caps-style, letter-spaced (`— NO. 01 · COCONUT OIL`).
- **Malayalam:** big rounded display words (വെളിച്ചെണ്ണ, മഞ്ഞൾ) — use **Baloo Chettan 2**; small Malayalam captions — **Noto Sans Malayalam**.

**Recurring patterns**
- Eyebrow: short orange rule + uppercase label (`— FROM THE NEERAM KITCHEN`).
- Buttons: orange filled with arrow (`SHOP COCONUT OIL →`), black filled (`ADD TO CART`), text link with underline (`THE RECIPE`).
- Product "shelf": products standing on a single thin horizontal line, info cells below separated by vertical hairlines.
- Spec tables: label / value rows with hairline dividers (`ALSO CALLED · Velichenna`).
- Footer: newsletter line ("A NOTE WHEN NEW STOCK LANDS."), link columns, then a huge orange **NEERAM** wordmark across the full width.

---

## 3. The bottle animation (most important — get this right first)

### 3a. Render the frames from Blender (Phase 0)
Blender is installed on this machine. Render the image sequence from the command line, using the GPU:

1. Write `scripts/render_bottle.py` (run with `blender -b blender/Neeram_Bottle.blend -P scripts/render_bottle.py`) that:
   - Hides the object `Shadow_Catcher` from render (the bottle will float and move, so a baked floor shadow looks wrong — we add a CSS shadow instead).
   - Keeps the transparent background (`film_transparent` is already on).
   - Sets Cycles to GPU if available (OptiX/CUDA/HIP/Metal), 128 samples, denoise on.
   - Renders frames **1–120** as **PNG RGBA** at **1000 × 1500** to `public/bottle/desktop/####.png`.
   - Then renders again at **600 × 900** to `public/bottle/mobile/####.png`.
2. Convert all PNGs to **WebP** (quality ~80, keep alpha) with a Node script using `sharp`; delete the PNGs.
   Target: desktop set ≤ 6 MB total, mobile set ≤ 2.5 MB.
3. Frame 1 = label facing the camera. Frame 120 is one step before a full turn, so the loop is seamless.

### 3b. Scroll choreography (desktop)
- **Start:** in the hero, the bottle stands large on the right side of the headline (about 75 vh tall), label facing forward (frame 1). A soft elliptical CSS shadow sits under it.
- **While scrolling** from the top of the hero to the landing point: the bottle **rotates one full turn** (frames 1 → 120) and **travels down and slightly left** into the next section, **scaling down** to about 50 vh tall.
- **Landing:** it settles into the **Coconut Oil feature section** (section 2 below), into a reserved "slot" next to the copy, finishing label-forward. From there it scrolls normally with the page — no jump.
- **Scrolling back up** reverses everything smoothly (scrubbed, not time-based).

**Implementation guidance**
- One `<canvas>` draws the current frame. Preload frame 1 first (render it immediately, also as the LCP image), then load the rest in the background; always draw the nearest frame that has loaded.
- Use two invisible slot elements — `#bottle-slot-hero` and `#bottle-slot-feature` — and animate the canvas between their measured positions/sizes. Recalculate on resize (`invalidateOnRefresh`).
- Recommended approach: put the canvas `position: absolute` inside a wrapper that spans the hero + feature sections, and animate its `transform` (translate + scale) with a GSAP timeline scrubbed by ScrollTrigger (`start: hero top`, `end: feature slot center`, `scrub: 0.6`). Because it lives in document flow, it stops naturally when the scrub ends — no fixed→static swap needed.
- Map scroll progress → frame index: `frame = Math.round(progress * 119)`.
- Use `devicePixelRatio`-aware canvas sizing; draw with `drawImage` only when the frame index changes.

### 3c. Mobile and accessibility
- **Mobile (< 768 px):** use the mobile frame set. Bottle starts centered below the hero headline, spins one turn, and travels straight down into the feature section. Shorter scroll distance.
- **`prefers-reduced-motion`:** no spin or travel — show frame 1 as a static image in each slot.
- No layout shift: the slots reserve their space even before the frames load.

---

## 4. Pages and sections

Read the matching frames in the design export before building each page. Copy text from the design;
where the design has placeholders (prices `₹ —`, "[Two or three sentences about…]"), keep a clear
placeholder and list it in `TODO_CONTENT.md`.

### Phase 1 pages
1. **Home** (`/`) — adapted from "DESKTOP — HOME", oil-first:
   1. **Header:** Shop · The kitchen · Our story — Neeram logo centred — search, account, Cart (n).
   2. **Hero (dark, food photo background):** the design's hero is a 3-slide spice slider; for Phase 1 make it a **single coconut oil hero** in the same layout. Eyebrow `— NO. 01 · COCONUT OIL  വെളിച്ചെണ്ണ`, big headline (placeholder: `THE OIL EVERY KERALA KITCHEN STARTS WITH.`), one-line serif sub-copy, buttons `SHOP COCONUT OIL →` and `THE RECIPE`. The 3D bottle starts here. Build the hero as a slider component that currently has one slide, so spice slides can be added later.
   3. **Coconut Oil feature (bottle landing):** reuse the layout of the turmeric feature ("THE YELLOW IN ALMOST EVERYTHING."): big Malayalam word **വെളിച്ചെണ്ണ** in turmeric yellow, eyebrow `— NO. 01 · COCONUT OIL`, headline, short copy, spec table (FORM · GOES INTO · PAIRS WITH), `ADD COCONUT OIL · ₹ — →` + `PRODUCT DETAILS`. The bottle lands in the reserved slot here.
   4. **"A SHORT SHELF, ON PURPOSE."** — the six-product shelf. Coconut oil is buyable (`ADD +`). The five spices show their jars slightly desaturated with a **COMING SOON** tag and a `NOTIFY ME` link instead of price/add.
   5. **"WHAT GOES INTO WHAT."** (dark) — the dish list with ingredient dots. Keep it, but only Coconut Oil is a live link; spice names are plain text.
   6. **"LOOK BEFORE YOU OPEN."** — annotated product section. Swap the jar for the coconut oil bottle photo with callouts: *Double filtered*, *Clear bottle — see the oil before you buy*, *Neeram label*.
   7. **About + help links** block, then the **footer** (newsletter + links + giant NEERAM wordmark).
2. **Shop** (`/shop`) — "DESKTOP — SHOP" ("THE SHELF"): numbered list of six; oil buyable, spices "Coming soon".
3. **Coconut Oil product page** (`/products/coconut-oil`) — "DESKTOP — PRODUCT PAGES", Coconut Oil frame: gallery with thumbnails + Malayalam watermark word, title, price, qty stepper, `ADD TO CART`, `BUY NOW`, spec table, accordions (Ingredients, Storage, Shipping & returns), "THE TEMPERING THAT STARTS IT." band, "ON THE SAME SHELF" (spices shown as coming soon).
4. **Cart drawer** — "DESKTOP — CART DRAWER" (slides in from the right).
5. **Checkout** (`/checkout`) and **Thank-you** (`/order/confirmed`) — "NANDI, THANK YOU."
6. **Coming soon page** for each spice (`/products/[slug]`) — product name, Malayalam name, jar image, "Coming soon", email notify form.

### Phase 2 (build after Phase 1 is approved)
- **Our story** (`/our-story`), **The kitchen** (`/kitchen`) and a **recipe page** (`/kitchen/[slug]`) — as in the design.
- Full spice product pages when spices launch (flip `status` in `products.ts`, add hero slides).

---

## 5. Data and commerce

- `src/data/products.ts`: `slug, number ("01"), name, nameMalayalam, transliteration, sizeLabel, price (number | null), status: 'available' | 'coming_soon', images, specs, description`.
- Everything checks `status` — never hard-code "coming soon" in components.
- Cart: add/remove/quantity, subtotal, persists in localStorage; cart count in header.
- Checkout: contact, delivery address (Indian address format, PIN code), delivery option, payment.
  Integrate **Razorpay** in test mode behind env vars (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`); if keys are missing, use a mock payment that goes straight to the thank-you page. Do not hard-code keys.
- "Notify me" and newsletter forms: post to a single API route that currently logs/stores to a JSON file, with a TODO to connect an email service.

---

## 6. Quality bar

- Match the design closely: spacing, type scale, hairlines, the editorial feel. Compare screenshots against the design export after each section and fix differences.
- Responsive at 390, 768, 1024, 1440 px. Use the "MOBILE —" frames in the export for mobile layouts.
- Lighthouse (mobile): Performance ≥ 85, Accessibility ≥ 95. The bottle frames must not block first paint.
- Semantic HTML, alt text, keyboard-accessible cart drawer and accordions, visible focus states.
- SEO: page titles/descriptions, Open Graph image (bottle photo), Product JSON-LD on the coconut oil page.

## 7. Deliverables at the end of Phase 1
- Running site with the pages above and the scroll-spinning bottle working on desktop and mobile.
- `TODO_CONTENT.md` — every placeholder (prices, story text, real photos, FSSAI/legal info) that the client must supply.
- `README.md` — how to run, how to re-render the bottle frames, how to switch a spice from coming soon to available.
