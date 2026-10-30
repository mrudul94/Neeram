# Graph Report - Neeram  (2026-10-30)

## Corpus Check
- 61 files · ~29,904 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .example 1, (none) 1, .blend 1)

## Summary
- 453 nodes · 1109 edges · 21 communities (20 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d3141a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- Site Content Pages
- Product & Shop Pages
- Frame Conversion Scripts
- Package & Lint Config
- Home Bottle & Feature Stage
- Colour Matching Script
- Website Design Board
- TypeScript Config
- Product Packaging Photos
- Brand Story Imagery
- render_bottle.py
- Client Content Checklist (TODO_CONTENT)
- Neeram Website Build Brief
- build() GSAP loader timeline
- Header.tsx
- 3D Scroll-Spinning Bottle Animation
- CheckoutForm.tsx
- Razorpay Payments (test mode, mock fallback)
- Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `cx()` - 35 edges
2. `getProduct()` - 30 edges
3. `next` - 27 edges
4. `Eyebrow()` - 22 edges
5. `isAvailable()` - 22 edges
6. `react` - 19 edges
7. `useCart` - 19 edges
8. `AvailableProduct()` - 18 edges
9. `AddToCartButton()` - 18 edges
10. `formatPrice()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Oil Fills the Name - Wordmark Loader Prototype` --semantically_similar_to--> `BottleStage component`  [INFERRED] [semantically similar]
  design/neeram-oil-wordmark.html → README.md
- `Oil Fills the Name - Wordmark Loader Prototype` --references--> `Neeram Coconut Oil 500 ml`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Oil Fills the Name - Wordmark Loader Prototype` --conceptually_related_to--> `prefers-reduced-motion Handling`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Oil Fills the Name - Wordmark Loader Prototype` --implements--> `Typography (Anton, Newsreader, Inter, Baloo Chettan 2, Noto Sans Malayalam)`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Coconut Pour Video Poster (Desktop 16:9)` --conceptually_related_to--> `Bottle Still (WebP Cutout)`  [AMBIGUOUS]
  design/archive/video/neeram-pour-desktop-poster.jpg → public/bottle/bottle-still.webp

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Jars Product Grid (coconut oil + Kerala Spices jars)** — public_images_jars_coconut_oil_500ml_bottle, public_images_jars_black_pepper_black_pepper_jar, public_images_jars_malabar_tamarind_malabar_tamarind_jar, public_images_jars_shankupushpam_shankupushpam_jar, public_images_jars_tamarind_tamarind_jar, public_images_jars_turmeric_turmeric_jar [INFERRED 0.75]
- **High-res PNG masters for coconut oil packs** — public_images_jars_neeram_coconut_oil_bottle_product_photo_1l_bottle_photo, public_images_jars_neeram_coconut_oil_pouch_mockup_500ml_pouch_mockup, public_images_jars_neeram_double_filtered_coconut_oil_bottle_200ml_bottle_render [INFERRED 0.75]
- **About Page Brand Origin Story (mill, opening, banner)** — public_images_about_oil_mill_govindan_oil_mill, public_images_about_mill_opening_mill_opening_ceremony, public_images_about_neeram_banner_neeram_banner [INFERRED 0.85]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]
- **Coconut Oil Pack-Size Lineup (200ml bottle, 500ml pouch, 1L bottle)** — public_images_packs_bottle_200_200ml_bottle, public_images_packs_pouch_500_500ml_pouch, public_images_packs_bottle_1l_1l_bottle, public_images_jars_neeram_double_filtered_coconut_oil_bottle_double_filtered_coconut_oil [INFERRED 0.85]
- **Culinary Usage Photography** — public_images_photos_sambar_sambar, public_images_photos_tempering_pan_tempering_pan, public_images_photos_tempering_pan_kerala_home_cooking [INFERRED 0.85]
- **Gallery Packaging Detail Shots** — public_images_gallery_coconut_oil_cap_coconut_oil_cap, public_images_gallery_coconut_oil_label_coconut_oil_label, public_images_about_neeram_banner_neeram_brand [INFERRED 0.85]
- **Neeram Logo Variants and Packaging Usage** — public_images_logo_neeram_logo_brand_mark, public_images_main_logo_neeram_coconut_leaf_logo_glow_logo, public_images_logo_neeram_logo_wordmark, design_neeram_coconut_oil_bottle_cutout_bottle_glow [INFERRED 0.85]

## Communities (21 total, 1 thin omitted)

### Community 0 - "app/layout.tsx"
Cohesion: 0.10
Nodes (21): gsap@^3.15.0, gsap, anton, balooChettan, fontVariables, inter, notoMalayalam, metadata (+13 more)

### Community 1 - "Site Content Pages"
Cohesion: 0.08
Nodes (47): nextConfig, next, CheckoutLayout(), AboutPage(), chapters, figures, metadata, promises (+39 more)

### Community 2 - "Product & Shop Pages"
Cohesion: 0.10
Nodes (59): react, accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), generateMetadata(), ProductContent(), ProductPage() (+51 more)

### Community 3 - "Frame Conversion Scripts"
Cohesion: 0.06
Nodes (26): sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir, pngs, projectRoot (+18 more)

### Community 4 - "Package & Lint Config"
Cohesion: 0.07
Nodes (36): eslintConfig, dependencies, lenis@^1.3.27, next@16.4.3, react@19.3.0, react-dom@19.3.0, zustand@^5.0.16, devDependencies (+28 more)

### Community 5 - "Home Bottle & Feature Stage"
Cohesion: 0.17
Nodes (22): addPhotoMotion(), BottleMover(), BottleStage(), BottleStill(), frameTurn(), FeatureStage(), SwapText(), BASELINE (+14 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.16
Nodes (14): apply(), corners(), fit(), identity_lut(), load_rgba(), logo_red(), main(), pair_mask() (+6 more)

### Community 7 - "Website Design Board"
Cohesion: 0.29
Nodes (11): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Bottle Still Mobile (WebP Cutout), Bottle Still (WebP Cutout), Neeram Brand Mark (Red Badge, Coconuts, Leaves, Oil Drop) (+3 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Product Packaging Photos"
Cohesion: 0.19
Nodes (17): Neeram Kerala Spices Black Pepper Jar (200ml), Neeram Kerala Spices (sub-line), Neeram Coconut Oil 500ml Conical Bottle, Govindan Oil Mill (manufacturer on 500ml label), Neeram Kerala Spices Malabar Tamarind Jar (200ml), Neeram Coconut Oil 1L Bottle Product Photo (source PNG), Cojivida Oin Mill (manufacturer on 1L label), Neeram Brand (red coconut logo) (+9 more)

### Community 10 - "Brand Story Imagery"
Cohesion: 0.23
Nodes (13): Mill Opening Ceremony Photo, Traditional Lamp Lighting (Nilavilakku), Double Filtered Coconut Oil (Velichenna), Kerala / God's Own Country Origin, Neeram Coconut Oil Product Banner, Neeram Brand, Govindan Oil Mill, Anakallu, Neeram Bottle Cap Close-up (+5 more)

### Community 11 - "render_bottle.py"
Cohesion: 0.25
Nodes (3): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, Python script deps (numpy>=2, pillow>=11)

### Community 12 - "Client Content Checklist (TODO_CONTENT)"
Cohesion: 0.22
Nodes (8): Neeram Coconut Oil 500 ml, Five Coming-Soon Spices (Malabar Tamarind, Turmeric, Black Pepper, Tamarind, Shankupushpam), Phase 1 (oil-only launch), Phase 2 (Our story, Kitchen, recipes, spice pages), Launching a Spice (coming soon to available), Client Content Checklist (TODO_CONTENT), Help / Legal Page (src/app/(site)/help/page.tsx), Placeholder Photography (cropped from Figma)

### Community 13 - "Neeram Website Build Brief"
Cohesion: 0.21
Nodes (12): Hero Mock (under loader), Oil Fills the Name - Wordmark Loader Prototype, Neeram_Coconut_Oil_Bottle_Cutout.png, Neeram Website Build Brief, Design Tokens (cream, sand, ink, orange, turmeric, muted), Figma Export (NEERAM___E-commerce_Website.png), Hero Slider (single coconut oil slide), Home Page (hero, oil feature, shelf, dish list, look-before-you-open) (+4 more)

### Community 14 - "build() GSAP loader timeline"
Cohesion: 0.29
Nodes (7): aim() stream position, build() GSAP loader timeline, frame() rAF oil render, level() oil height, play(), schedule() simulated load steps, seg() toggle controls

### Community 15 - "Header.tsx"
Cohesion: 0.25
Nodes (10): SiteLayout(), columns, Footer(), CartButton(), Header(), nav, BagIcon(), CloseIcon() (+2 more)

### Community 16 - "3D Scroll-Spinning Bottle Animation"
Cohesion: 0.38
Nodes (5): Bottle Slots (#bottle-slot-hero, #bottle-slot-feature), prefers-reduced-motion Handling, BottleMover wrapper, BottleStage component, npm run frames (PNG to WebP)

### Community 17 - "CheckoutForm.tsx"
Cohesion: 0.19
Nodes (18): POST(), CheckoutPage(), metadata, Channel, CheckoutForm(), onSubmit(), Choice(), Field() (+10 more)

### Community 18 - "Razorpay Payments (test mode, mock fallback)"
Cohesion: 0.29
Nodes (7): Zustand Cart (localStorage), Razorpay Payments (test mode, mock fallback), POST /api/checkout, POST /api/checkout/verify, /api/subscribe (newsletter + notify-me), src/lib/store-json.ts (JSONL storage), Coconut Oil Price (null placeholder)

### Community 19 - "Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)"
Cohesion: 0.33
Nodes (6): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand), Neeram Website README, Vercel Deployment (NEXT_PUBLIC_SITE_URL)

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to
- `Coconut Pour Video Poster (Desktop 16:9)` → `Bottle Still (WebP Cutout)`  [AMBIGUOUS]
  design/archive/video/neeram-pour-desktop-poster.jpg · relation: conceptually_related_to
- `Govindan Oil Mill (manufacturer on 500ml label)` → `Cojivida Oin Mill (manufacturer on 1L label)`  [AMBIGUOUS]
  public/images/jars/coconut-oil.webp · relation: conceptually_related_to

## Knowledge Gaps
- **21 isolated node(s):** `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Traditional Lamp Lighting (Nilavilakku)`, `Nutrition Facts (per 100g: 862 kcal, SFA 89.19g, MUFA 8.186g, PUFA 2.63g, 0 cholesterol)`, `generate-agent-files.js (next dev)` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 142 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sharp` connect `Frame Conversion Scripts` to `Package & Lint Config`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Traditional Lamp Lighting (Nilavilakku)` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Site Content Pages` to `app/layout.tsx`, `Product & Shop Pages`, `Package & Lint Config`, `Home Bottle & Feature Stage`, `Header.tsx`, `CheckoutForm.tsx`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `Site Content Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07589285714285714 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Coconut Pour Video Poster (Desktop 16:9)` and `Bottle Still (WebP Cutout)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._