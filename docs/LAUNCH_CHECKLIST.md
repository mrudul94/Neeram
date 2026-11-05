# Launch checklist

Work through this before the site goes live on Cloudflare. Items marked **(developer)** need someone comfortable with the code or the command line; the rest can be done in a browser.

## 1. Orders reach Neeram

- [x] **Switch the WhatsApp number to Neeram's own.** It's +91 97478 44455, in `src/data/content.ts` → `site.orders`.
- [ ] **Offer SMS or email orders (optional). (developer)** Add `phone` and `email` to `site.orders` if customers without WhatsApp should be able to send orders that way.
- [x] **Agree who copies orders into the records.** The accountant. There is no order sheet: orders arrive on WhatsApp and the site keeps no copy, so each one is recorded by hand. Keep them for 10 years, as the Privacy Policy says.

## 2. Bot protection

Left out on purpose: orders only reach Neeram when a customer sends the WhatsApp message, and the site saves nothing, so bots can't fill anything up. The hidden honeypot field stays. Without a key, Workers Logs show `[TURNSTILE NOT SET UP]` for each order; that's expected. If spam ever becomes a problem, do the steps below and put the security check back in the Privacy Policy and cookie notice.

- [ ] (Optional) **Create the Turnstile widget.** In the Cloudflare dashboard: **Turnstile** → **Add widget**. Name it `Neeram`, add the site's domain (for example `neeram.in`), and choose **Managed** mode. You get two keys:
  - **Site key** (public): set it as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` wherever the site is built. **(developer)** It's built into the pages, so a change needs a new build and deploy.
  - **Secret key**: add it to the `neeram` Worker as a **secret** named `TURNSTILE_SECRET_KEY` (Workers & Pages → neeram → Settings → Variables and Secrets).
  - Never use Cloudflare's test keys (`1x000…`) on the live site: the test secret accepts everything.
- [ ] (Optional) **Add a rate-limiting rule.** This needs the site's own domain on Cloudflare; it doesn't apply to the `workers.dev` address. In the dashboard, open the domain → **Security** → **WAF** → **Rate limiting rules** → **Create rule**:
  - **Rule name:** `Limit order posts`
  - **If incoming requests match:** *URI Path* **starts with** `/api/` **and** *Request Method* **equals** `POST`
  - **With the same characteristics:** IP (the default)
  - **When rate exceeds:** `10` requests per `10 seconds` (the Free plan offers one rule, with a 10-second period)
  - **Then take action:** **Block** for `10 seconds`
  - Click **Deploy**. A real customer sends one or two requests per order, so this only stops floods.

## 3. Legal

- [ ] **Lawyer review.** Have a lawyer review the Privacy Policy (`/privacy`) and Terms (`/terms`). Both are drafts written from how the site works, and are not legal advice. Ask them to confirm the FSSAI and packaged-goods details on product pages too, and whether checkout needs a tick-box.
- [ ] **Fill every gap.** No page should show `[to be confirmed]`. Most details go in `site` in `src/data/content.ts` **(developer)**; the delivery and returns wording is in `src/app/(site)/help/page.tsx`. `TODO_CONTENT.md` lists what's needed.
- [ ] **Name the Grievance Officer** on the site. They must acknowledge complaints within 48 hours and resolve them within one month.
- [ ] **Confirm the licence wording.** The FSSAI licence is in Govindan Oil Mill's name and lists it as "Repacker - General Manufacturing", 1 MT a day. The site and label say the oil is made at the mill, and the About page says 750 kg an hour.
- [ ] **Renew the FSSAI licence** before 21 May 2027. Renewal can be filed up to 180 days early.
- [ ] **Remove the "Draft, pending legal review" labels** after sign-off: delete `draft` in both legal pages and update their dates. **(developer)**

## 4. Hosting

- [ ] **Choose the Workers plan. (developer)** The built Worker is about **1.2 MB compressed** (measured with `npx wrangler deploy --dry-run`). Check the current Free-plan limits on worker size and CPU time per request at [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/). If either is too tight, use **Workers Paid** (from $5 a month), which is what OpenNext sites are usually run on.
- [ ] **Deploy and attach the domain. (developer)** `npx wrangler login`, then `npm run deploy`. In Workers & Pages → neeram → **Settings** → **Domains & Routes**, add the custom domain.
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** to the real address (for example `https://neeram.in`) in `.env.production`, and remove any variable of that name in Cloudflare's build settings, so links shared on WhatsApp and search results point to the right place. **(developer)** Read at build time.
- [ ] **Set `SITE_LIVE=1`** as a build variable and rebuild, only when the site is ready for the public. **(developer)** Until then every page is marked noindex and the sitemap is empty, so nothing can rank. Then submit `/sitemap.xml` in Google Search Console (`docs/SEO_PLAN.md`).
- [ ] **Workers Logs are on** (`observability` in `wrangler.jsonc`). Check you can open Workers & Pages → neeram → **Observability** and see requests after deploying.

## 5. Check it end to end

- [ ] **Place a real test order** on the live site, with `TEST` in the note. Check that the WhatsApp message is right and reaches Neeram's number.
- [ ] **Try "Message us on WhatsApp"** in the footer and "Notify me on WhatsApp" on a spice page. Check that each opens a chat with Neeram's number.

## 6. Access

- [ ] **Keep Cloudflare account access tight.** It controls the live site and its logs. Under **Manage Account** → **Members**, keep only the people who need it, and remove anyone who leaves.
- [ ] **Keep order records private.** Limit who can read the WhatsApp chats and any notebook or Excel file of orders, because they hold customers' names, numbers and addresses.

## 7. Nice to have before launch

- [ ] **A sharper hero photo.** The hero (`public/images/photos/mustard-seeds-curry-leaves-tempering-in-coconut-oil.webp`) is only 720 × 680, so it's stretched on large screens. A photo at least 1800 px wide, exported as WebP (quality about 80), would make it sharp. Images are served as-is, so the file's own size is what visitors get.
