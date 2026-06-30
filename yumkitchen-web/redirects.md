# Redirect + SEO-equity map (cutover audit)

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

## Note

If the old WordPress post sitemap (news posts, `04_data/sitemap_index.xml`) contains individual indexed article URLs, confirm each resolves or 301s to `/in-the-news`. The press hits on the live site were external outbound links, so internal post URLs are not expected, but verify in Search Console coverage during week one.
