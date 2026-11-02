# Pending work

Status as of 30 Oct 2026. Tick items off or delete them as they're done.

## 1. Review fixes: done in local commits, not yet pushed

Each was built test-first, and all 194 unit tests pass.

- [x] Limit field lengths and keep only known fields in checkout (`7409b11`). This also fixed a non-text field crashing the API with a 500.
- [x] Honeypot field on checkout and newsletter (`14a65e4`)
- [x] Tests for the subscribe route (`f366e59`) and for afternoon times (`02c2988`)
- [x] Retry sheet saves only on timeouts, network errors and 5xx (`b6c2ca4`)
- [x] Separate test-mode variable, `ORDERS_TEST_MODE=1` (`12e4ac4`)
- [x] Test that the setup guide's header rows match the code (`807ded9`)
- [x] `formatPhone` returns unrecognised numbers unchanged (`86a137f`)
- [x] Sheet dates written as `YYYY-MM-DD HH:mm` in IST (`02c2988`)
- [x] Push these commits

## 2. Hosting on Cloudflare instead of Vercel

Done and pushed:

- [x] OpenNext adapter, `wrangler.jsonc` and `open-next.config.ts`; `npm run preview` works (`ab54c91`)
- [x] Checked in the local Cloudflare preview:
  - [x] the checkout replies first, and the order is saved afterwards through `after()`/`waitUntil`;
  - [x] the dev-only file log is never used there.
- [x] Google token signing works in the Workers runtime with `node:crypto`, so no switch to Web Crypto was needed.
- [x] Images served as pre-sized WebP with no resizing service, so no Cloudflare Images cost (`c6b769a`). The hero's attributes were also fixed (`5376725`).
- [x] Cloudflare Turnstile on checkout and newsletter, verified server-side, with test keys in e2e (`192839a`). Also checked in the preview: a valid token passes, no token gets a 400, and the honeypot is still silent.

Docs (commit "Replace Vercel references with Cloudflare and add a launch checklist"):

- [x] Replace every Vercel reference with the Cloudflare equivalent. Covers `.env.example`, `.dev.vars.example`, `README.md`, `TODO_CONTENT.md`, `NEERAM_BUILD_PROMPT.md`, `.gitignore`, a comment in `src/lib/records.ts`, and `docs/ORDER_SHEET_SETUP.md` (Cloudflare secrets, Workers Logs, and the "same order number twice = one order" note).
  - `neeram.vercel.app` in `src/app/(site)/about/page.tsx` and `TODO_CONTENT.md` is deliberately kept: it's the address of the old site the content came from.
- [x] `docs/LAUNCH_CHECKLIST.md`, the step-by-step version of section 3 below.
- [ ] Run unit tests, e2e and the Cloudflare preview once more on the final tree.

## 3. Before launch

- [ ] **Neeram's own WhatsApp number** in `src/data/content.ts` → `site.orders` (currently Skaylon's, +91 80759 15386).
- [ ] **Google Sheet setup**, following `docs/ORDER_SHEET_SETUP.md`, then add the three `GOOGLE_*` secrets on the Worker.
- [ ] **Turnstile widget:** create it in the Cloudflare dashboard. The site key goes in `NEXT_PUBLIC_TURNSTILE_SITE_KEY` at build time; the secret goes in `TURNSTILE_SECRET_KEY` as a Worker secret.
- [ ] **WAF rate-limit rule** on `POST /api/*`, for example 10 requests per 10 s per IP, then block. It needs the custom domain on Cloudflare.
- [ ] **A real test order and newsletter sign-up** on the live site. Check the rows appear in the sheet, then delete them.
- [ ] **Legal pages:** draft Privacy Policy and Terms are built, with a cookie notice, a checkout agreement line and product information. Still needs a lawyer's review and the client's details (section 3 of `docs/LAUNCH_CHECKLIST.md`).
- [ ] **If analytics or ads are ever added,** they must only run after "Accept all" (`src/components/CookieNotice.tsx` saves the choice), Manage needs a real switch for them, and the Privacy Policy must change. Today Accept and Reject behave the same, because there is nothing optional.
- [ ] **`SITE_LIVE=1`:** set it as a build variable at launch, or the site stays out of search (`docs/LAUNCH_CHECKLIST.md`).
- [ ] **Workers plan:** the built Worker is about 1.2 MB gzipped. Check the Free plan's size and CPU-time limits; Workers Paid ($5 a month) may be needed.
- [ ] **Cloudflare account access:** keep it tight, since Workers Logs can contain customer details.
- [ ] **Mobile performance: improved, target not met.** Lighthouse mobile, local production build, median of 3 (2 Nov 2026), target score 90+, LCP under 2.5 s, TBT under 200 ms:
  - home: 55 to 69, LCP 9.2 s to 4.7 s, TBT 558 to 516 ms;
  - coconut oil: 58 to 71, LCP 9.2 s to 4.4 s, TBT 803 to 464 ms;
  - checkout with a cart: 69 to 89, LCP 5.3 s to 0.8 s, TBT 515 to 431 ms;
  - CLS is under 0.1 on all three.

  What's left is mainly React and Next itself (about 220 KB of scripts and one long hydration task). Measure the live site on a real phone and with PageSpeed Insights before doing more; local simulation on this PC is noisy. If it's still short, the next step is fewer client components on the first screen.
- [ ] **Nice to have:** a hero photo at least 1800 px wide. The current one is 720 × 680, so it looks soft on large screens.
