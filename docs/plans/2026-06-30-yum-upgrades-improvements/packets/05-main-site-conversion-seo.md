# Task 05: Main-Site Conversion, SEO, And Metadata

**Wave:** 3
**Depends on:** 02, 03

## Files
- Modify: `yumkitchen-web/lib/site.ts`
- Modify: `yumkitchen-web/app/sitemap.ts`
- Modify page metadata files under `yumkitchen-web/app/**/page.tsx`
- Modify: `yumkitchen-web/components/SiteFooter.tsx`
- Modify: `yumkitchen-web/components/CakeStudioBand.tsx`

## Interfaces
- Consumes: canonical route decisions from task 03.
- Produces: launch-safe metadata, sitemap, and conversion routes for the Yum main site.

## Steps
- [ ] Check sitemap against original SEO requirements.
  Include all canonical Yum pages and location slugs. Include `/patticake` only if this deploy is also serving Patticake.
- [ ] Confirm homepage metadata mentions Woodbury.
- [ ] Confirm location pages include `Restaurant` JSON-LD via `entityJsonLd()`.
- [ ] Confirm `/in-the-news` uses one H1 and press titles as H2 or H3.
- [ ] Confirm external links use `target="_blank"` and `rel="noopener noreferrer"` where appropriate.
- [ ] Confirm footer social links have accessible names.
- [ ] Confirm Gift Card buy and balance links use exact Toast URLs from `lib/site.ts`.
- [ ] Keep route labels and headers brand-correct. Do not create marketing hero pages that obscure the food, locations, order path, or cake action.
- [ ] Run route checks.
  Run from `yumkitchen-web`: `npm run validate:content && npm run typecheck && npm run lint`
  Expected: all pass.

## Done-check
Run from `07_codex`: `bash verify.sh`
Expected: all checks pass after task 02, or only the known performance failure remains if task 02 is not complete.

## Report
DONE unless any SEO requirement conflicts with current Patticake host strategy. Use DONE_WITH_CONCERNS if `/patticake` sitemap inclusion depends on DNS or domain launch timing.
