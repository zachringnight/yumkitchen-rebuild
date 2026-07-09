# Packet 07 - a11y + Lighthouse sweep (all pages)

Wave: 2
Depends on: 03, 04, 05, 06 (integrated at the Wave 1 boundary)

## Objective
Prove the elevated build did not regress accessibility or performance, and clear any regression it did introduce. The elevation touched the heaviest pages, so this is the one packet that earns an adversarial cross-check.

## Files
- May edit only the owned files of P03/P04/P05/P06 to fix regressions. No new feature work.
- Writes `docs/plans/2026-06-30-yum-ship-and-elevate/verify/a11y-sweep.json` and `lh-summary.md`.

## Consumes
- Integrated Wave 1 branch. `npm run a11y`, `npm run lh` scripts.

## Produces
- axe + Lighthouse results across every route. Regressions fixed.

## Targets
- axe: 0 serious, 0 critical on every configured route.
- Lighthouse mobile per page: Perf >= 90, A11y >= 95, BP >= 95, SEO = 100. Homepage baseline was Perf 92-93 / A11y 100; do not drop below.

## Steps
1. Build and start prod server.
2. Run `npm run a11y` over the full route list (home, order, menu, catering, order-a-cake, patticake, about, careers, in-the-news, contact, accessibility, all 4 locations). Save JSON.
3. Run `npm run lh` against the key pages (home, menu, patticake, a location, order). Save the summary.
4. For each serious axe node or sub-target Lighthouse score, fix in the responsible owned file. Re-run until green.
5. Cross-check: spot-verify keyboard tab order and visible focus on home, menu, and patticake (screenshot evidence the prior audit said it could not prove).

## Verification
```
cd yumkitchen-web && npm run a11y && npm run lh
```
Expected: a11y reports 0 serious/critical; LH home Perf >= 90, A11y >= 95, BP >= 95, SEO 100.

## Done-signal
`DONE` with the per-page score table. `DONE_WITH_CONCERNS` if a third-party (Toast embed) is the only remaining flag and cannot be fixed in-repo.
