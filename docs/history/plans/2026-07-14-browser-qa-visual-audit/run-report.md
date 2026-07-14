# Full Browser QA / Visual Audit - 2026-07-14

Branch: `claude/browser-qa-visual-audit-311aaa`. No app code changed this round; audit only.
Scope: full automated verification gate, plus an interactive browser visual sweep of every route at desktop (1440x1000) and mobile (390x844) against a local production build, including key interactive states.

Result: VERIFY PASSED. One real finding (F1, console-only, no visible breakage). Two suspected visual bugs investigated and ruled out as false positives (see "False alarms ruled out").

## What was checked

Automated baseline (`bash verify.sh`, local production build, port 3000):
- typecheck, lint: pass
- audit:motion (28 checks): pass
- validate:content: pass (102 menu items, real location slugs, Toast/maps/phone fields, 57 referenced assets)
- production build: pass, 26 routes generated
- em dash check against `main`: pass
- smoke:ui: pass (home, reduced motion, location handoff, menu restaurant switching, order filters, cart quantity, checkout links, menu search)
- audit:visual-motion (36 route/viewport checks, 458 image instances, 6 reduced-motion routes): pass
- audit:links: pass, 56 internal routes and anchors
- axe a11y across 15 scripted routes: 0 serious, 0 critical
- Lighthouse (homepage, mobile, provided throttling): Perf 100 / A11y 100 / BP 100 / SEO 100

Manual interactive visual sweep (Claude Browser pane, separate `npm run start` on port 3010, since verify.sh tears its own server down at the end):
- All 20 routes at desktop 1440x1000: `/`, `/about`, `/accessibility-statement`, `/careers`, `/catering`, `/contact`, `/faq`, `/in-the-news`, all 4 `/location/[slug]`, `/menu`, `/order`, `/order-a-cake`, `/patticake`, `/patticake/checkout`, `/patticake/checkout/confirmation`, `/thank-you`, `/yum-kitchen`, `/logo-animation`, plus a not-found URL for the 404 page
- Key routes re-checked at mobile 390x844: `/`, `/menu`, `/order-a-cake` (including the `#cake-inquiry` form anchor), `/patticake`, `/faq`, `/yum-kitchen`
- Interactive states: mobile hamburger nav open/close, `LocationPickerModal` opened from `/yum-kitchen` "Start Order" with a cleared pickup preference (fresh-session picker path), hash-anchor scroll landing on `/order-a-cake#cake-inquiry`, empty `/patticake/checkout` state ("your box is empty"), `/patticake/checkout/confirmation` with no recent order ("no recent order"), pickup-preference propagation from a location page into `/menu`'s ordering panel
- Checked per route: full-viewport render, horizontal-overflow (`scrollWidth` vs `innerWidth`), console errors, network image-load status, true page-bottom rest state (via `scrollTo(0, scrollHeight)`, not just incremental scroll ticks, to avoid mistaking mid-scroll transients for stuck layout)

## Findings

- F1 (console error, no visible breakage): `ParallaxImage` (`components/motion/ParallaxImage.tsx:21`) produces a real, reproducible React hydration-mismatch console error on every load of `/`, `/order-a-cake`, and `/patticake` (the three pages that use it - `components/PatticakeHome.tsx`, `app/order-a-cake/page.tsx`, `app/patticake/page.tsx`), whenever the visiting browser has `prefers-reduced-motion: reduce` active (e.g. macOS "Reduce Motion"). Root cause: `useReducedMotion()` from `motion/react` resolves synchronously from `window.matchMedia(...)` on the client's very first render, so a reduced-motion client immediately renders `style={undefined}` on `<m.div style={reduce || paused ? undefined : { y }}>`, while SSR (no `window`) always renders the `{ y }` branch (`transform: translateY(-6%)`) - client and server disagree on the very first paint. Confirmed reproducible against both `next dev` and a `next build && next start` production server in the Claude Browser pane. The parallax itself behaves correctly (no drift, image renders), so this is not user-visible, but it is a real, always-on console error for reduced-motion visitors. The project's own `audit:visual-motion` script (`scripts/audit-visual-motion.mjs`) also emulates `prefers-reduced-motion: reduce` and asserts zero console errors/warnings across 6 routes including `/`, yet reported clean in this same run - so this is a real gap in that script's coverage in Puppeteer/headless Chromium, not just a one-off. Suggest: either give `ParallaxImage` an SSR-safe default (initialize the reduced-motion flag to a value that matches what the server rendered, and only flip after mount) or add `suppressHydrationWarning` to the animated node, then confirm the Puppeteer audit actually reproduces it before trusting that script's coverage of this class of bug going forward.

## False alarms ruled out

- Patticake home hero mosaic and `/patticake` hero cards: two of three photo panels appeared blank on the very first screenshot taken immediately after navigation. A second screenshot (or a plain reload) always showed all photos correctly - this was the screenshot tool catching a paint-in-progress frame right after `Image` decode, not a rendering bug. No occurrence after adding a short wait before screenshotting.
- `/faq` desktop: the sticky `RestaurantTaskDock` appeared to permanently cover the last FAQ accordion item and the newsletter band heading. Confirmed via `scrollTo(0, document.documentElement.scrollHeight)` that this was a mid-scroll transient (the dock is `position: fixed` and covers whatever section is currently at the bottom edge while scrolling past it, by design, same as the mobile sticky order bar). At true rest (top of viewport at the real page bottom), the footer is fully visible above the dock with no overlap.
- Homepage message ribbon on mobile: a tag reading "ou" appeared clipped at the left edge of the viewport mid-scroll. Confirmed via `document.documentElement.scrollWidth` vs `window.innerWidth` (both 390px, no page-level horizontal overflow) that this is the intended marquee-ticker clipping at its own container edge, not a layout bug.
- `/patticake` upside-down "yum! Kitchen and Bakery / born at yum! Kitchen and..." text: confirmed as the intentional rotated-ticket-stub design treatment (matches the "red ticket edge" motif already used on `LocationPickerModal` per the 2026-07-01 QA record), not a CSS transform bug.

## Verification

- `bash verify.sh`: VERIFY PASSED (see automated baseline above)
- No app code was changed this round, so no re-verification pass was needed

## Evidence

- Screenshots were reviewed interactively in the Claude Browser pane during this session and were not persisted to disk (no `qa-screenshots/` folder this round).
- `.claude/launch.json` was added to this checkout to launch `yumkitchen-web` dev server on port 3010 via the Browser tool's `preview_start`; harmless, left in place for future sessions.

## Residual risk / not covered this round

- F1 is unfixed - flagged for a follow-up patch, not patched in this audit-only pass.
- Deployed `patticake.com` / `yumkitchen.com` hosts were not re-compared against this build (no live-vs-local diff this round; this pass was against local production build only).
- Real form email delivery (Resend) and GA4/GTM debug events were not exercised.
