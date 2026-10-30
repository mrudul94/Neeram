# Neeram — website

E-commerce site for Neeram Coconut Oil. Phase 1 sells **Neeram Coconut Oil (500 ml)**; the five spices are listed as *coming soon*.

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Zustand.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

Copy `.env.example` to `.env.local` to configure payments and the site URL (all optional for local work).

## Project layout

| Path | What |
| --- | --- |
| `src/data/products.ts` | The six products: names, Malayalam names, prices, `status`, images, specs. |
| `src/data/content.ts` | Hero slides, the dish list, site details (address, socials, about text). |
| `src/app/(site)/` | Pages with the main header + footer: home, shop, product pages, help. |
| `src/app/(checkout)/` | Checkout and order-confirmed pages (minimal header). |
| `src/app/api/` | `subscribe` (newsletter + notify-me), `checkout` (create order), `checkout/verify` (Razorpay signature). |
| `src/components/home/BottleStage.tsx` | The scroll-spinning bottle. |
| `src/store/cart.ts` | Cart (Zustand, persisted to `localStorage` as `neeram-cart`). |
| `public/bottle/` | `bottle-still*.webp` (product photo at rest) and `{desktop,mobile}/` — the 120 bottle frames (WebP). |
| `public/images/` | Jar cut-outs, photos and gallery images. |
| `scripts/` | Bottle rendering and image-preparation scripts. |
| `design/`, `blender/` | Source design export and 3D scene. |

## The bottle animation

The home page wraps the hero and the coconut-oil feature in `BottleStage`. The bottle is one wrapper
(`BottleMover`, inside `#bottle-slot-hero`) holding the CSS shadow, the product photo
(`public/bottle/bottle-still.webp`) and a `<canvas>`, stacked at the same size. A GSAP timeline scrubbed by
ScrollTrigger (`start: top top`, `end: feature slot center center`) translates and scales **the wrapper** onto
`#bottle-slot-feature` while the canvas draws frames 1 → 120 → 1 (one full turn, `Math.round(progress × 120) % 120`,
ending label-forward). The wrapper stays in document flow, so it scrolls with the page once the scrub ends.

- **Photo at rest, render while moving.** At progress ≤ 0.01 (hero) and ≥ 0.99 (landed) the photo shows; in between
  the wrapper gets `.is-moving` and the canvas fades in over 200 ms. The photo hides only once the canvas is fully in,
  and comes back instantly when leaving, so the swap never shows the background through a half-faded pair.
- The photo is aligned pixel-for-pixel with frame 1 (1000 × 1500 with transparent padding;
  `bottle-still-mobile.webp` is the same image downscaled to 600 × 900 like the mobile frames). If the bottle or camera
  changes, re-export the photo to match frame 1.
- The photo is the LCP image (preloaded, `fetchpriority="high"`). Frames start loading after the page `load` event,
  coarse-to-fine; the nearest loaded frame is always drawn.
- Phones (< 768 px) use the 600 × 900 set; the slots are stacked, so the bottle travels straight down.
- `prefers-reduced-motion`: no canvas, no spin, no Lenis — the photo is shown in each slot.
- Slot sizes are set in CSS, so there is no layout shift while frames load.

### Re-rendering the frames

Requires Blender 5.x. From the project root:

```bash
blender -b blender/Neeram_Bottle.blend -P scripts/render_bottle.py                    # desktop + mobile PNGs
blender -b blender/Neeram_Bottle.blend -P scripts/render_bottle.py -- --desktop-only   # desktop only (faster)
npm run frames                                                                        # PNG -> WebP, deletes the PNGs
```

The script:

- sets the bottle's rotation directly — `rotation_euler.z = 2π × (f − 1) / 120` for frame f — instead of relying on
  the .blend's keyframes (which may not load in an older Blender);
- hides `Shadow_Catcher` (the site draws a CSS shadow); keeps `film_transparent` on but `film_transparent_glass`
  **off**, so the oil keeps its colour;
- applies the look tuned against the product photo (constants at the top of the script): exposure −1.3, oil Volume
  Absorption density 16 and colour (1, 0.87, 0.62), `Back_Glow` at 10% of its strength, label Translucent
  (0.75, 0.72, 0.66) and Diffuse (0.72, 0.70, 0.65);
- uses a GPU (OptiX/CUDA/HIP/oneAPI/Metal) when one is available, 48 samples with adaptive threshold 0.02 and
  denoising, and Persistent Data so the scene isn't rebuilt every frame;
- renders frames 1–120 to `public/bottle/desktop/####.png` (1000 × 1500), and `public/bottle/mobile/####.png`
  (600 × 900) unless `--desktop-only`.

Existing frames are skipped, so an interrupted render resumes when re-run. Options: `--frames 1-10`, `--samples 24`,
`--scale 50` (resolution %, for quick look tests), `--exposure`, `--density`, `--oil-color r,g,b`, `--back-glow`,
`--out DIR`.

`npm run frames` writes WebP (quality 75, alpha quality 60 — alpha is what drives file size) and builds any missing
mobile frame by downscaling the desktop one. Budgets: desktop ≤ 6 MB, mobile ≤ 2.5 MB; the script prints both totals.

On a CPU-only machine (the frames were rendered on an Intel laptop, ~55 s per frame), use `--desktop-only` and let
`npm run frames` make the mobile set.

`node scripts/preview_frames.mjs` makes WebP previews of PNGs rendered so far **without deleting them**, for testing
during a long render.

## Launching a spice (coming soon → available)

1. In `src/data/products.ts`, set the product's `status: "available"` and its `price` (rupees, a number).
2. Optional: add gallery shots to its `images` array.
3. Optional: add a hero slide for it to `heroSlides` in `src/data/content.ts` (the slider shows tabs and arrows
   automatically once there is more than one slide).

Everything else — shelf buttons, shop rows, the product page layout, cart, checkout, the dish-list links,
"Notify me" — reads `status`, so nothing else needs to change. Note that people who asked to be notified are stored
under the product's slug (see *Forms* below).

## Payments (Razorpay)

Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test keys from the Razorpay dashboard) in `.env.local`, or in the
Vercel project settings. The checkout then:

1. `POST /api/checkout` validates the details, re-prices the cart from `products.ts`, and creates a Razorpay order;
2. opens Razorpay Checkout in the browser;
3. `POST /api/checkout/verify` checks the payment signature, then the customer lands on `/order/confirmed`.

Without keys — **or while any price in the cart is still `null`** — checkout uses a mock payment and goes straight to
the thank-you page. Before going live, add a Razorpay webhook (`payment.captured`) as the source of truth for
fulfilment.

## Forms and orders

Newsletter sign-ups, notify-me requests and orders are appended to `data/*.jsonl` (git-ignored). This is for local
development only: Vercel's filesystem is read-only, so there they are only logged. Connect an email service / database
before launch (`src/lib/store-json.ts`, `src/app/api/subscribe/route.ts`).

## Images

The jar cut-outs and food photos were extracted from the design export by `scripts/extract_design_assets.mjs`
(colour-to-alpha against the sand panel). They are stand-ins until original photography is supplied — see
`TODO_CONTENT.md`.

## Deploying

Push to a Git repo and import it in Vercel. Set `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, Open Graph and
JSON-LD) and the Razorpay keys.
