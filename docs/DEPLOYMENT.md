# YumKitchen Deployment Runbook

## Environment

- `RESEND_API_KEY`: required for live form email delivery.
- `RESEND_FROM`: optional sender, defaults to `yum! website <onboarding@resend.dev>`.
- `YUM_FORMS_TO`: optional recipient, defaults to `info@yumkitchen.com`.
- `YUM_FORMS_TO_ST_LOUIS_PARK`, `YUM_FORMS_TO_SHADY_OAK`, `YUM_FORMS_TO_SAINT_PAUL`, `YUM_FORMS_TO_WOODBURY`: optional per-location recipients for cake and catering inquiries. When the form's pickup location matches and the variable is set, the note routes to that address instead of `YUM_FORMS_TO`. Unset variables fall back to `YUM_FORMS_TO`, so behavior is unchanged until they exist.
- `NEXT_PUBLIC_GTM_ID`: set to `GTM-P9584HPC` for production analytics. Leave unset for local Lighthouse runs.
- `NEXT_PUBLIC_YUMKITCHEN_URL`: optional canonical Yum URL, defaults to `https://yumkitchen.com`.
- `NEXT_PUBLIC_PATTICAKE_URL`: optional canonical Patticake URL, defaults to `https://patticake.com`.
- `NEXT_PUBLIC_SITE_URL`: optional metadata fallback for preview environments. Canonical page URLs and sitemap entries use `NEXT_PUBLIC_YUMKITCHEN_URL` and `NEXT_PUBLIC_PATTICAKE_URL` directly.
- `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`: optional direct checkout URL for Patticake national delivery. When unset, the page routes the primary CTA to the on-page national-delivery order-details form.
- `NEXT_PUBLIC_NEWSLETTER_SIGNUP_ENABLED`: set to `true` only after a real signup backend is ready. The footer module is hidden when unset.
- `NEWSLETTER_SIGNUP_WEBHOOK_URL`: approved CRM, ESP, or storage webhook that accepts the signup payload.
- `NEWSLETTER_SIGNUP_AUTH_TOKEN`: optional bearer token for the signup webhook.
- `PREVIEW_PASSWORD`: password for the private launch splash. Set to `Patticake4000` for the current handoff. Change this value when the preview audience changes.
- `PREVIEW_PROTECTION_ENABLED`: leave unset or set to `true` for shared previews. Set to `false` only for local automated QA that must inspect every route without a preview cookie.

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

Every tracked click also includes:

- `canonical_event`: normalized acquisition name such as `order_click`, `phone_click`, `location_directions_click`, or `gift_card_click`
- `page_path`
- `cta_label`
- `destination_url`
- `location` and `phone_number` when relevant
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`
- `landing_page` and `referrer`

The legacy event names remain the GTM `event` value so existing production triggers do not break. `canonical_event` provides the acquisition taxonomy from the v1.2 handoff.

Inquiry forms persist attribution in session storage, populate hidden fields, include it in the Resend note, and attach the same context to form-success events. Confirm attribution by entering through a URL with UTMs, navigating internally, and submitting a non-production test form after `RESEND_API_KEY` is configured.

Do not add legacy Universal Analytics `UA-83446946-1`.

## Newsletter Signup

The footer signup is hidden by default so the site never presents a false success state. When enabled, the server posts the normalized email, source path, session attribution, submission timestamp, and site source to the configured webhook. The browser shows success only after the webhook returns a successful HTTP response.

## Private Preview

All site routes redirect to `/preview` until the visitor enters the preview password. Successful access sets a secure, HTTP-only, same-site cookie for seven days and returns the visitor to the originally requested route. The splash itself, its Patticake motion assets, and the access endpoint remain public so the gate can load. Keep `PREVIEW_PROTECTION_ENABLED` unset or `true` on every shared deployment.

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

**Known gotcha:** `vercel deploy` from a sandboxed agent session can fail on the large-file upload for this project. Workaround: run the deploy with `vercel deploy --archive=tgz`, which bundles the project into a single archive before upload instead of uploading files individually.

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
2. Set `NEXT_PUBLIC_YUM_HOST_ROUTING=1` in the Vercel production env and redeploy. From that deploy on, yumkitchen.com serves the restaurant home at `/` (middleware rewrite; `/yum-kitchen` 308s to `/` on that host, and the restaurant-home canonical + sitemap entry become `https://yumkitchen.com/`). patticake.com is unaffected. Without DNS pointed yet this is inert for real traffic.
3. Point `yumkitchen.com` and `www.yumkitchen.com` to Vercel.
4. Submit `https://yumkitchen.com/sitemap.xml` in Google Search Console. Request indexing on the 4 location pages.
5. Check these URLs after cutover:
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
6. Monitor Core Web Vitals, form submissions, order clicks, call clicks, Patticake order clicks, and Search Console coverage for the first week.

## Build skipping (Ignored Build Step)

Do not set an Ignored Build Step that shells out to `git`. It cannot work in this project: `.vercelignore` lists `.git/`, so Vercel deletes the git metadata before the ignore command runs, and `git diff` exits with "Not a git repository" plus a usage dump. Vercel treats that as a failed deployment, and it fails fast (12 to 14 seconds) before the build starts, which reads like a build break but is not one.

This happened on 2026-07-26. The project setting was `if [ -d yumkitchen-web ]; then git diff HEAD^ HEAD --quiet -- yumkitchen-web; else git diff HEAD^ HEAD --quiet -- .; fi`, and every deployment errored while `verify` in CI stayed green. Two fixes were applied together:

1. `yumkitchen-web/vercel.json` sets `"ignoreCommand": "exit 1"`, which means always build. It lives in the app directory because the project's Root Directory is `yumkitchen-web`, and it is in version control so it is reviewable and cannot drift silently.
2. The dashboard setting was cleared to `null` so it cannot conflict with the file.

If build skipping is ever worth re-adding, do not reach for `git`. Either drop `.git/` from `.vercelignore` first (which uploads the full history, so weigh the size), or use a check that does not need repository metadata. Note `.vercelignore` already excludes `docs/` and `social/` from the upload, so documentation-only commits produce nearly identical deployments anyway, which is most of what the skip was buying.
