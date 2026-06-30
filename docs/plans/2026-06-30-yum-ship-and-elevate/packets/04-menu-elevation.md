# Packet 04 - Menu elevation

Wave: 1
Depends on: 01
Owns (only these files): `app/menu/page.tsx`, `components/MenuMotionIntro.tsx`

## Objective
Make the menu scan like a premium bakery menu: easy to navigate, dietary-aware, photography where it exists, fast to find a section. Improvements C1 and the menu page being the worst a11y offender (listitem pile-up) both point here.

## The direction
1. **Sticky anchor nav** that actually sticks and highlights the active section on scroll (Lunch & Dinner / Breakfast / Bakery / Catering / Gluten & Allergens / Printable Menu).
2. **Dietary clarity.** Surface GF / vegan / vegetarian / nut-free tags per item where the data supports it. If a filter UI is cheap, default to "all" with filter state in the URL (`?diet=gf`). If not, at minimum render the tags as accessible chips. Document if filter is deferred.
3. **Density + rhythm.** Group items in proper `<ul>`/`<li>` so semantics are clean (this also keeps axe green). Consistent card or row rhythm, clear H2 sections, H3 items, generous spacing on mobile.
4. **Photos where they exist.** Per-item imagery from `03_assets/images/` only where a real photo maps to a real item. Never invent.
5. PDF links (Takeout, GF/Allergy) stay as `rel="noopener noreferrer"` fallback, open new tab.

## Constraints
- Render all items from `lib/menu.ts` (seeded from `06_handoff/data/menu_seed.json`). Do not invent items or prices.
- Hero H1 stays `fresh and friendly food`. No em dashes. Lowercase.
- Do not edit KineticMenuRail (owned by P03). If the menu page imports it, use it as-is.

## Consumes
- `lib/menu.ts` (read only).

## Produces
- Elevated, semantically clean, dietary-aware menu page.

## Steps
1. Read `app/menu/page.tsx` and `lib/menu.ts`. Confirm tag fields available.
2. Rebuild section list with proper list semantics and sticky anchor nav with scroll-spy.
3. Add dietary chips; wire optional URL filter if data supports it, else render tags only and note deferral.
4. Add item photos only for confirmed matches.

## Verification
```
cd yumkitchen-web && npm run typecheck && npm run lint && npm run validate:content && npm run build
```
Expected: all pass. Then run `npm run a11y` against `/menu` and confirm 0 serious `listitem` nodes (the historical worst page).

## Done-signal
`DONE` listing whether the dietary filter shipped or was deferred and why.
