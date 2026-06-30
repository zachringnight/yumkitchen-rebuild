# Packet 09 - Cutover runbook + 301 map + GSC

Wave: 3
Depends on: 07, 08

## Objective
Make launch a checklist, not a research project. Finalize the cutover runbook so the only remaining step is Zach's go on DNS.

## Files
- `yumkitchen-web/DEPLOYMENT.md` (extend the Cutover section)
- New: `yumkitchen-web/redirects.md` (301 map)

## Consumes
- `04_data/page-sitemap.xml` (Yoast URLs, source of truth for SEO equity). `lib/locations.ts` for slugs.

## Produces
- A complete 301 map, GSC submission steps, first-week monitoring checklist, rollback path.

## Steps
1. Diff old Yoast sitemap URLs against the new `app/sitemap.ts` output. Slugs were preserved, so most map 1:1. List any URL that changed and its 301 target. If none changed, state that explicitly so launch does not stall looking for redirects that do not exist.
2. Write the 301 map as `source -> target` rows (include `/patticake-national-delivery -> /patticake`).
3. Extend DEPLOYMENT.md Cutover section: DNS TTL note, rollback to current host, the order of operations (deploy prod, verify, then flip DNS).
4. Add GSC steps: submit new sitemap, request indexing on the 4 location pages.
5. Add first-week monitoring checklist: Core Web Vitals, GA4 `click_order_online` conversions, 404 watch, Resend delivery rate.

## Verification
```
test -f yumkitchen-web/redirects.md && grep -q "patticake-national-delivery" yumkitchen-web/redirects.md && grep -q "Rollback" yumkitchen-web/DEPLOYMENT.md
```
Expected: exit 0.

## Done-signal
`DONE` with the count of changed URLs (likely 0 beyond the patticake redirect) and the rollback path in one line.
