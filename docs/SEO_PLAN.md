# Neeram SEO plan

**The goal:** come up when people in and around Kasaragod search for coconut oil, and for "Neeram". No one can guarantee the top spot on every search. Google decides that, and large brands such as KERA already rank for the broad terms. What we control is being accurate, useful, fast and well known locally.

Google says local results depend on three things: **relevance** (does it match the search), **distance** (how near the searcher) and **prominence** (how well known the business is). The website helps most with the first. The other two come mainly from a Business Profile, reviews and real mentions elsewhere.

## Already built

- **On-page:** page titles and descriptions say what and where. The home page's H1 says "Coconut oil · Kasaragod, Kerala".
- **Technical:** canonical links, `robots.txt`, `sitemap.xml`, and a noindex tag on the test site until `SITE_LIVE=1`. Images have descriptive names and are served as WebP.
- **Product:** Product markup with every size and price, and breadcrumbs.
- **Answers:** an FAQ on the coconut oil page, with FAQPage markup for confirmed answers only.
- **Business:** Organization markup, using only filled-in details from `src/data/content.ts`.

## To do at launch

1. Give the client's details to the developer (`TODO_CONTENT.md`).
2. Set `NEXT_PUBLIC_SITE_URL` to the real domain in `.env.production` and `SITE_LIVE=1`, then rebuild.
3. Add the site to [Google Search Console](https://search.google.com/search-console) and submit `/sitemap.xml`. Do the same in Bing Webmaster Tools.
4. Test the home and product pages with Google's [Rich Results Test](https://search.google.com/test/rich-results).
5. Check [PageSpeed Insights](https://pagespeed.web.dev/). **This is the biggest open technical item:** the last mobile tests showed the main content loading in 5–6 seconds (`docs/LATER.md`).

## Off-page: done outside the website, by the business

**Priority order:**

1. **Google Business Profile.** This is what appears on Google Maps, and is the most important step for local searches. Google allows it only if the business has a physical location customers can visit, or travels to customers. A rented mailing address doesn't qualify. Confirm which applies before applying; if customers can't visit the mill, ask whether the delivery model qualifies as a service area.
2. **Real reviews.** Ask real customers to review the profile, for example with a link in the WhatsApp message after delivery. Never buy reviews or offer rewards for them.
3. **Consistent details.** The same name, address and phone everywhere: website, Google, Facebook, Instagram, the pack.
4. **Listings and mentions.** IndiaMART and similar directories if selling wholesale; local news about the mill; the local farmer, startup or trade bodies Neeram really belongs to; shops that stock Neeram linking to the site.
5. **Useful content over time.** Real recipes and how-tos, such as tempering with coconut oil. Only add them when there's something genuinely useful to say.

## AI search (GEO / AEO)

Google says no special files or markup are needed for AI Overviews or AI Mode, and that `llms.txt` has no effect on its rankings. The page only has to be indexed and eligible for a snippet. So the work is the same: plain statements of fact (what, where, sizes, prices), and being mentioned by other sites. AI crawlers are not blocked.

## Advice we're not following, and why

| Advice | Why not |
|---|---|
| FAQ rich results in Google | Google stopped showing them on 7 May 2026. The FAQ is still useful for readers and other tools, so it stays. |
| Geotagging photos in their EXIF data | Google has said it does not use EXIF data for ranking. Google's Martin Splitt said so in 2024, as reported by SEO press. |
| A page for each town (Kanhangad, Nileshwar, Uppala…) | Near-identical pages made to rank are "doorway abuse" under Google's spam policies. Add a "where to buy" page only once real stockists are confirmed. |
| "Organic", "factory outlets", "farmer-producer societies", "best brand" | Not confirmed. False claims can also be a legal problem. |
| LocalBusiness markup and a Maps button now | Not until there's a place customers can visit and a confirmed address. |
| A sticky "Call now" button | No confirmed phone number yet. Worth adding once there is one. |

## Commands

The `claude-seo` plugin can audit the site once it's live, for example `/seo audit <url>`, `/seo local <url>` and `/seo schema <url>`. Its findings are suggestions: check them against Google's own documentation.
