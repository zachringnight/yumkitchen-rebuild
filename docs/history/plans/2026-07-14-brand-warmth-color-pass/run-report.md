# Brand Warmth Color Pass - 2026-07-14

Branch: `claude/browser-qa-visual-audit-311aaa`. Follow-up to the same-day full browser QA audit (`docs/history/plans/2026-07-14-browser-qa-visual-audit/`).

Trigger: after checking the live `https://www.yumkitchen.com` directly against this build, the feedback was that the rebuild leans too hard on flat neutral gray (`--color-page: #f3f3f3`) instead of the brand's actual warm identity colors (cream, blue-tint, blue-soft, brand red), making it read as flat/draggy/corporate instead of fresh and warm. The live site never shows a flat gray backdrop anywhere checked (hero sections are full-bleed photography with a translucent cream/white card, never a bare color fill); this build's hero, several homepage bands, and the sitewide footer did.

Result: VERIFY PASSED (all pieces re-verified individually after a tooling flake, see Verification below). 27 files changed, purely color-token swaps plus one CSS gradient removal - no layout, copy, or logic changes.

## What was checked before changing anything

- Live `https://www.yumkitchen.com` directly in-browser: home, menu (desktop + mid-scroll), confirmed the hero and menu-page hero are 100% full-bleed food photography with a translucent card overlay, never a flat color section background.
- Direct grep of the codebase for every `bg-page` (Tailwind utility) and every `var(--color-page)` (raw CSS) usage across `app/` and `components/`.
- Direct read of `app/globals.css` `@theme` block to confirm the actual current token values (cream is `#fffdf7`, not the older `#fff4f5` some reference docs cite - `globals.css` is the source of truth per `AGENTS.md`).

## Root cause found

The single biggest contributor: **`app/globals.css`'s `body { @apply bg-page ...}`** and the matching `<body className="bg-page ...">` in `app/layout.tsx` - the entire document defaulted to flat gray, so any gap not covered by an explicit section background fell back to gray on every page. On top of that, roughly 30 individual page/section/card wrappers explicitly set `bg-page` rather than a warm token, including the homepage hero (`components/HomeDesign.tsx`), the sitewide footer (`components/SiteFooter.tsx`), the entire `/faq` page's `<main>`, and the shared `Hero.tsx` used by `/about`, `/contact`, `/careers`, `/location/[slug]`, and `/catering`.

One additional non-obvious case: `components/LocationGrid.tsx`'s `<section id="locations">` had its Tailwind `bg-*` class silently overridden by a hardcoded `.location-section { background: linear-gradient(180deg, var(--color-page), white 55%, var(--color-blue-tint) 100%); }` rule in `globals.css` - a decorative gradient (against `AGENTS.md`'s "no decorative gradients" rule) that also started from the gray token. Removed the rule entirely so the Tailwind class applies.

## Fixes made

- `app/globals.css` / `app/layout.tsx`: root `<body>` background `bg-page` -> `bg-cream`.
- `components/SiteFooter.tsx`: sitewide footer `bg-page` -> `bg-cream`.
- `components/HomeDesign.tsx`: homepage `HomeHero` section, its `hero-panel` card (`bg-white/95` -> `bg-cream/95`), and the 4 location quick-link buttons inside the hero card (`bg-page` -> `bg-blue-tint/40`).
- `components/PhotoMotionStory.tsx`, `components/LocationGrid.tsx`, `components/LocationExperienceBand.tsx`, `components/PatticakePathGuide.tsx`, `components/Hero.tsx` (shared), `components/RestaurantTaskDock.tsx` (sticky pickup button): section/card backgrounds `bg-page` -> `bg-cream` or `bg-blue-tint`.
- `app/menu/MenuClient.tsx`, `app/order/OrderClient.tsx`, `app/catering/page.tsx`, `app/faq/page.tsx`, `app/not-found.tsx`, `app/patticake/page.tsx`, `app/patticake/checkout/page.tsx`, `app/patticake/checkout/confirmation/page.tsx`, `app/order-a-cake/page.tsx`, `components/PatticakeHome.tsx`: page-level `<main>`/`<section>` wrappers `bg-page` -> `bg-cream`.
- Bordered accent-card instances that already had a defined border (so fill color doesn't affect legibility) - `components/ReviewsWall.tsx`, `components/CateringProof.tsx`, `components/PressExplorer.tsx`, `app/patticake/page.tsx`'s cake-facts cards, `app/catering/page.tsx`'s FAQ accordion - `bg-page` -> `bg-white` or `bg-cream`.
- Image-loading placeholder frames (`overflow-hidden bg-page` behind `<Image fill>`, minor/cosmetic) - `components/SeasonalShowcase.tsx`, `components/KineticMenuRail.tsx`, `components/FeatureBand.tsx`, `app/about/page.tsx`, `app/order/OrderClient.tsx`, `app/order-a-cake/page.tsx` - `bg-page` -> `bg-cream`.
- `app/globals.css`: removed the `.location-section` decorative gradient override (see Root cause); also warmed `/logo-animation`'s demo-page shell background from `var(--color-page)` to `var(--color-cream)`.

Left alone deliberately (legitimate, non-decorative uses of the gray token, confirmed by reading each in context):
- `app/globals.css`'s shared form-input class (`bg-page` as an input fill is a normal UI affordance, not a page background).
- `components/patticake/CakeBuyModule.tsx`'s unselected-option-tile state (`bg-page` vs `bg-cream` is a meaningful selected/unselected indicator, not decorative).
- `.patticake-ticket::before/::after`'s perforation-dot texture (`var(--color-page)` used for tiny "punched hole" dots meant to recede into whatever's behind the ticket - a legitimate micro-detail, not a flat gray section).

## A real regression caught and fixed mid-pass

The first color swap introduced 23 real WCAG AA color-contrast failures (`axe` `color-contrast`, serious): `text-body` (#736e6e) secondary copy sitting directly on the new `bg-blue-tint/70` fill (no white/cream card behind it, unlike the pre-existing safe uses of blue-tint elsewhere on the site) measured 4.1-4.4:1 contrast, under the 4.5:1 AA threshold for normal text. Root-caused via direct axe node inspection (not just the summary count), confirmed the exact CSS composite color computationally, and fixed by reverting every loose-`text-body`-on-blue-tint instance (`LocationGrid`, `LocationExperienceBand`, `MenuFeature` in `HomeDesign.tsx`, `RestaurantTaskDock`'s pickup button, and two ticket-style sections on `/patticake` and `/order-a-cake`) back to `bg-cream`, which is proven safe for that text color everywhere else on the site. A follow-up sweep with `axe` across every route this build has (not just the 15 in the project's default `npm run a11y` list) confirmed zero contrast violations after the fix.

## Verification

`bash verify.sh`'s own production-server startup check hit a false negative 3 times in a row in this environment (the server logged "Ready" every time per its own output, but the script's curl-poll declared failure - later traced to orphaned `next start` processes from the earlier failed attempts piling up on port 3000, which was cleared). typecheck / lint / motion audit / content validation / production build / em-dash check all passed cleanly on every attempt regardless. To get a clean, authoritative result the remaining browser-driven pieces were run individually against a manually-confirmed-running production server:

- `npm run smoke:ui`: pass (home, reduced motion, location handoff, menu restaurant switching, order filters, cart quantity, checkout links, menu search)
- `npm run audit:visual-motion`: pass (36 route/viewport checks, 458 image instances, 32 motion-role checks, 6 reduced-motion routes, zero console errors/warnings)
- `npm run audit:links`: pass (56 internal routes and anchors)
- `npm run a11y`: pass, 0 serious / 0 critical across all 15 scripted routes
- Independent `axe` sweep across every route in the app (not just the scripted 15): 0 serious/critical (2 of 18 routes hit the known, documented, network-sandbox-only Google Maps iframe timeout unrelated to this change)
- `npm run lh` (Lighthouse, homepage, provided throttling): Perf 100 / A11y 100 / BP 100 / SEO 100

## Residual risk / not done this round

- Purely a code-level and automated-tooling verification pass plus targeted manual screenshot spot-checks; a full fresh screenshot sweep of every route at both viewports (matching the earlier same-day browser-QA session's format) was not repeated end-to-end after these edits.
- The `ParallaxImage` reduced-motion hydration-mismatch console error flagged in the earlier same-day `2026-07-14-browser-qa-visual-audit` report is unrelated to this round and remains unfixed.
- No new photography or copy was introduced; this was scoped to color-token usage only, per the brand doctrine's "existing approved tokens only" constraint.
