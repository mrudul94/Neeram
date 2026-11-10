# Security notes

Read this before changing checkout, headers or dependencies. Last reviewed 10 November 2026.

## What there is to protect

There are no accounts, logins or online payments. The only untrusted input that reaches the server is
`POST /api/checkout`: a cart and the customer's name, phone, address and optional email. The assets are that
personal data (in the Google Sheet, if one is set up) and the sheet's service-account key and the Turnstile
secret (Worker secrets, never in the repository; `.dev.vars` is ignored by git).

## Controls in place

| Threat | Control | Where |
|---|---|---|
| Tampered prices or products | The server re-prices every line from the catalogue; qty 1–20; unknown packs dropped | `priceLines` in `src/lib/checkout.ts` |
| Bad or oversized fields | Text only, allowlisted field names, length limits, phone/PIN/state formats | `pickDetails`, `validateDetails` |
| Oversized or malformed bodies | Over 20,000 characters → 413; anything that isn't a JSON object → 400 | `src/app/api/checkout/route.ts` |
| Formula injection in the sheet | Rows written with `valueInputOption=RAW` | `src/lib/sheet.ts` |
| Bots | Honeypot field; Cloudflare Turnstile when its keys are set (optional, see `LAUNCH_CHECKLIST.md`) | `src/lib/bot-check.ts`, `src/lib/turnstile.ts` |
| Script injection | React escaping; the one raw-HTML use (JSON-LD) escapes `<` | `src/components/JsonLd.tsx` |
| Clickjacking, third-party scripts, MIME sniffing | Security headers on every response (below) | `next.config.ts` |

## Security headers

`next.config.ts` sends a Content-Security-Policy, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy`, `Permissions-Policy` and `Strict-Transport-Security` on every route.

- The policy allows the site's own files and Cloudflare Turnstile only. **Adding any third-party script or
  iframe (Meta Pixel, Google Analytics, a chat widget) means adding its origins to the policy**, and updating
  the Privacy Policy and cookie notice, which say there are no trackers.
- `script-src` allows inline scripts because Next.js streams page data in inline `<script>` tags. Removing
  that needs a per-request nonce, which turns off static rendering. Not worth it on a site with no logins.
- `e2e/legal.spec.ts` checks the headers, and visits every page type (and the Turnstile widget) failing on
  any blocked resource.

## Dependency audit

`npm audit --omit=dev`: 4 high and 1 moderate, all through `@opennextjs/cloudflare` →
`@opennextjs/aws` → `@node-minify/core` → `glob@10` / `minimatch` (glob CLI command injection, minimatch
ReDoS). **Deferred**: these run only at build time on the developer's machine, with no visitor input, and
the glob CLI is never called. The fix npm offers is a downgrade to `@opennextjs/cloudflare@0.3.0`, which
breaks deploys; never run `npm audit fix --force`. The latest `@opennextjs/aws` (4.1.15) still has them.
Review again on 10 February 2027 or at the next OpenNext upgrade.

## Personal data

- Orders are kept in the sheet for the retention period in `site.dataRetention` (Privacy Policy).
- If a sheet write fails, the whole order (with name, phone and address) goes to Workers Logs so it can
  be added by hand. Workers Logs keep it for their own retention period; don't forward those logs anywhere.
