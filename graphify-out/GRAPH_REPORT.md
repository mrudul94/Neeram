# Graph Report - Neeram  (2026-11-10)

## Corpus Check
- 114 files · ~53,259 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .woff2 5, .example 2, (none) 2)

## Summary
- 652 nodes · 1673 edges · 33 communities (30 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e82fe29c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- ui.tsx
- CheckoutForm.tsx
- convert_frames.mjs
- package.json
- [slug]/page.tsx
- Colour Matching Script
- Website Design Board
- TypeScript Config
- Neeram Website Build Brief
- next
- Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)
- Setting up the Neeram order sheet
- 3D Scroll-Spinning Bottle Animation
- checkout.ts
- Performance log
- README.md
- products.ts
- scripts
- Security notes
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- Launch checklist
- next.config.ts
- @playwright/test
- CookieNotice.tsx
- render_bottle.py
- build() GSAP loader timeline
- Razorpay Payments (test mode, mock fallback)
- Client Content Checklist (TODO_CONTENT)
- legal.spec.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 38 edges
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
- `Oil Fills the Name - Wordmark Loader Prototype` --semantically_similar_to--> `BottleStage component`  [INFERRED] [semantically similar]
  design/neeram-oil-wordmark.html → README.md
- `Controls in place` --references--> `pickDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts
- `Controls in place` --references--> `validateDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (33 total, 3 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.10
Nodes (61): accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), generateMetadata(), ProductContent(), ProductPage(), SameShelf() (+53 more)

### Community 1 - "ui.tsx"
Cohesion: 0.08
Nodes (50): next, react, CheckoutLayout(), AboutPage(), chapters, figures, metadata, promises (+42 more)

### Community 2 - "CheckoutForm.tsx"
Cohesion: 0.10
Nodes (31): Zustand Cart (localStorage), Razorpay Payments (test mode, mock fallback), POST /api/checkout/verify, CheckoutPage(), metadata, Channel, CheckoutForm(), onSubmit() (+23 more)

### Community 3 - "convert_frames.mjs"
Cohesion: 0.06
Nodes (27): sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir, pngs, projectRoot (+19 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "[slug]/page.tsx"
Cohesion: 0.16
Nodes (25): addPhotoMotion(), BottleMover(), BottleStill(), frameTurn(), startTravel(), FeatureAddButton(), FeatureStage(), SwapText() (+17 more)

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
Cohesion: 0.21
Nodes (12): Hero Mock (under loader), Oil Fills the Name - Wordmark Loader Prototype, Neeram_Coconut_Oil_Bottle_Cutout.png, Neeram Website Build Brief, Design Tokens (cream, sand, ink, orange, turmeric, muted), Figma Export (NEERAM___E-commerce_Website.png), Hero Slider (single coconut oil slide), Home Page (hero, oil feature, shelf, dish list, look-before-you-open) (+4 more)

### Community 10 - "next"
Cohesion: 0.08
Nodes (30): lenis, anton, antonRupee, balooChettan, fontVariables, inter, interItalic, interRupee (+22 more)

### Community 11 - "Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)"
Cohesion: 0.33
Nodes (6): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand), Neeram Website README, Vercel Deployment (NEXT_PUBLIC_SITE_URL)

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.17
Nodes (11): Finding the private key inside the file, If no row appears, Later: replacing the key, Part 1: Create a Google Cloud project, Part 2: Turn on the Google Sheets API, Part 3: Create the robot account (service account), Part 4: Create the robot's key, Part 5: Create the order sheet and share it with the robot (+3 more)

### Community 13 - "3D Scroll-Spinning Bottle Animation"
Cohesion: 0.38
Nodes (5): Bottle Slots (#bottle-slot-hero, #bottle-slot-feature), prefers-reduced-motion Handling, BottleMover wrapper, BottleStage component, npm run frames (PNG to WebP)

### Community 14 - "checkout.ts"
Cohesion: 0.05
Nodes (53): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work, Controls in place, vitest, POST(), body (+45 more)

### Community 15 - "Performance log"
Cohesion: 0.29
Nodes (6): Attempts, Baseline (10 November 2026), Baseline (6 November 2026), How to measure, Open problems, Performance log

### Community 17 - "products.ts"
Cohesion: 0.09
Nodes (31): robots(), HelpPage(), metadata, sections, metadata, PrivacyPage(), sections, metadata (+23 more)

### Community 18 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, cf-typegen, deploy, dev, frames, lint, preview (+4 more)

### Community 19 - "Security notes"
Cohesion: 0.33
Nodes (5): Dependency audit, Personal data, Security headers, Security notes, What there is to protect

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

### Community 25 - "next.config.ts"
Cohesion: 0.50
Nodes (3): csp, nextConfig, securityHeaders

### Community 26 - "@playwright/test"
Cohesion: 0.25
Nodes (3): pages, @playwright/test@^1.64.1, @playwright/test

### Community 27 - "CookieNotice.tsx"
Cohesion: 0.26
Nodes (8): Choice, CookieNotice(), isDismissed(), listeners, save(), subscribe(), Box, rectsOverlap()

### Community 28 - "render_bottle.py"
Cohesion: 0.25
Nodes (3): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, Python script deps (numpy>=2, pillow>=11)

### Community 31 - "build() GSAP loader timeline"
Cohesion: 0.29
Nodes (7): aim() stream position, build() GSAP loader timeline, frame() rAF oil render, level() oil height, play(), schedule() simulated load steps, seg() toggle controls

### Community 32 - "Razorpay Payments (test mode, mock fallback)"
Cohesion: 0.29
Nodes (7): POST /api/checkout, /api/subscribe (newsletter + notify-me), src/lib/store-json.ts (JSONL storage), Client Content Checklist (TODO_CONTENT), Coconut Oil Price (null placeholder), Help / Legal Page (src/app/(site)/help/page.tsx), Placeholder Photography (cropped from Figma)

### Community 33 - "Client Content Checklist (TODO_CONTENT)"
Cohesion: 0.33
Nodes (5): Neeram Coconut Oil 500 ml, Five Coming-Soon Spices (Malabar Tamarind, Turmeric, Black Pepper, Tamarind, Shankupushpam), Phase 1 (oil-only launch), Phase 2 (Our story, Kitchen, recipes, spice pages), Launching a Spice (coming soon to available)

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Python script deps (numpy>=2, pillow>=11)`, `aim() stream position`, `level() oil height` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `ui.tsx` to `[slug]/page.tsx`, `CheckoutForm.tsx`, `package.json`, `[slug]/page.tsx`, `next`, `checkout.ts`, `products.ts`, `dependencies`, `next.config.ts`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `Certificates (FSSAI, Agmark, ISO 22000)`, `Govindan Oil Mill, Kasaragod`, `Python script deps (numpy>=2, pillow>=11)` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0967218435572866 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `checkout.ts` to `[slug]/page.tsx`, `CheckoutForm.tsx`, `convert_frames.mjs`, `package.json`, `products.ts`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08226768968456948 - nodes in this community are weakly interconnected._
- **Why does `react` connect `ui.tsx` to `[slug]/page.tsx`, `CheckoutForm.tsx`, `package.json`, `[slug]/page.tsx`, `next`, `products.ts`, `dependencies`, `CookieNotice.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._