# Graph Report - Neeram  (2026-11-04)

## Corpus Check
- 108 files · ~47,585 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .woff2 4, .example 2, (none) 2)

## Summary
- 620 nodes · 1578 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fee81189`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- ui.tsx
- [slug]/page.tsx
- Frame Conversion Scripts
- package.json
- Home Bottle & Feature Stage
- Colour Matching Script
- Website Design Board
- TypeScript Config
- legal.spec.ts
- CheckoutForm.tsx
- sheet.ts
- Setting up the Neeram order sheet
- Neeram Website Build Brief
- content.ts
- cart.ts
- README.md
- checkout.ts
- scripts
- vitest
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- Launch checklist
- turnstile.ts
- @playwright/test
- Pending work
- sheet-guide.test.ts

## God Nodes (most connected - your core abstractions)
1. `cx()` - 37 edges
2. `next` - 35 edges
3. `getProduct()` - 32 edges
4. `react` - 25 edges
5. `AvailableProduct()` - 25 edges
6. `Eyebrow()` - 23 edges
7. `isAvailable()` - 23 edges
8. `formatPrice()` - 23 edges
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
- `Oil Fills the Name - Wordmark Loader Prototype` --implements--> `Typography (Anton, Newsreader, Inter, Baloo Chettan 2, Noto Sans Malayalam)`  [INFERRED]
  design/neeram-oil-wordmark.html → NEERAM_BUILD_PROMPT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (29 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.09
Nodes (26): anton, antonRupee, balooChettan, fontVariables, inter, interItalic, interRupee, notoMalayalam (+18 more)

### Community 1 - "ui.tsx"
Cohesion: 0.11
Nodes (34): nextConfig, next, CheckoutLayout(), AboutPage(), chapters, figures, metadata, promises (+26 more)

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.14
Nodes (30): react, accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), ProductContent(), ProductPage(), SameShelf() (+22 more)

### Community 3 - "Frame Conversion Scripts"
Cohesion: 0.06
Nodes (28): sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir, pngs, projectRoot (+20 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "Home Bottle & Feature Stage"
Cohesion: 0.10
Nodes (57): generateMetadata(), AddToCartButton(), ChosenPackLabel(), MobileBuyBar(), PackPicker(), PackPrice(), PurchasePanel(), useChosenPack() (+49 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.10
Nodes (17): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, apply(), corners(), fit(), identity_lut(), load_rgba(), logo_red() (+9 more)

### Community 7 - "Website Design Board"
Cohesion: 0.40
Nodes (6): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Coconut Oil Open Graph Image

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "CheckoutForm.tsx"
Cohesion: 0.16
Nodes (18): CheckoutPage(), metadata, Channel, CheckoutForm(), onSubmit(), Choice(), Field(), Step() (+10 more)

### Community 11 - "sheet.ts"
Cohesion: 0.15
Nodes (20): PricedItem, Deps, NewOrder, save(), saveOrder(), worthRetrying(), accessToken(), appendRow() (+12 more)

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.17
Nodes (11): Finding the private key inside the file, If no row appears, Later: replacing the key, Part 1: Create a Google Cloud project, Part 2: Turn on the Google Sheets API, Part 3: Create the robot account (service account), Part 4: Create the robot's key, Part 5: Create the order sheet and share it with the robot (+3 more)

### Community 13 - "Neeram Website Build Brief"
Cohesion: 0.05
Nodes (42): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), aim() stream position, build() GSAP loader timeline, frame() rAF oil render, Hero Mock (under loader), level() oil height (+34 more)

### Community 14 - "content.ts"
Cohesion: 0.09
Nodes (27): SiteLayout(), metadata, PrivacyPage(), sections, metadata, sections, TermsPage(), columns (+19 more)

### Community 15 - "cart.ts"
Cohesion: 0.10
Nodes (32): lenis, CartDrawer(), CartDrawer, CartDrawerLazy(), load(), CartButton(), Header(), nav (+24 more)

### Community 17 - "checkout.ts"
Cohesion: 0.21
Nodes (17): POST(), BOT_CHECK_FAILED(), filledHoneypot(), HONEYPOT_FIELD, CheckoutDetails, CheckoutLine, compactPhone(), DETAIL_FIELDS (+9 more)

### Community 18 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, cf-typegen, deploy, dev, frames, lint, preview (+4 more)

### Community 19 - "vitest"
Cohesion: 0.15
Nodes (7): vitest, body, { privateKey }, scheduled, order, { privateKey }, sheetEnv

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
Cohesion: 0.29
Nodes (3): pages, @playwright/test@^1.64.1, @playwright/test

### Community 27 - "Pending work"
Cohesion: 0.40
Nodes (4): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height`, `schedule() simulated load steps`, `seg() toggle controls` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 215 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `ui.tsx` to `next`, `[slug]/page.tsx`, `package.json`, `Home Bottle & Feature Stage`, `CheckoutForm.tsx`, `content.ts`, `cart.ts`, `checkout.ts`, `dependencies`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `next`, `[slug]/page.tsx`, `Frame Conversion Scripts`, `package.json`, `Home Bottle & Feature Stage`, `sheet.ts`, `content.ts`, `cart.ts`, `checkout.ts`, `turnstile.ts`, `sheet-guide.test.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10545790934320073 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[slug]/page.tsx` to `next`, `ui.tsx`, `package.json`, `Home Bottle & Feature Stage`, `CheckoutForm.tsx`, `content.ts`, `cart.ts`, `dependencies`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._