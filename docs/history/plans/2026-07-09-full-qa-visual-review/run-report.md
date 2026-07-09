# Full QA / Visual Review - 2026-07-09

Branch: `qa-visual-review-2026-07-09` (off `codex/rendered-visual-motion-audit`).
Scope: full automated QA baseline, full visual sweep (19 routes x 2 viewports, patticake.com host simulation, interactive states), fix P1s and quick wins, prioritized upgrade backlog.

Result: VERIFY PASSED (see Verification below). Nine fixes shipped. No brand-token, copy, Toast-URL, or slug changes.

## What was checked

Automated baseline (all against a local production build):
- typecheck, lint, validate:content (102 menu items confirmed), audit:motion (21 checks): pass
- smoke:ui: pass (home modal focus trap, reduced motion, location handoff, menu restaurant switching, order filters, cart quantity, checkout links, menu search)
- audit:links: pass, 55 internal routes and anchors
- a11y (axe): 0 serious, 0 critical across all 15 scripted routes
- Lighthouse (provided throttling): `/` 100/100/100/100, `/menu` 100/100/100/100, `/patticake` 100/100/100/100, `/location/woodbury` 100/100/100/100
- audit:visual-motion (new rendered audit from the unmerged branch): FAILED before fix, see finding F2

Visual sweep (evidence: `qa_screenshots_2026-07-09/`, 59 files + manifest.json + route-meta.json):
- 19 routes x desktop 1440x1000 and mobile 390x844, including 404
- Simulated `www.patticake.com` host (Puppeteer host resolver): Patticake shell correctly scoped to `/`, `/patticake*`, `/order-a-cake`; restaurant routes keep restaurant nav and order controls
- Interactive states: order modal (both viewports), menu search + Change Restaurant flow (St. Paul switch propagates to panel, header, stored pickup), restaurant task dock after scroll, mobile sticky order bar, hash anchors (`#national-order`, `#delivery-support`, `#cake-inquiry`), contact empty-submit validation (errors render, no `/api/inquiry` request), reduced-motion home + menu, header fit at 1024
- Rendered checks per route: horizontal overflow, broken images, h1 count, near-blank body, console errors, robots/canonical/title
- Only automated finding: expected 404 resource errors on the intentional not-found page (not a bug)

## Findings and fixes (all shipped this branch)

- F1 (visual bug, P2): Order/call picker modal ran the location name and open status together ("yum! st. louis parkClosed now opens at 8am"). Root cause: `.btn-primary` in `globals.css` is defined outside any `@layer`, so its `inline-block` beats the Tailwind `flex flex-col` utilities on the modal buttons (unlayered CSS wins over layered utilities in the cascade). Fix: `block` on both children in `components/LocationPickerModal.tsx` order mode, matching the call-mode pattern. The systemic cascade issue is backlog item B2.
- F2 (test tooling, P1 for the branch): `audit:visual-motion` failed on "order modal dialog did not mount". Diagnosis: the modal is a `next/dynamic` chunk; after the 36-route sweep the mount takes ~300ms, but the script waited a fixed 150ms. Product verified fine (modal mounts in 1-5ms on a fresh page, ~300ms worst case). Fix: bounded `waitForSelector('[role="dialog"]', 5s)` before the assertion in `scripts/audit-visual-motion.mjs`. This unblocks merging `codex/rendered-visual-motion-audit`.
- F3 (SEO): `/logo-animation` demo page was public and indexable while absent from the sitemap. Fix: `robots: { index: false, follow: false }` in `app/logo-animation/page.tsx`.
- F4 (dead code): `app/patticake-national-delivery/page.tsx` server redirect was shadowed by the identical permanent redirect in `next.config.js`. Fix: page deleted; config 308 remains.
- F5 (metadata trap): global title template `'%s · Patticake'` in `app/layout.tsx` would mis-brand any future yum! page that passes a bare string title. All current pages use `{ absolute }` helpers, so removing the template changes zero rendered titles (verified byte-identical before/after). Fix: template removed; root title is now a plain string (Next's Metadata type requires `template` in the object form, caught by the first verify run).
- F6 (assets): `public/og/menu.jpg` was a PNG with alpha masquerading as .jpg (824 KB). Re-encoded as real JPEG (284 KB). Three photographic PNGs converted to JPEG at same dimensions, visually checked: `yum-szecret-salmon` 972->309 KB, `yum-seasonal-reuben` 928->260 KB, `yum-location-woodbury` 893->321 KB (references updated in `lib/locations.ts`, `lib/site.ts`, `components/HomeDesign.tsx`).
- F7 (assets): `pdfs/gf-allergy-menu.pdf` 7.9 MB -> 1.4 MB. The weight was one 3378x2223 gingham-background JPEG embedded twice; downscaled and re-encoded, text is vector and untouched. Before/after page renders compared: identical.
- F8 (consistency): location pages rendered JSON-LD via inline `dangerouslySetInnerHTML` while everything else uses the escaping `JsonLd` component. Unified on `JsonLd`.
- F9 (stale docs): `tasks.md` said 82 menu items (seed and validate_content agree on 102) - corrected. `AGENTS.md` referenced a `scripts/visual_diff.sh` that does not exist - now points at `audit-visual-motion.mjs`.

Net asset effect: `public/` 18 MB -> 9.1 MB.

## Verification (after fixes)

- `bash verify.sh`: VERIFY PASSED (typecheck, lint, motion audit, content validation, build, UI smoke, link audit, axe 0/0 on 15 routes, Lighthouse thresholds met, em dash check clean)
- `audit:visual-motion`: passes (36 route/viewport checks)
- `/logo-animation` renders `noindex, nofollow` meta; `/patticake-national-delivery` returns 308 -> `/patticake`
- Order modal re-shot: name and status stack correctly on desktop and mobile
- Rendered titles byte-identical on `/`, `/yum-kitchen`, `/menu` after the template removal

## Upgrade backlog (prioritized)

### Ready to build, no gate
- B1: Host-based brand routing in `proxy.ts` (currently a passthrough; both domains serve identical content, `/` is the Patticake home by design pre-cutover). Build behind an env flag so yumkitchen.com can serve the restaurant home at `/` after DNS cutover. Design first; touches canonicals + sitemaps.
- B2: Move `.btn-primary` / `.btn-secondary` / `.btn-link` into `@layer components` so Tailwind utilities can override them (root cause of F1). Requires a visual regression pass - the unlayered styles currently win in unknown other spots.
- B3: Dedupe the client/server Zod validation between `components/forms/InquiryForm.tsx` and `app/api/inquiry/route.ts` (shared schema module; the cake/careers conditional rules are duplicated and can drift).
- B4: Dedicated OG-dimensioned crops for Patticake pages (they reuse content photos; the Patticake home OG is not a proper OG crop).
- B5: Merge `codex/rendered-visual-motion-audit` (now green after F2) into main.
- B6: Turn on the GitHub `verify` workflow for push/PR (currently `workflow_dispatch` only), so verify.sh gates PRs automatically.
- B7: Archive or delete the stale snapshot at `~/Downloads/yumkitchen-rebuild-main` (git-less copy of main from Jul 1; this session started there by accident).

### Zach gates (launch checklist, unchanged)
- RESEND_API_KEY set + live form test to info@yumkitchen.com
- `YUM_FORMS_TO_*` per-location routing env vars (routing code shipped in round2, inert until set)
- GTM Preview / GA4 DebugView confirmation on a deployed preview
- DNS cutover go for yumkitchen.com (runbook in DEPLOYMENT.md, redirects.md)
- brand-blue-pass branch / PR #2: keep or kill

### Zach data needed
- C1 dietary filter tags (menu seed has none tagged)
- C2 location amenities + real dining-room photos
- A2 per-location SEO copy (400-600 words)
- G1 menu CMS decision (separate project)
- H1 loyalty / H2 holiday menu pages / H3 press kit

## Evidence

- Screenshots + manifest: `qa-screenshots/`
- Route metadata dump: `qa-screenshots/route-meta.json`
- Lighthouse raw output: /tmp/yum-lh-qa.json (per-page runs, not retained)
