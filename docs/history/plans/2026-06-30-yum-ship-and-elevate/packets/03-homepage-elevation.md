# Packet 03 - Homepage elevation

Wave: 1
Depends on: 01
Owns (only these files): `components/HomeDesign.tsx`, `Hero.tsx`, `SeasonalShowcase.tsx`, `SummerTakeoutBand.tsx`, `CateringProof.tsx`, `PhotoMotionStory.tsx`, `KineticMenuRail.tsx`, `LocationGrid.tsx`, `app/page.tsx`

## Objective
Elevate the homepage toward best-in-class bakery warmth (Crumbl energy, Goldbelly appetite appeal) while fixing the one open UX risk: mobile density. Stay inside the brand system. Reference `../competitor-crumbl-home.png`, `../competitor-goldbelly-home.png`, `../competitor-susiecakes-home.png` for hierarchy and whitespace, not for color or font.

## The direction (opinionated, brand-safe)
1. **Mobile density.** The second-pass audit flagged the first scroll asking users to process location, menu preview, bakery, catering, locations all at once. Give each band more vertical breathing room on phone, one clear idea per screen, larger section headings, fewer competing CTAs above the fold. Lead the phone hero with a single `Start Order` action (already done) and keep it.
2. **Photography forward.** Bigger, edge-to-edge food imagery in SeasonalShowcase and SummerTakeoutBand. Let the photos carry appetite. Reduce decorative chrome that competes with them.
3. **Hierarchy.** One Trocchi headline per band, generous size on desktop, clear sub then single CTA. Tighten the gap between promise and action.
4. **Motion restraint.** Keep KineticMenuRail and PhotoMotionStory but ensure motion respects `prefers-reduced-motion` and passes `npm run audit:motion`. No motion above the LCP image.

## Constraints
- No new colors or fonts. No em dashes. Lowercase headlines.
- Do not touch files outside the owned list. MediaProofBand is owned by P06, do not edit it.
- Keep Organization JSON-LD and the homepage `priority` hero image behavior intact (LCP must not regress).

## Consumes
- Brand tokens from `tailwind`/`globals.css` (read only). `lib/locations.ts`, `lib/menu.ts` (read only).

## Produces
- Elevated homepage composition. No interface/signature changes to exported components (so menu/patticake that import KineticMenuRail still compile).

## Steps
1. Read current `HomeDesign.tsx` and child bands. Map every section.
2. Apply density + photography + hierarchy changes band by band. Phone first, then desktop.
3. Keep all CTAs wired to existing handlers (location picker, Toast links). Do not rewire order logic.
4. Run `npm run typecheck && npm run lint && npm run audit:motion` and a local visual check at 390px and 1280px.

## Verification
```
cd yumkitchen-web && npm run typecheck && npm run lint && npm run audit:motion && npm run build
```
Expected: all pass, build succeeds. Then capture `home-mobile.png` + `home-desktop.png` to the plan `during/` dir for the wave-boundary diff.

## Done-signal
`DONE` with a one-line summary per band changed. `DONE_WITH_CONCERNS` if any band needs Zach's photo-selection call.
