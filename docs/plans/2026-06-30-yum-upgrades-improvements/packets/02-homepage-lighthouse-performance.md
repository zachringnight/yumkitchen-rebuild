# Task 02: Homepage Lighthouse Performance

**Wave:** 2
**Depends on:** 01

## Files
- Modify: `yumkitchen-web/app/page.tsx`
- Modify: `yumkitchen-web/components/HomeDesign.tsx`
- Modify: `yumkitchen-web/components/Hero.tsx`
- Modify: `yumkitchen-web/app/globals.css`
- Modify assets or image props only as needed for the homepage Lighthouse score.

## Interfaces
- Consumes: `bash verify.sh` currently fails only on homepage Lighthouse performance with `Perf=85`.
- Produces: homepage performance improvements that keep the design direction and restore full `bash verify.sh` eligibility.

## Steps
- [ ] Capture the specific Lighthouse bottlenecks.
  Run from `yumkitchen-web`: `BASE_URL=http://localhost:3000 npm run lh`
  Expected: `/tmp/yum-lh.json` exists. Inspect LCP, image sizing, unused JS, render-blocking work, and total blocking time.
- [ ] Fix only the measured bottlenecks.
  Preferred fixes: tune priority images, remove eager loading below the fold, reduce first-viewport animation work, improve `sizes`, defer noncritical motion, and avoid loading extra large images in the first viewport.
- [ ] Preserve the visual intent.
  Do not remove the Yum hero, Patticake links, location cards, or motion system wholesale. Respect `prefers-reduced-motion`.
- [ ] Run targeted checks.
  Run from `yumkitchen-web`: `npm run typecheck && npm run lint && npm run build`
  Expected: all pass.
- [ ] Run Lighthouse.
  Run from `07_codex`: `PORT=3000 bash verify.sh`
  Expected: homepage Lighthouse performance is at least 90, A11y at least 95, Best Practices at least 95, SEO 100.

## Done-check
Run: `bash verify.sh`
Expected: `VERIFY PASSED`

## Report
DONE if full verify passes. DONE_WITH_CONCERNS if full verify passes but visual weight was materially reduced. BLOCKED if performance remains below 90 after measured image and first-viewport fixes.
