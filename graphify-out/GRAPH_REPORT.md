# Graph Report - Neeram  (2026-11-19)

## Corpus Check
- 121 files · ~56,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .woff2 5, .example 2, (none) 2)

## Summary
- 682 nodes · 1780 edges · 37 communities (35 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29760f64`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- next
- checkout.ts
- convert_frames.mjs
- package.json
- [slug]/page.tsx
- Colour Matching Script
- Website Design Board
- TypeScript Config
- seo.ts
- app/layout.tsx
- CookieNotice.tsx
- Setting up the Neeram order sheet
- Neeram Website Build Brief
- sheet.ts
- Performance log
- README.md
- content.ts
- scripts
- privacy/page.tsx
- CLAUDE.md
- dependencies
- Neeram SEO plan
- eslint.config.mjs
- Launch checklist
- cart.ts
- @playwright/test
- checkout/route.ts
- format.ts
- schema.ts
- vitest
- contact.ts
- Security notes
- about/page.tsx
- site-url.ts
- turnstile.ts
- Pending work

## God Nodes (most connected - your core abstractions)
1. `next` - 39 edges
2. `cx()` - 39 edges
3. `getProduct()` - 32 edges
4. `Eyebrow()` - 27 edges
5. `formatPrice()` - 27 edges
6. `react` - 26 edges
7. `AvailableProduct()` - 26 edges
8. `isAvailable()` - 23 edges
9. `useCart` - 22 edges
10. `vitest` - 21 edges

## Surprising Connections (you probably didn't know these)
- `1. Review fixes: done in local commits, not yet pushed` --references--> `formatPhone()`  [INFERRED]
  docs/LATER.md → src/lib/checkout.ts
- `Controls in place` --references--> `validateDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts
- `Controls in place` --references--> `fromOtherSite()`  [INFERRED]
  docs/SECURITY.md → src/lib/bot-check.ts
- `Controls in place` --references--> `pickDetails()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts
- `Controls in place` --references--> `priceLines()`  [INFERRED]
  docs/SECURITY.md → src/lib/checkout.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bottle frame pipeline: Blender render -> WebP -> scroll canvas** — neeram_build_prompt_neeram_bottle_blend, scripts_render_bottle, readme_npm_run_frames, readme_bottlestage, readme_bottlemover [EXTRACTED 1.00]
- **Status-driven coming-soon to available launch flow** — neeram_build_prompt_product_status_field, src_data_products, src_data_content, readme_launching_a_spice, neeram_build_prompt_coming_soon_spices [EXTRACTED 1.00]
- **Checkout and Razorpay payment flow** — src_store_cart, readme_api_checkout, readme_api_checkout_verify, neeram_build_prompt_razorpay, src_components_checkout_checkoutform [INFERRED 0.85]

## Communities (37 total, 2 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.09
Nodes (66): AboutPage(), NotFound(), accordions(), AvailableProduct(), Breadcrumb(), ComingSoonProduct(), generateMetadata(), ProductContent() (+58 more)

### Community 1 - "next"
Cohesion: 0.29
Nodes (4): csp, nextConfig, securityHeaders, next

### Community 2 - "checkout.ts"
Cohesion: 0.26
Nodes (12): onSubmit(), CheckoutDetails, CheckoutLine, compactPhone(), DETAIL_FIELDS, formatPhone(), MAX_LENGTHS, newOrderNumber() (+4 more)

### Community 3 - "convert_frames.mjs"
Cohesion: 0.05
Nodes (29): notice(), noticeWaitsForTheShelf(), sharp@^0.35.5, sharp, desktopDir, match, matchedDir, mobileDir (+21 more)

### Community 4 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^22.20.5, @types/react@^19, @types/react-dom@^19, typescript@^5, vitest@^5.0.5 (+11 more)

### Community 5 - "[slug]/page.tsx"
Cohesion: 0.09
Nodes (35): lenis, SiteLayout(), Footer(), addPhotoMotion(), BottleMover(), BottleStage(), BottleStill(), frameTurn() (+27 more)

### Community 6 - "Colour Matching Script"
Cohesion: 0.10
Nodes (18): Blender Frame Rendering (Phase 0), blender/Neeram_Bottle.blend, npm run frames (PNG to WebP), apply(), corners(), fit(), identity_lut(), load_rgba() (+10 more)

### Community 7 - "Website Design Board"
Cohesion: 0.40
Nodes (6): Coconut Pour Video Poster (Desktop 16:9), Coconut Pour Video Poster (Mobile 9:16), Neeram Coconut Oil Bottle (Glow on Black), Neeram Coconut Oil 500ml Double Filtered, Govindan Oil Mill (Manufacturer, Kasaragod), Coconut Oil Open Graph Image

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "seo.ts"
Cohesion: 0.33
Nodes (9): robots(), sitemap(), products, isSiteLive(), OpenGraph, pageLinks(), robotsRules(), sharedOpenGraph (+1 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.15
Nodes (12): anton, antonRupee, balooChettan, fontVariables, inter, interItalic, interRupee, notoMalayalam (+4 more)

### Community 11 - "CookieNotice.tsx"
Cohesion: 0.26
Nodes (8): Choice, CookieNotice(), isDismissed(), listeners, save(), subscribe(), Box, rectsOverlap()

### Community 12 - "Setting up the Neeram order sheet"
Cohesion: 0.17
Nodes (11): Finding the private key inside the file, If no row appears, Later: replacing the key, Part 1: Create a Google Cloud project, Part 2: Turn on the Google Sheets API, Part 3: Create the robot account (service account), Part 4: Create the robot's key, Part 5: Create the order sheet and share it with the robot (+3 more)

### Community 13 - "Neeram Website Build Brief"
Cohesion: 0.05
Nodes (44): generate-agent-files.js (next dev), node_modules/next/dist/docs, Next.js Breaking Changes Notice (AGENTS.md), aim() stream position, build() GSAP loader timeline, frame() rAF oil render, Hero Mock (under loader), level() oil height (+36 more)

### Community 14 - "sheet.ts"
Cohesion: 0.15
Nodes (20): PricedItem, Deps, NewOrder, save(), saveOrder(), worthRetrying(), accessToken(), appendRow() (+12 more)

### Community 15 - "Performance log"
Cohesion: 0.29
Nodes (6): Attempts, Baseline (10 November 2026), Baseline (6 November 2026), How to measure, Open problems, Performance log

### Community 17 - "content.ts"
Cohesion: 0.27
Nodes (8): columns, Certificate, helpLinks, legalLinks, site, Certificates (FSSAI, Agmark, ISO 22000), FSSAI Licence (fssaiLicence), Govindan Oil Mill, Kasaragod

### Community 18 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, cf-typegen, deploy, dev, frames, lint, preview (+4 more)

### Community 19 - "privacy/page.tsx"
Cohesion: 0.29
Nodes (8): metadata, PrivacyPage(), sections, metadata, sections, TermsPage(), LegalPage(), LegalSection

### Community 21 - "dependencies"
Cohesion: 0.15
Nodes (12): dependencies, gsap@^3.15.0, lenis@^1.3.27, next@16.4.6, @opennextjs/cloudflare@^1.20.14, react@19.3.0, react-dom@19.3.0, zustand@^5.0.16 (+4 more)

### Community 22 - "Neeram SEO plan"
Cohesion: 0.25
Nodes (7): Advice we're not following, and why, AI search (GEO / AEO), Already built, Commands, Neeram SEO plan, Off-page: done outside the website, by the business, To do at launch

### Community 23 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 24 - "Launch checklist"
Cohesion: 0.20
Nodes (9): 1. Orders reach Neeram, 2. Bot protection, 2b. Contact form email (Resend), 3. Legal, 4. Hosting, 5. Check it end to end, 6. Access, 7. Nice to have before launch (+1 more)

### Community 25 - "cart.ts"
Cohesion: 0.07
Nodes (53): react, CheckoutPage(), metadata, CheckoutLayout(), CartDrawer(), CartDrawer, CartDrawerLazy(), load() (+45 more)

### Community 26 - "@playwright/test"
Cohesion: 0.22
Nodes (3): pages, @playwright/test@^1.64.1, @playwright/test

### Community 27 - "checkout/route.ts"
Cohesion: 0.32
Nodes (12): Controls in place, POST(), POST(), unavailable(), BOT_CHECK_FAILED(), CROSS_SITE_REFUSED(), filledHoneypot(), fromOtherSite() (+4 more)

### Community 28 - "format.ts"
Cohesion: 0.25
Nodes (7): ContactPage(), metadata, HelpPage(), metadata, sections, inr, toBeConfirmed()

### Community 29 - "schema.ts"
Cohesion: 0.17
Nodes (23): HomePage(), metadata, HeroSlider(), useHeadlineFontMissing(), callouts, LookBeforeYouOpen(), ChevronRight(), HeroSlide (+15 more)

### Community 30 - "vitest"
Cohesion: 0.11
Nodes (9): vitest, body, { privateKey }, scheduled, order, { privateKey }, sheetEnv, guide (+1 more)

### Community 31 - "contact.ts"
Cohesion: 0.25
Nodes (9): CONTACT_LIMITS, contactEmail(), ContactMessage, Deps, FIELDS, oneLine(), sendContactEmail(), SendResult (+1 more)

### Community 32 - "Security notes"
Cohesion: 0.33
Nodes (5): Dependency audit, Personal data, Security headers, Security notes, What there is to protect

### Community 33 - "about/page.tsx"
Cohesion: 0.33
Nodes (5): chapters, figures, metadata, promises, steps

### Community 34 - "site-url.ts"
Cohesion: 0.60
Nodes (3): LOCAL_HOSTS, problemWith(), resolveSiteUrl()

### Community 35 - "turnstile.ts"
Cohesion: 0.33
Nodes (3): Deps, live, TurnstileResult

### Community 36 - "Pending work"
Cohesion: 0.40
Nodes (4): 1. Review fixes: done in local commits, not yet pushed, 2. Hosting on Cloudflare instead of Vercel, 3. Before launch, Pending work

## Ambiguous Edges - Review These
- `render_bottle.py` → `Python script deps (numpy>=2, pillow>=11)`  [AMBIGUOUS]
  scripts/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **18 isolated node(s):** `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height`, `schedule() simulated load steps`, `seg() toggle controls` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 243 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `[slug]/page.tsx`, `about/page.tsx`, `package.json`, `[slug]/page.tsx`, `seo.ts`, `app/layout.tsx`, `CookieNotice.tsx`, `content.ts`, `privacy/page.tsx`, `dependencies`, `cart.ts`, `checkout/route.ts`, `format.ts`, `schema.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **What connects `generate-agent-files.js (next dev)`, `aim() stream position`, `level() oil height` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0905608755129959 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `[slug]/page.tsx`, `checkout.ts`, `convert_frames.mjs`, `package.json`, `site-url.ts`, `turnstile.ts`, `seo.ts`, `CookieNotice.tsx`, `sheet.ts`, `cart.ts`, `checkout/route.ts`, `format.ts`, `schema.ts`, `contact.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `convert_frames.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._
- **Why does `react` connect `cart.ts` to `[slug]/page.tsx`, `package.json`, `[slug]/page.tsx`, `CookieNotice.tsx`, `privacy/page.tsx`, `dependencies`, `schema.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `render_bottle.py` and `Python script deps (numpy>=2, pillow>=11)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._