# Redirect + SEO-equity map (reference, no cutover planned)

**No DNS cutover is planned or scheduled** (confirmed 2026-07-26). Nothing in this file is queued work. It stays because the redirects it documents are already implemented and guard against real 404s, and because the audit would be costly to redo if a cutover is ever chosen. Do not read it as a launch plan.


Generated 2026-06-30 for the ship-and-elevate launch. Confirms every old WordPress/Yoast URL resolves on the new site so search equity transfers. Source of truth for old URLs: `04_data/page-sitemap.xml`.

## Mechanism summary

- `trailingSlash: false` in `next.config.js` makes every old trailing-slash URL (`/about/`) 308-redirect to the slashless form (`/about`). 308 preserves SEO equity like a 301.
- Explicit permanent (301) redirects live in `next.config.js` `redirects()`.
- Location slugs are unchanged from WordPress, so those are identity (no redirect needed).

## Old Yoast page URLs -> new

| Old URL (WordPress) | New target | Mechanism |
|---------------------|-----------|-----------|
| `/` | `/` | identity |
| `/about/` | `/about` | trailingSlash 308 |
| `/careers/` | `/careers` | trailingSlash 308 |
| `/catering/` | `/catering` | trailingSlash 308 |
| `/contact/` | `/contact` | trailingSlash 308 |
| `/in-the-news/` | `/in-the-news` | trailingSlash 308 |
| `/menu/` | `/menu` | trailingSlash 308 |
| `/order-a-cake/` | `/order-a-cake` | trailingSlash 308 |
| `/featured-menu/` | `/menu` | explicit 301 (next.config) |

## Legacy / known inbound URLs -> new

| Old URL | New target | Mechanism |
|---------|-----------|-----------|
| `/order-now` | `/order` | explicit 301 |
| `/jobs/general-job-description` | `/careers` | explicit 301 |
| `/patticake-national-delivery` | `/patticake` | explicit 301 |

## Location pages (slugs preserved, identity)

- `/location/st-louis-park`
- `/location/shady-oak`
- `/location/saint-paul`
- `/location/woodbury`

## New URLs with no old equivalent (no redirect, just index)

- `/accessibility-statement`
- `/order`
- `/patticake`

## Pre-launch verification

Run against the production preview before DNS cutover:

```
for u in /about/ /menu/ /featured-menu/ /order-now /patticake-national-delivery; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' <PREVIEW_URL>$u)"
done
```

Expect 308/301 with the correct `redirect_url` for each. Identity URLs (`/menu`, `/about`) return 200.

## RESOLVED: in-the-news press posts now redirect (2026-06-30)

All 22 old WordPress press-archive posts (`https://yumkitchen.com/<slug>/`) now 308-redirect to `/in-the-news` via `pressArchiveRedirects` in `next.config.js`. This prevents the post-cutover 404s. Verified: each slug returns 308 to `/in-the-news`; real routes still 200; unknown routes still hit the branded 404. External outlet links (kstp, mspmag, startribune, eater, woodburymag) were always fine and open in a new tab with `rel="noopener noreferrer"`.

Background (the original three options; option 1 was chosen):

Affected slugs (all under `https://yumkitchen.com/`):
`top-bakeries-in-the-twin-cities`, `top-dessert-in-the-twin-cities`, `top-15-best-chocolate-chip-cookies-in-the-twin-cities`, `14-best-restaurants-in-minnetonka-mn`, `best-business-lunch-in-the-twin-cities`, `best-patios-in-the-twin-cities`, `5-best-things-the-startribune-food-critics-ate-this-week`, `critics-choice`, `derusha-eats-feature`, `yum-on-good-company`, `inside-yum`, `breakfast-with-megs-and-eggs`, `celebrate-rosh-hashanah-with-yum`, `passover-friendly-food`, `coming-to-woodbury`, `woodbury-magazine-feature`, `patti-on-motivation`, `pick-up-picnic-eats`, `pregame-mnufc-at-yum-st-paul`, `where-to-pick-up-local-soup`, `yum-at-taste-of-the-twin-cities`, `235-2`.

Three options, Zach's call (it is a content/SEO decision, not a mechanical one):
1. **Redirect all 22 to `/in-the-news`** (safe default, no 404s, one block in `next.config.js`). Loses the individual post content.
2. **Rebuild the SEO-valuable ones** as real pages (e.g. `top-bakeries-in-the-twin-cities` is a ranking asset) and redirect the rest.
3. **Relink each press card to the external outlet article** instead of the yum self-post, and drop the internal URLs.

Until decided, the new custom 404 page (`app/not-found.tsx`) at least gives these a branded landing with recovery links instead of a bare error after cutover.
