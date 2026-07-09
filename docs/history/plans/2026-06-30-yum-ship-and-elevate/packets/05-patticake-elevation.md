# Packet 05 - Patticake commerce elevation

Wave: 1
Depends on: 01
Owns (only these files): `app/patticake/page.tsx`, `components/CakeStudioBand.tsx`, `components/PatticakeOriginBand.tsx`

## Objective
Push the Patticake national-cake-delivery page toward best-in-class food e-commerce (Goldbelly product page, SusieCakes warmth). This is the commerce surface, so clarity of "what you get, how it ships, why trust it, order now" matters most. Reference `../competitor-goldbelly-home.png` and `../competitor-susiecakes-home.png`.

## The direction
1. **Product clarity above the fold.** What the cake is, price/serving context if available, and the single primary order action. Keep the sticky mobile order bar.
2. **Proof and trust.** Press/proof, reviews or quality cues, "made from scratch" provenance via PatticakeOriginBand. Trust sells shipped food.
3. **Shipping/pickup separation stays clear.** Local pickup vs national delivery are distinct paths (already built). Keep them visually separated and unambiguous.
4. **Gallery.** Strong cake photography in CakeStudioBand. Appetite first.
5. **CTA routing is sacred.** Primary CTA routes to the real checkout only when `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` is set, else to the on-page order-details form. Do not hardcode a checkout URL. This is on the eyeball list.

## Constraints
- Brand system locked. Patticake may feel distinct but stays inside Yum tokens. No em dashes. Lowercase headlines.
- Do not edit MediaProofBand (owned by P06). Use it as-is if imported.
- Keep `/patticake` canonical and `/patticake-national-delivery` redirect-only. Do not change routing.

## Consumes
- Patticake surface state from `lib/usePatticakeSurface.ts` (read only).

## Produces
- Elevated Patticake product page. No change to CTA env-var contract.

## Steps
1. Read `app/patticake/page.tsx`, `CakeStudioBand.tsx`, `PatticakeOriginBand.tsx`.
2. Restructure for product clarity, proof, gallery, clean pickup/delivery split.
3. Confirm CTA still respects the env-var routing contract. Test both states (var set vs unset) locally.

## Verification
```
cd yumkitchen-web && npm run typecheck && npm run lint && npm run audit:motion && npm run build
```
Expected: all pass. Capture `patticake-mobile.png` + `patticake-desktop.png` to `during/`.

## Done-signal
`DONE` noting CTA routing verified in both env states. `DONE_WITH_CONCERNS` if order copy needs Zach review before launch (it does, per the eyeball list).
