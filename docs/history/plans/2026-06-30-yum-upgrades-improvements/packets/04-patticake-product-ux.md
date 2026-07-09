# Task 04: Patticake Product UX

**Wave:** 3
**Depends on:** 03

## Files
- Modify: `yumkitchen-web/components/SiteHeader.tsx`
- Modify: `yumkitchen-web/components/MobileOrderBar.tsx`
- Modify: `yumkitchen-web/lib/usePatticakeSurface.ts`
- Modify: `yumkitchen-web/app/patticake/page.tsx`
- Modify: `yumkitchen-web/app/thank-you/page.tsx`

## Interfaces
- Consumes: canonical route `/patticake` from task 03.
- Consumes: `patticakeNationalOrderUrl` from `yumkitchen-web/lib/site.ts`.
- Produces: product-specific Patticake shell behavior on `/patticake` and on host `patticake.com`.

## Steps
- [ ] Verify the current product shell behavior.
  Run the app locally and inspect `/patticake` desktop and mobile.
  Expected: product nav is shown, not the restaurant location ordering shell.
- [ ] Verify host-based shell behavior.
  Use a local host-mapped request for `patticake.com/`.
  Expected: the proxy rewrites root to `/patticake`, and the product header is visible after hydration.
- [ ] Make copy consistent with Zach's instruction that this is a demo for when national delivery is live.
  Use decisive live-order labels only where the configured `patticakeNationalOrderUrl` supports it. If the env var is unset and the fallback is the support form, the fallback must make clear it is an order-details flow without claiming payment checkout.
- [ ] Confirm the thank-you page supports both Yum inquiry and Patticake inquiry contexts without confusing local pickup with national delivery.
- [ ] Keep all labels lowercase where they behave like site navigation. Keep button text short.
- [ ] Run targeted checks.
  Run from `yumkitchen-web`: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass.

## Done-check
Run from `07_codex`: `BASE_URL=http://localhost:3000 npm run --prefix yumkitchen-web a11y` after starting the server, or run `bash verify.sh` after task 02.
Expected: `/patticake` has `0 serious, 0 critical`.

## Report
DONE unless the live-order demo needs a real national checkout URL before copy can be final. Use DONE_WITH_CONCERNS if the fallback order-details form remains the primary action.
