# Performance log

Read this before trying a speed change, so an idea that already failed isn't tried again.

## How to measure

Run Lighthouse against a local production build (`npm run build`, then `npx next start`), with
`--throttling-method=devtools` and mobile settings.

**Don't compare separate batches.** On the development machine the same code measured 2.85 s and
then 3.35 s for the home page's LCP, an hour apart. That drift is bigger than most fixes. Build both
versions, run them alternately (A, B, A, B), and compare each pair. For changes that only affect
downloads, add `--throttling.cpuSlowdownMultiplier=1`, which cuts the noise to about ±50 ms.

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

## Open problems

- **Layout shift on the home page:** CLS 0.114–0.239 on a phone, depending on when the fonts
  arrive (the good limit is 0.1, poor is above 0.25). Lighthouse points at the bottle slot in the
  hero (`section.relative > div.wrap > div.grid > div.flex`). It happens without the changes above too.
- Product page CLS is about 0.06 with fast CPU settings, and comes from the same kind of late font swap.
