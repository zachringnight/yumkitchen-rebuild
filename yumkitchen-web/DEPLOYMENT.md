# YumKitchen Deployment Runbook

## Environment

- `RESEND_API_KEY`: required for live form email delivery.
- `RESEND_FROM`: optional sender, defaults to `yum! website <onboarding@resend.dev>`.
- `YUM_FORMS_TO`: optional recipient, defaults to `info@yumkitchen.com`.
- `NEXT_PUBLIC_GTM_ID`: set to `GTM-P9584HPC` for production analytics. Leave unset for local Lighthouse runs.
- `NEXT_PUBLIC_YUMKITCHEN_URL`: optional canonical Yum URL, defaults to `https://yumkitchen.com`.
- `NEXT_PUBLIC_PATTICAKE_URL`: optional canonical Patticake URL, defaults to `https://patticake.com`.
- `NEXT_PUBLIC_SITE_URL`: optional metadata fallback for preview environments. Canonical page URLs and sitemap entries use `NEXT_PUBLIC_YUMKITCHEN_URL` and `NEXT_PUBLIC_PATTICAKE_URL` directly.
- `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`: optional direct checkout URL for Patticake national delivery. When unset, the page routes the primary CTA to the on-page national-delivery order-details form.

## Analytics Events

Confirm these in GTM Preview and GA4 DebugView before launch:

- `click_order_online`
- `click_call_location`
- `submit_contact_form`
- `submit_catering_form`
- `submit_wedding_cake_form`
- `submit_careers_form`
- `click_gift_card_buy`
- `click_gift_card_balance`
- `click_patticake_national_delivery_order`

Do not add legacy Universal Analytics `UA-83446946-1`.

## Preflight

1. Run `npm install --no-audit --no-fund`.
2. Run `bash ../verify.sh` from `yumkitchen-web/` parent directory.
3. Confirm `/og/default.jpg`, `/og/home.jpg`, `/og/menu.jpg`, `/og/catering.jpg`, and `/favicon.png` return 200.
4. Confirm all four Toast order URLs open from the location picker.
5. Submit one test form per form type in a configured environment and confirm the email arrives at `YUM_FORMS_TO`.
6. Confirm `/thank-you` has `noindex,nofollow` and is not listed in `/sitemap.xml`.
7. Confirm `/patticake-national-delivery` redirects permanently to `/patticake`.

## Vercel

1. Set project root to `yumkitchen-web`.
2. Set framework preset to Next.js.
3. Add environment variables above.
4. Deploy a preview URL first.
5. Run Lighthouse and axe against the preview URL before assigning the production domain.

## Patticake Domain

If `patticake.com` is served by the same Vercel project:

1. Add `patticake.com` and `www.patticake.com` as project domains.
2. Confirm `https://patticake.com/` renders the Patticake page and product-specific header.
3. Confirm `https://patticake.com/`, `https://patticake.com/patticake`, and `https://patticake.com/order-a-cake` are canonical for the Patticake pages.
4. Set `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` when a real national delivery checkout URL exists.
5. If the checkout URL is unset, confirm the primary Patticake CTA routes to the order-details form on the page.

## Cutover

Full redirect/SEO-equity audit: see `redirects.md`. All known old URLs are covered by `trailingSlash: false` plus the explicit 301s in `next.config.js`.

0. Pre-cutover: lower the current host DNS TTL to 300s at least 24h ahead so a rollback propagates fast.
1. Confirm DNS TTL and current host rollback path. Rollback = repoint `yumkitchen.com` A/CNAME records back to the current WordPress host. Keep the WordPress site running and untouched until 7 days of clean GSC coverage, so rollback is always one DNS change.
2. Point `yumkitchen.com` and `www.yumkitchen.com` to Vercel.
3. Submit `https://yumkitchen.com/sitemap.xml` in Google Search Console. Request indexing on the 4 location pages.
4. Check these URLs after cutover:
   - `/`
   - `/menu`
   - `/catering`
   - `/order-a-cake`
   - `/about`
   - `/contact`
   - `/location/st-louis-park`
   - `/location/shady-oak`
   - `/location/saint-paul`
   - `/location/woodbury`
   - `/patticake`
5. Monitor Core Web Vitals, form submissions, order clicks, call clicks, Patticake order clicks, and Search Console coverage for the first week.
