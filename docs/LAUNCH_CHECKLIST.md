# Launch checklist

Work through this before the site goes live on Cloudflare. Items marked **(developer)** need someone comfortable with the code or the command line; the rest can be done in a browser.

## 1. Orders reach Neeram

- [ ] **Switch the WhatsApp number to Neeram's own.** It's currently Skaylon's (+91 80759 15386). **(developer)** Change `whatsapp` in `src/data/content.ts` → `site.orders`, in international form without `+` or spaces (for example `919876543210`). Add `phone` and `email` there too if customers without WhatsApp should be able to send orders by SMS or email.
- [ ] **Set up the order sheet and add the Google values in Cloudflare.** Follow [ORDER_SHEET_SETUP.md](ORDER_SHEET_SETUP.md): it ends with adding `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` and `GOOGLE_SHEET_ID` as **secrets** on the `neeram` Worker.

## 2. Bot protection

- [ ] **Create the Turnstile widget.** In the Cloudflare dashboard: **Turnstile** → **Add widget**. Name it `Neeram`, add the site's domain (for example `neeram.in`), and choose **Managed** mode. You get two keys:
  - **Site key** (public): set it as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` wherever the site is built. **(developer)** It's built into the pages, so a change needs a new build and deploy.
  - **Secret key**: add it to the `neeram` Worker as a **secret** named `TURNSTILE_SECRET_KEY` (Workers & Pages → neeram → Settings → Variables and Secrets).
  - Never use Cloudflare's test keys (`1x000…`) on the live site: the test secret accepts everything.
- [ ] **Add a rate-limiting rule.** This needs the site's own domain on Cloudflare; it doesn't apply to the `workers.dev` address. In the dashboard, open the domain → **Security** → **WAF** → **Rate limiting rules** → **Create rule**:
  - **Rule name:** `Limit order and sign-up posts`
  - **If incoming requests match:** *URI Path* **starts with** `/api/` **and** *Request Method* **equals** `POST`
  - **With the same characteristics:** IP (the default)
  - **When rate exceeds:** `10` requests per `10 seconds` (the Free plan offers one rule, with a 10-second period)
  - **Then take action:** **Block** for `10 seconds`
  - Click **Deploy**. A real customer sends one or two requests per order, so this only stops floods.

## 3. Hosting

- [ ] **Choose the Workers plan. (developer)** The built Worker is about **1.2 MB compressed** (measured with `npx wrangler deploy --dry-run`). Check the current Free-plan limits on worker size and CPU time per request at [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/). If either is too tight, use **Workers Paid** (from $5 a month), which is what OpenNext sites are usually run on.
- [ ] **Deploy and attach the domain. (developer)** `npx wrangler login`, then `npm run deploy`. In Workers & Pages → neeram → **Settings** → **Domains & Routes**, add the custom domain.
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** to the real address (for example `https://neeram.in`) wherever the site is built, so links shared on WhatsApp and search results point to the right place. **(developer)** Read at build time.
- [ ] **`SITE_LIVE`: decide what it should switch.** ⚠ Nothing in the code reads a `SITE_LIVE` variable yet, so setting it currently does nothing. If it's meant to, say, allow search engines to index the site or hide a "coming soon" notice, that needs building first. **(developer)**
- [ ] **Workers Logs are on** (`observability` in `wrangler.jsonc`). Check you can open Workers & Pages → neeram → **Observability** and see requests after deploying.

## 4. Check it end to end

- [ ] **Place a real test order** on the live site, with `TEST` in the note. Check that the WhatsApp message is right, that a row appears in the order sheet within about 10 seconds, and then delete that row.
- [ ] **Sign up for the newsletter** in the footer with your own email. Check that a row appears on the sheet's **Newsletter** tab, then delete it.
- [ ] **Search Workers Logs** for `NOT SAVED TO SHEET` and `TURNSTILE`. After the two tests above there should be no matches. If there are, [ORDER_SHEET_SETUP.md](ORDER_SHEET_SETUP.md) explains each message.

## 5. Access

- [ ] **Keep Cloudflare account access tight.** Workers Logs can contain customers' names, phone numbers and addresses (any order that couldn't be saved to the sheet is logged in full). Under **Manage Account** → **Members**, keep only the people who need it, and remove anyone who leaves.
- [ ] **Keep the order sheet's sharing tight** for the same reason: only the robot account and the people who handle orders.

## 6. Nice to have before launch

- [ ] **A sharper hero photo.** The hero (`public/images/photos/tempering-pan.webp`) is only 720 × 680, so it's stretched on large screens. A photo at least 1800 px wide, exported as WebP (quality about 80), would make it sharp. Images are served as-is, so the file's own size is what visitors get.
