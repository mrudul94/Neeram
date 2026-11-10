# Performance log

Read this before trying a speed change, so an idea that already failed isn't tried again.

## How to measure

Run Lighthouse against a local production build (`npm run build`, then `npx next start`), with
`--throttling-method=devtools` and mobile settings.

**Don't compare separate batches.** On the development machine the same code measured 2.85 s and
then 3.35 s for the home page's LCP, an hour apart. That drift is bigger than most fixes. Build both
versions, run them alternately (A, B, A, B), and compare each pair. For changes that only affect
downloads, add `--throttling.cpuSlowdownMultiplier=1`, which cuts the noise to about ±50 ms.

To run A and B side by side, copy each build's `.next` into its own folder outside the project,
with `public/`, `package.json`, `next.config.ts`, `tsconfig.json` and a junction to `node_modules`
(`mklink /J`), and start them on two ports. Never delete or swap the project's own `.next` while
`npm run dev` is running: the dev server keeps its files in `.next/dev`.

## Baseline (10 November 2026)

Local production build, Lighthouse mobile, devtools throttling, three runs each:

| Page | LCP | Total blocking time | CLS | Downloaded |
|---|---|---|---|---|
| Home | 2.7–5.3 s | 0.6–5.5 s | 0.000 | 546 KB |
| Product | 3.1–3.2 s | 1.3–2.2 s | 0.005 | 500 KB |
| Shop | 2.1–2.6 s | 0.6–1.3 s | 0.000 | 929 KB |
| Checkout | 1.7–1.9 s | 0.9–1.5 s | 0.015 | 330 KB |

- Home page layout shift is fixed (was 0.114–0.239; see "Stop the home hero shifting on phones
  as fonts load").
- Product LCP is the bottle photo: about 650 ms load delay, 1.25 s download (52 KB sharing the
  slow connection with fonts and scripts), then render delay (0.2 s at normal CPU, 0.8–1.6 s at 4×).
- Lighthouse credits the GSAP chunk with about 6 s of script time on every page. That is the
  ticker running every frame after the page has loaded (smooth scrolling); its long tasks start
  after 5 s and don't touch LCP.
- Shop downloads the five spice jar photos at about 95 KB each.

## Baseline (6 November 2026)

Live site, Lighthouse mobile:

- Home: LCP 4.4–5.0 s (simulated), about 4.0 s (devtools throttling). Server response about 30 ms.
- Product page: LCP 3.5–5.0 s (simulated), 3.7–4.1 s (devtools).
- The LCP image arrives early, then waits for the main thread and for other downloads.
  `gsap` and `lenis` already load after the page has loaded.

## Attempts

| Idea | Baseline → result | Verdict | Why |
|---|---|---|---|
| Smaller copy of the bottle photo for phones on the product page (`<picture>`, 93 KB → 53 KB) | Product LCP 2,638 → 2,392 ms, paired median −261 ms, faster in 5 of 6 | Kept | Label is still readable at 3× pixel density. Desktop keeps the full photo, and each device downloads only one. |
| Inter cut to weights 400–700 and Latin-1 (48 KB → 25 KB) | Paired LCP median −163 ms on home (3 of 4) and product (4 of 4) | Kept | It's preloaded ahead of the LCP image, so every KB counted. `src/lib/fonts.test.ts` guards the character set. |
| `fetchPriority="low"` on the hero background photo | Home LCP 2,852 → 3,295 ms, but a re-run of unchanged code gave 3,350 ms | Reverted | No difference beyond machine drift. Untested with the paired method. |
| Smaller logo (21 KB → 12 KB) | Not measured | Not done | About 45 ms at most, below what can be detected. |
| Load `gsap` and `lenis` only on desktop | Not measured | Not done | Already loaded after the page, and the footer wordmark animation needs `gsap` on phones too. |
| Preload the product page's bottle photo with React's `preload()`, one per screen size (`media`), sent as a `Link` header (10 Nov) | 6 pairs. Normal CPU: B slower in 6 of 6, median +60 ms. 4× CPU: B faster in 3 of 6, median +10 ms (spread −262 to +106) | Reverted | Load delay stayed about 650 ms: the browser already finds the photo early. It waits for bandwidth, not discovery. |

## Open problems

- **Product page LCP** is about 2.1 s at normal CPU and 2.7–3.6 s at 4× CPU. The photo competes
  for the connection with what loads first (two fonts, the 21 KB logo, about 160 KB of scripts),
  so the next idea to test is fewer bytes ahead of it, not earlier discovery.
- **Shop page weight:** 929 KB, mostly the coming-soon jar photos. They are below the LCP (the
  heading), so this costs data, not speed.
