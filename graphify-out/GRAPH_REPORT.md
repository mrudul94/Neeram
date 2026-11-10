# Graph Report - Neeram  (2026-11-10)

## Corpus Check
- 113 files · ~53,070 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .woff2 5, .example 2, (none) 2)

## Summary
- 650 nodes · 1671 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `257fd521`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- ui.tsx
- schema.ts
- convert_frames.mjs
- package.json
- [slug]/page.tsx
- Colour Matching Script
- Website Design Board
- TypeScript Config
- Neeram Website Build Brief
- next
- preview_frames.mjs
- Setting up the Neeram order sheet
- Oil Fills the Name - Wordmark Loader Prototype
- CheckoutForm.tsx
- Performance log
- README.md
- products.ts
- scripts
- sheet.ts
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- Launch checklist
- vitest
- @playwright/test
- CookieNotice.tsx
- render_bottle.py
- extract_design_assets.mjs
- vitest
- build() GSAP loader timeline
- Razorpay Payments (test mode, mock fallback)
- Client Content Checklist (TODO_CONTENT)
- ref_node_path
- legal.spec.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 37 edges
2. `cx()` - 37 edges
3. `getProduct()` - 32 edges
4. `formatPrice()` - 27 edges
5. `AvailableProduct()` - 26 edges
6. `react` - 25 edges
7. `Eyebrow()` - 25 edges
8. `isAvailable()` - 23 edges
9. `useCart` - 22 edges
10. `packPrice()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `2. Bot protection` --references--> `POST()`  [INFERRED]
  docs/LAUNCH_CHECKLIST.md → src/app/api/checkout/route.ts
- `1. Review fixes: done in local commits, not yet pushed` --references--> `formatPhone()`  [INFERRED]
  docs/LATER.md → src/lib/checkout.ts
- `Controls in place` --references--> `pickDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts
- `Controls in place` --references--> `validateDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts
- `Controls in place` --references--> `priceLines()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (36 total, 3 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.11
Nodes (54): accordions(), AvailableProduct(), Breadcrumb(), generateMetadata(), ProductContent(), ProductPage(), SameShelf(), AddToCartButton() (+46 more)

### Community 1 - "ui.tsx"
Cohesion: 0.08
Nodes (48): csp, nextConfig, securityHeaders, next, CheckoutLayout(), AboutPage(), chapters, figures (+40 more)

### Community 2 - "schema.ts"
Cohesion: 0.45
Nodes (11): Faq, absolute(), breadcrumbSchema(), compact(), faqSchema(), ORG_ID(), organizationSchema(), productSchema() (+3 more)

### Community 3 - "convert_frames.mjs"
Cohesion: 0.18
Nodes (8): desktopDir, match, matchedDir, mobileDir, pngs, projectRoot, root, venvPython

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "[slug]/page.tsx"
Cohesion: 0.16
Nodes (24): react, addPhotoMotion(), BottleMover(), BottleStill(), frameTurn(), startTravel(), FeatureStage(), SwapText() (+16 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.16
Nodes (14): apply(), corners(), fit(), identity_lut(), load_rgba(), logo_red(), main(), pair_mask() (+6 more)

### Community 7 - "Website Design Board"
Cohesion: 0.40
Nodes (6): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Coconut Oil Open Graph Image

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Neeram Website Build Brief"
Cohesion: 0.18
Nodes (13): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), Neeram_Coconut_Oil_Bottle_Cutout.png, Neeram Website Build Brief, Design Tokens (cream, sand, ink, orange, turmeric, muted), Figma Export (NEERAM___E-commerce_Website.png), Neeram Kerala Spices (brand) (+5 more)

### Community 10 - "next"
Cohesion: 0.09
Nodes (34): lenis, anton, antonRupee, balooChettan, fontVariables, inter, interItalic, interRupee (+26 more)

### Community 11 - "preview_frames.mjs"
Cohesion: 0.20
Nodes (8): sharp@^0.35.5, sharp, matched, pngs, projectRoot, root, run, venvPython

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.17
Nodes (11): Finding the private key inside the file, If no row appears, Later: replacing the key, Part 1: Create a Google Cloud project, Part 2: Turn on the Google Sheets API, Part 3: Create the robot account (service account), Part 4: Create the robot's key, Part 5: Create the order sheet and share it with the robot (+3 more)

### Community 13 - "Oil Fills the Name - Wordmark Loader Prototype"
Cohesion: 0.19
Nodes (12): Hero Mock (under loader), Oil Fills the Name - Wordmark Loader Prototype, Bottle Slots (#bottle-slot-hero, #bottle-slot-feature), Neeram Coconut Oil 500 ml, Hero Slider (single coconut oil slide), Home Page (hero, oil feature, shelf, dish list, look-before-you-open), Phase 1 (oil-only launch), prefers-reduced-motion Handling (+4 more)

### Community 14 - "CheckoutForm.tsx"
Cohesion: 0.06
Nodes (48): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work, Controls in place, Dependency audit, Personal data, Security headers (+40 more)

### Community 15 - "Performance log"
Cohesion: 0.29
Nodes (6): Attempts, Baseline (10 November 2026), Baseline (6 November 2026), How to measure, Open problems, Performance log

### Community 17 - "products.ts"
Cohesion: 0.07
Nodes (38): robots(), HelpPage(), metadata, sections, SiteLayout(), metadata, PrivacyPage(), sections (+30 more)

### Community 18 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, cf-typegen, deploy, dev, frames, lint, preview (+4 more)

### Community 19 - "sheet.ts"
Cohesion: 0.15
Nodes (20): PricedItem, Deps, NewOrder, save(), saveOrder(), worthRetrying(), accessToken(), appendRow() (+12 more)

### Community 21 - "dependencies"
Cohesion: 0.15
Nodes (12): dependencies, gsap@^3.15.0, lenis@^1.3.27, next@16.4.3, @opennextjs/cloudflare@^1.20.14, react@19.3.0, react-dom@19.3.0, zustand@^5.0.16 (+4 more)

### Community 22 - "Neeram SEO plan"
Cohesion: 0.25
Nodes (7): Advice we're not following, and why, AI search (GEO / AEO), Already built, Commands, Neeram SEO plan, Off-page: done outside the website, by the business, To do at launch

### Community 23 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.3, eslint, eslint-config-next

### Community 24 - "Launch checklist"
Cohesion: 0.22
Nodes (8): 1. Orders reach Neeram, 2. Bot protection, 3. Legal, 4. Hosting, 5. Check it end to end, 6. Access, 7. Nice to have before launch, Launch checklist

### Community 25 - "vitest"
Cohesion: 0.18
Nodes (6): body, { privateKey }, scheduled, order, { privateKey }, sheetEnv

### Community 26 - "@playwright/test"
Cohesion: 0.25
Nodes (3): pages, @playwright/test@^1.64.1, @playwright/test

### Community 27 - "CookieNotice.tsx"
Cohesion: 0.26
Nodes (8): Choice, CookieNotice(), isDismissed(), listeners, save(), subscribe(), Box, rectsOverlap()

### Community 28 - "render_bottle.py"
Cohesion: 0.25
Nodes (3): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, Python script deps (numpy>=2, pillow>=11)

### Community 29 - "extract_design_assets.mjs"
Cohesion: 0.22
Nodes (7): closeUps, cutout, jars, OUT, photos, ROOT, SRC

### Community 30 - "vitest"
Cohesion: 0.22
Nodes (3): vitest, guide, ORDER_SHEET_HEADERS

### Community 31 - "build() GSAP loader timeline"
Cohesion: 0.29
Nodes (7): aim() stream position, build() GSAP loader timeline, frame() rAF oil render, level() oil height, play(), schedule() simulated load steps, seg() toggle controls

### Community 32 - "Razorpay Payments (test mode, mock fallback)"
Cohesion: 0.29
Nodes (7): Zustand Cart (localStorage), Razorpay Payments (test mode, mock fallback), POST /api/checkout, POST /api/checkout/verify, /api/subscribe (newsletter + notify-me), src/lib/store-json.ts (JSONL storage), Coconut Oil Price (null placeholder)

### Community 33 - "Client Content Checklist (TODO_CONTENT)"
Cohesion: 0.29
Nodes (6): Five Coming-Soon Spices (Malabar Tamarind, Turmeric, Black Pepper, Tamarind, Shankupushpam), Phase 2 (Our story, Kitchen, recipes, spice pages), Launching a Spice (coming soon to available), Client Content Checklist (TODO_CONTENT), Help / Legal Page (src/app/(site)/help/page.tsx), Placeholder Photography (cropped from Figma)

### Community 34 - "ref_node_path"
Cohesion: 0.43
Nodes (4): appendRecord(), DATA_DIR, recordPath(), data

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Python script deps (numpy>=2, pillow>=11)`, `aim() stream position`, `level() oil height` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 232 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `ui.tsx` to `[slug]/page.tsx`, `package.json`, `[slug]/page.tsx`, `next`, `CheckoutForm.tsx`, `products.ts`, `dependencies`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **What connects `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Python script deps (numpy>=2, pillow>=11)` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11055900621118013 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `[slug]/page.tsx`, `schema.ts`, `ref_node_path`, `package.json`, `next`, `CheckoutForm.tsx`, `products.ts`, `sheet.ts`, `vitest`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07596153846153846 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[slug]/page.tsx` to `[slug]/page.tsx`, `ui.tsx`, `package.json`, `next`, `CheckoutForm.tsx`, `products.ts`, `dependencies`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._