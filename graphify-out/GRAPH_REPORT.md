# Graph Report - Neeram  (2026-11-03)

## Corpus Check
- 106 files · ~48,422 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .woff2 4, .example 2, (none) 2)

## Summary
- 634 nodes · 1602 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `696cc5df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- Site Content Pages
- Product & Shop Pages
- Frame Conversion Scripts
- package.json
- Home Bottle & Feature Stage
- Colour Matching Script
- Website Design Board
- TypeScript Config
- Neeram Coconut Oil 1L Bottle Product Photo (source PNG)
- CheckoutForm.tsx
- sheet.ts
- Setting up the Neeram order sheet
- Neeram Website Build Brief
- vitest
- cart.ts
- records.ts
- checkout.ts
- scripts
- CookieNotice.tsx
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- records.test.ts
- Pending work
- @playwright/test
- @opennextjs/cloudflare
- Neeram Coconut Leaf Logo (Glow on Black)

## God Nodes (most connected - your core abstractions)
1. `next` - 38 edges
2. `getProduct()` - 37 edges
3. `cx()` - 35 edges
4. `react` - 26 edges
5. `AvailableProduct()` - 25 edges
6. `Eyebrow()` - 25 edges
7. `isAvailable()` - 25 edges
8. `formatPrice()` - 23 edges
9. `useCart` - 22 edges
10. `vitest` - 19 edges

## Surprising Connections (you probably didn't know these)
- `1. Review fixes: done in local commits, not yet pushed` --references--> `formatPhone()`  [INFERRED]
  docs/LATER.md → src/lib/checkout.ts
- `Oil Fills the Name - Wordmark Loader Prototype` --semantically_similar_to--> `BottleStage component`  [INFERRED] [semantically similar]
  design/neeram-oil-wordmark.html → README.md
- `Oil Fills the Name - Wordmark Loader Prototype` --references--> `Neeram Coconut Oil 500 ml`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Oil Fills the Name - Wordmark Loader Prototype` --implements--> `Typography (Anton, Newsreader, Inter, Baloo Chettan 2, Noto Sans Malayalam)`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Hero Mock (under loader)` --conceptually_related_to--> `Hero Slider (single coconut oil slide)`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **High-res PNG masters for coconut oil packs** — public_images_jars_neeram_coconut_oil_bottle_product_photo_1l_bottle_photo, public_images_jars_neeram_coconut_oil_pouch_mockup_500ml_pouch_mockup, public_images_jars_neeram_double_filtered_coconut_oil_bottle_200ml_bottle_render [INFERRED 0.75]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (29 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.08
Nodes (33): nextConfig, lenis, next, anton, antonRupee, balooChettan, fontVariables, inter (+25 more)

### Community 1 - "Site Content Pages"
Cohesion: 0.06
Nodes (60): AboutPage(), chapters, figures, metadata, promises, steps, HelpPage(), metadata (+52 more)

### Community 2 - "Product & Shop Pages"
Cohesion: 0.11
Nodes (49): react, accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), generateMetadata(), ProductContent(), ProductPage() (+41 more)

### Community 3 - "Frame Conversion Scripts"
Cohesion: 0.05
Nodes (27): sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir, pngs, projectRoot (+19 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "Home Bottle & Feature Stage"
Cohesion: 0.17
Nodes (25): addPhotoMotion(), BottleMover(), BottleStill(), frameTurn(), startTravel(), FeatureAddButton(), FeatureStage(), SwapText() (+17 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.10
Nodes (17): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, apply(), corners(), fit(), identity_lut(), load_rgba(), logo_red() (+9 more)

### Community 7 - "Website Design Board"
Cohesion: 0.40
Nodes (6): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Coconut Oil Open Graph Image

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Neeram Coconut Oil 1L Bottle Product Photo (source PNG)"
Cohesion: 0.47
Nodes (6): Neeram Coconut Oil 1L Bottle Product Photo (source PNG), Cojivida Oin Mill (manufacturer on 1L label), Neeram Brand (red coconut logo), Neeram Coconut Oil 500ml Pouch Mockup (source PNG), Neeram Double Filtered Coconut Oil 200ml Bottle (glow render PNG), Neeram Double Filtered Coconut Oil (product)

### Community 10 - "CheckoutForm.tsx"
Cohesion: 0.14
Nodes (23): CheckoutPage(), metadata, Channel, CheckoutForm(), onSubmit(), Choice(), Field(), Step() (+15 more)

### Community 11 - "sheet.ts"
Cohesion: 0.14
Nodes (15): accessToken(), appendRow(), base64url(), Cell, GoogleError, guide, NEWSLETTER_RANGE, ORDER_SHEET_HEADERS (+7 more)

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.10
Nodes (19): 1. Orders reach Neeram, 2. Bot protection, 3. Legal, 4. Hosting, 5. Check it end to end, 6. Access, 7. Nice to have before launch, Launch checklist (+11 more)

### Community 13 - "Neeram Website Build Brief"
Cohesion: 0.05
Nodes (45): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), aim() stream position, build() GSAP loader timeline, frame() rAF oil render, Hero Mock (under loader), level() oil height (+37 more)

### Community 14 - "vitest"
Cohesion: 0.12
Nodes (7): vitest, body, { privateKey }, scheduled, { privateKey }, scheduled, live

### Community 15 - "cart.ts"
Cohesion: 0.14
Nodes (23): CheckoutLayout(), SiteLayout(), CartDrawer(), CheckoutHeader(), steps, Footer(), CartButton(), Header() (+15 more)

### Community 16 - "records.ts"
Cohesion: 0.24
Nodes (12): Deps, NewOrder, NewSignup, save(), saveOrder(), saveSignup(), worthRetrying(), istDateTime() (+4 more)

### Community 17 - "checkout.ts"
Cohesion: 0.17
Nodes (21): POST(), POST(), BOT_CHECK_FAILED(), filledHoneypot(), CheckoutDetails, CheckoutLine, compactPhone(), DETAIL_FIELDS (+13 more)

### Community 18 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, cf-typegen, deploy, dev, frames, lint, preview (+4 more)

### Community 19 - "CookieNotice.tsx"
Cohesion: 0.26
Nodes (8): Choice, CookieNotice(), isDismissed(), listeners, save(), subscribe(), Box, rectsOverlap()

### Community 21 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, gsap@^3.15.0, lenis@^1.3.27, next@16.4.3, react@19.3.0, react-dom@19.3.0, zustand@^5.0.16, gsap (+2 more)

### Community 22 - "Neeram SEO plan"
Cohesion: 0.25
Nodes (7): Advice we're not following, and why, AI search (GEO / AEO), Already built, Commands, Neeram SEO plan, Off-page: done outside the website, by the business, To do at launch

### Community 23 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.3, eslint, eslint-config-next

### Community 24 - "records.test.ts"
Cohesion: 0.33
Nodes (4): order, { privateKey }, sheetEnv, signup

### Community 25 - "Pending work"
Cohesion: 0.40
Nodes (4): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **20 isolated node(s):** `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 224 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Site Content Pages`, `Product & Shop Pages`, `package.json`, `Home Bottle & Feature Stage`, `CheckoutForm.tsx`, `cart.ts`, `checkout.ts`, `CookieNotice.tsx`, `dependencies`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `generate-agent-files.js (next dev)` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07673469387755102 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `next`, `Site Content Pages`, `Product & Shop Pages`, `Frame Conversion Scripts`, `package.json`, `sheet.ts`, `cart.ts`, `checkout.ts`, `CookieNotice.tsx`, `records.test.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `Site Content Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.060833902939166094 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Product & Shop Pages` to `next`, `Site Content Pages`, `package.json`, `Home Bottle & Feature Stage`, `CheckoutForm.tsx`, `cart.ts`, `CookieNotice.tsx`, `dependencies`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._