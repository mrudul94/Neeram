# Graph Report - Neeram  (2026-11-06)

## Corpus Check
- 111 files · ~49,915 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .woff2 5, .example 2, (none) 2)

## Summary
- 630 nodes · 1600 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `353a0665`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CookieNotice.tsx
- ui.tsx
- schema.ts
- Frame Conversion Scripts
- package.json
- [slug]/page.tsx
- Colour Matching Script
- Website Design Board
- TypeScript Config
- BottleStage.tsx
- next
- checkout.ts
- Setting up the Neeram order sheet
- Neeram Website Build Brief
- CheckoutForm.tsx
- Performance log
- README.md
- content.ts
- scripts
- sheet.ts
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- Launch checklist
- turnstile.ts
- @playwright/test
- render_bottle.py
- vitest
- Pending work
- Client Content Checklist (TODO_CONTENT)
- build() GSAP loader timeline
- 3D Scroll-Spinning Bottle Animation
- Razorpay Payments (test mode, mock fallback)
- Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)
- sheet-guide.test.ts

## God Nodes (most connected - your core abstractions)
1. `cx()` - 37 edges
2. `next` - 35 edges
3. `getProduct()` - 32 edges
4. `react` - 25 edges
5. `AvailableProduct()` - 25 edges
6. `formatPrice()` - 25 edges
7. `Eyebrow()` - 23 edges
8. `isAvailable()` - 23 edges
9. `useCart` - 22 edges
10. `vitest` - 19 edges

## Surprising Connections (you probably didn't know these)
- `2. Bot protection` --references--> `POST()`  [INFERRED]
  docs/LAUNCH_CHECKLIST.md → src/app/api/checkout/route.ts
- `1. Review fixes: done in local commits, not yet pushed` --references--> `formatPhone()`  [INFERRED]
  docs/LATER.md → src/lib/checkout.ts
- `Oil Fills the Name - Wordmark Loader Prototype` --semantically_similar_to--> `BottleStage component`  [INFERRED] [semantically similar]
  design/neeram-oil-wordmark.html → README.md
- `Oil Fills the Name - Wordmark Loader Prototype` --references--> `Neeram Coconut Oil 500 ml`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md
- `Oil Fills the Name - Wordmark Loader Prototype` --conceptually_related_to--> `prefers-reduced-motion Handling`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (36 total, 3 thin omitted)

### Community 0 - "CookieNotice.tsx"
Cohesion: 0.26
Nodes (8): Choice, CookieNotice(), isDismissed(), listeners, save(), subscribe(), Box, rectsOverlap()

### Community 1 - "ui.tsx"
Cohesion: 0.10
Nodes (36): CheckoutLayout(), AboutPage(), chapters, figures, metadata, promises, steps, HelpPage() (+28 more)

### Community 2 - "schema.ts"
Cohesion: 0.45
Nodes (11): Faq, absolute(), breadcrumbSchema(), compact(), faqSchema(), ORG_ID(), organizationSchema(), productSchema() (+3 more)

### Community 3 - "Frame Conversion Scripts"
Cohesion: 0.05
Nodes (29): notice(), noticeWaitsForTheShelf(), sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir (+21 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "[slug]/page.tsx"
Cohesion: 0.11
Nodes (53): accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), generateMetadata(), ProductContent(), ProductPage(), SameShelf() (+45 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.16
Nodes (14): apply(), corners(), fit(), identity_lut(), load_rgba(), logo_red(), main(), pair_mask() (+6 more)

### Community 7 - "Website Design Board"
Cohesion: 0.40
Nodes (6): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Coconut Oil Open Graph Image

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "BottleStage.tsx"
Cohesion: 0.17
Nodes (22): addPhotoMotion(), BottleMover(), BottleStill(), frameTurn(), startTravel(), FeatureStage(), SwapText(), BASELINE (+14 more)

### Community 10 - "next"
Cohesion: 0.07
Nodes (43): nextConfig, lenis, next, react, anton, antonRupee, balooChettan, fontVariables (+35 more)

### Community 11 - "checkout.ts"
Cohesion: 0.21
Nodes (17): POST(), BOT_CHECK_FAILED(), filledHoneypot(), HONEYPOT_FIELD, CheckoutDetails, CheckoutLine, compactPhone(), DETAIL_FIELDS (+9 more)

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.17
Nodes (11): Finding the private key inside the file, If no row appears, Later: replacing the key, Part 1: Create a Google Cloud project, Part 2: Turn on the Google Sheets API, Part 3: Create the robot account (service account), Part 4: Create the robot's key, Part 5: Create the order sheet and share it with the robot (+3 more)

### Community 13 - "Neeram Website Build Brief"
Cohesion: 0.21
Nodes (12): Hero Mock (under loader), Oil Fills the Name - Wordmark Loader Prototype, Neeram_Coconut_Oil_Bottle_Cutout.png, Neeram Website Build Brief, Design Tokens (cream, sand, ink, orange, turmeric, muted), Figma Export (NEERAM___E-commerce_Website.png), Hero Slider (single coconut oil slide), Home Page (hero, oil feature, shelf, dish list, look-before-you-open) (+4 more)

### Community 14 - "CheckoutForm.tsx"
Cohesion: 0.16
Nodes (18): CheckoutPage(), metadata, Channel, CheckoutForm(), onSubmit(), Choice(), Field(), Step() (+10 more)

### Community 15 - "Performance log"
Cohesion: 0.33
Nodes (5): Attempts, Baseline (6 November 2026), How to measure, Open problems, Performance log

### Community 17 - "content.ts"
Cohesion: 0.08
Nodes (33): robots(), SiteLayout(), metadata, PrivacyPage(), sections, metadata, sections, TermsPage() (+25 more)

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

### Community 25 - "turnstile.ts"
Cohesion: 0.33
Nodes (3): Deps, live, TurnstileResult

### Community 26 - "@playwright/test"
Cohesion: 0.25
Nodes (3): pages, @playwright/test@^1.64.1, @playwright/test

### Community 27 - "render_bottle.py"
Cohesion: 0.25
Nodes (3): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, Python script deps (numpy>=2, pillow>=11)

### Community 28 - "vitest"
Cohesion: 0.15
Nodes (7): vitest, body, { privateKey }, scheduled, order, { privateKey }, sheetEnv

### Community 29 - "Pending work"
Cohesion: 0.40
Nodes (4): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work

### Community 30 - "Client Content Checklist (TODO_CONTENT)"
Cohesion: 0.22
Nodes (8): Neeram Coconut Oil 500 ml, Five Coming-Soon Spices (Malabar Tamarind, Turmeric, Black Pepper, Tamarind, Shankupushpam), Phase 1 (oil-only launch), Phase 2 (Our story, Kitchen, recipes, spice pages), Launching a Spice (coming soon to available), Client Content Checklist (TODO_CONTENT), Help / Legal Page (src/app/(site)/help/page.tsx), Placeholder Photography (cropped from Figma)

### Community 31 - "build() GSAP loader timeline"
Cohesion: 0.29
Nodes (7): aim() stream position, build() GSAP loader timeline, frame() rAF oil render, level() oil height, play(), schedule() simulated load steps, seg() toggle controls

### Community 32 - "3D Scroll-Spinning Bottle Animation"
Cohesion: 0.38
Nodes (5): Bottle Slots (#bottle-slot-hero, #bottle-slot-feature), prefers-reduced-motion Handling, BottleMover wrapper, BottleStage component, npm run frames (PNG to WebP)

### Community 33 - "Razorpay Payments (test mode, mock fallback)"
Cohesion: 0.29
Nodes (7): Zustand Cart (localStorage), Razorpay Payments (test mode, mock fallback), POST /api/checkout, POST /api/checkout/verify, /api/subscribe (newsletter + notify-me), src/lib/store-json.ts (JSONL storage), Coconut Oil Price (null placeholder)

### Community 34 - "Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand)"
Cohesion: 0.33
Nodes (6): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), Tech Stack (Next.js App Router, TS, Tailwind, GSAP, Lenis, Zustand), Neeram Website README, Vercel Deployment (NEXT_PUBLIC_SITE_URL)

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `POST /api/checkout/verify`, `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height`, `schedule() simulated load steps` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 221 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `CookieNotice.tsx`, `ui.tsx`, `package.json`, `[slug]/page.tsx`, `BottleStage.tsx`, `checkout.ts`, `CheckoutForm.tsx`, `content.ts`, `dependencies`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **What connects `POST /api/checkout/verify`, `generate-agent-files.js (next dev)`, `aim() stream position` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09714285714285714 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `CookieNotice.tsx`, `schema.ts`, `Frame Conversion Scripts`, `package.json`, `[slug]/page.tsx`, `sheet-guide.test.ts`, `next`, `checkout.ts`, `content.ts`, `sheet.ts`, `turnstile.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `Frame Conversion Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `CookieNotice.tsx`, `ui.tsx`, `package.json`, `[slug]/page.tsx`, `BottleStage.tsx`, `CheckoutForm.tsx`, `content.ts`, `dependencies`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._