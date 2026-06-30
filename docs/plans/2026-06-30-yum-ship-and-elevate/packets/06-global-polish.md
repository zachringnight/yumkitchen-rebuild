# Packet 06 - Global polish + conversion micro-copy

Wave: 1
Depends on: 01
Owns (only these files): `app/globals.css`, `components/OpenStatus.tsx`, `components/MobileOrderBar.tsx`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `components/MediaProofBand.tsx`, `lib/analytics.ts`

## Objective
Tighten the shared shell and add conversion micro-copy that builds trust across every page, without touching page-level compositions (those are P03/P04/P05).

## The direction
1. **Live open state (Improvement F2).** `OpenStatus` should show "open now, closes 8pm" or "closed, opens 8am" computed from `lib/locationHours.ts`. Tiny change, big trust signal. Render it on location cards and the header where a location context exists.
2. **Spacing scale consistency.** Normalize section vertical rhythm tokens in `globals.css` so P03/P04/P05 inherit consistent breathing room. Define utility classes, do not hardcode per-page.
3. **Order is unmissable on mobile (C6).** `MobileOrderBar` + header Order Now stay pinned and high-contrast. Confirm filled-button contrast uses `#C72830`/weight 700 to clear WCAG AA.
4. **Gift card visibility nudge (light touch only).** Ensure the existing gift-card link in header/footer is visible and labeled. Full gift-card module is Track 3, out of scope, do not build it.
5. **Analytics helper hygiene.** Confirm `lib/analytics.ts` exports a single typed dataLayer push and that all 9 events named in DEPLOYMENT.md are reachable. No UA `UA-83446946-1` anywhere.

## Constraints
- Do NOT edit any page composition or band owned by P03/P04/P05. Shared components only.
- No new colors/fonts. No em dashes. Lowercase headlines.
- Keep exported component signatures stable so the page packets compile against them.

## Consumes
- `lib/locationHours.ts`, `lib/locations.ts` (read only).

## Produces
- Consistent spacing tokens, live open-state, AA-safe order CTAs, clean analytics helper. Stable component interfaces.

## Steps
1. Implement/verify `OpenStatus` live computation against `locationHours.ts`.
2. Add spacing-scale utilities to `globals.css`.
3. Audit `MobileOrderBar` + `SiteHeader` Order CTA contrast.
4. Grep the repo for `UA-83446946-1` and confirm zero hits.

## Verification
```
cd yumkitchen-web && npm run typecheck && npm run lint && npm run build && ! grep -rn "UA-83446946-1" app components lib
```
Expected: build passes and grep finds nothing (the `!` makes a no-match exit 0).

## Done-signal
`DONE` confirming open-state live, contrast AA, zero UA hits.
