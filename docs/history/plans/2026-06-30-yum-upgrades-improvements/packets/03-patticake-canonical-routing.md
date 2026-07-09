# Task 03: Patticake Canonical Routing

**Wave:** 2
**Depends on:** 01

## Files
- Modify: `yumkitchen-web/app/patticake/page.tsx`
- Modify: `yumkitchen-web/app/patticake-national-delivery/page.tsx`
- Modify: `yumkitchen-web/next.config.js`
- Modify: `yumkitchen-web/app/sitemap.ts`
- Modify: `yumkitchen-web/lib/site.ts`
- Modify: `yumkitchen-web/package.json`

## Interfaces
- Consumes: `/patticake` currently re-exports `/patticake-national-delivery`; `next.config.js` redirects `/patticake-national-delivery` to `/patticake`.
- Produces: `/patticake` as the real implementation route and `/patticake-national-delivery` as redirect-only legacy behavior.

## Steps
- [ ] Move the implementation into `app/patticake/page.tsx`.
  Copy the real page implementation from `app/patticake-national-delivery/page.tsx` into `app/patticake/page.tsx`.
- [ ] Replace `app/patticake-national-delivery/page.tsx` with the smallest safe legacy page or remove the route if the `next.config.js` permanent redirect handles it fully.
  If keeping a file, it must not create duplicate canonical content.
- [ ] Keep metadata canonical as `${patticakeSiteUrl}/patticake`.
- [ ] Keep sitemap on `/patticake`, not `/patticake-national-delivery`.
- [ ] Keep the a11y audit route list on `/patticake`.
- [ ] Verify the permanent redirect.
  With the production server running, run: `curl -I http://localhost:3000/patticake-national-delivery`
  Expected: `308` or `301` with `Location: /patticake`.
- [ ] Verify rendered route.
  Run: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass.

## Done-check
Run from `07_codex`: `bash verify.sh`
Expected: all checks pass or only the known homepage Lighthouse performance failure remains if task 02 has not landed yet.

## Report
DONE unless duplicate Patticake content remains indexed or the legacy redirect does not work.
