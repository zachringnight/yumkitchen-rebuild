# YumKitchen Deployment Runbook

## Environment

- `RESEND_API_KEY`: required for live form email delivery.
- `RESEND_FROM`: optional sender, defaults to `yum! website <onboarding@resend.dev>`.
- `YUM_FORMS_TO`: optional recipient, defaults to `info@yumkitchen.com`.
- `NEXT_PUBLIC_GTM_ID`: set to `GTM-P9584HPC` for production analytics. Leave unset for local Lighthouse runs.
- `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`: optional direct checkout URL for Patticake national delivery. When unset, the page routes the primary CTA to the on-page national-delivery order-details form.

## Preflight

1. Run `npm install --no-audit --no-fund`.
2. Run `bash ../verify.sh` from `yumkitchen-web/` parent directory.
3. Confirm `/og/default.jpg`, `/og/home.jpg`, `/og/menu.jpg`, `/og/catering.jpg`, and `/favicon.png` return 200.
4. Confirm all four Toast order URLs open from the location picker.
5. Submit one test form per form type in a configured environment.

## Vercel

1. Set project root to `yumkitchen-web`.
2. Set framework preset to Next.js.
3. Add environment variables above.
4. Deploy a preview URL first.
5. Run Lighthouse and axe against the preview URL before assigning the production domain.

## Cutover

1. Confirm DNS TTL and current host rollback path.
2. Point `yumkitchen.com` and `www.yumkitchen.com` to Vercel.
3. Submit `https://yumkitchen.com/sitemap.xml` in Google Search Console.
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
5. Monitor Core Web Vitals, form submissions, order clicks, call clicks, and Search Console coverage for the first week.
