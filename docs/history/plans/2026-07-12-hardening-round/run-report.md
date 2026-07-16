# Hardening round (B2/B3/B4/B6) - run report

Date: 2026-07-12. Branch: `chore/hardening-round`.

## Findings on arrival

- **B2 (.btn-* into @layer) was already done on main** - the buttons live in `@layer components`
  with the rationale comment, shipped via the Jul 9 PRs. Nothing to do; backlog entry was stale.
- **B6 (CI verify on push/PR) was half-done and broken**: verify.yml already had push/PR triggers
  and a documented SKIP_LH=1 (Lighthouse is hardware-flaky on shared runners), BUT the workflow had
  been **manually disabled** after its Jul 9 run on main went red (the motion-audit flake - "order
  modal dialog did not mount" - whose fix, a bounded waitForSelector, later landed via PR #15).
  Because it was disabled, PRs 12-15 ran with no CI at all.

## What this round did

- **B6**: re-enabled the workflow (`gh workflow enable`) and dispatched a proof run on main
  (result recorded below). No file changes needed - the workflow itself was already correct.
- **B3**: single-sourced the inquiry validation in `lib/inquiryValidation.ts` - the shared field
  schema plus the cake-delivery / cake-pickup / careers conditional rule tables and appliers.
  `components/forms/InquiryForm.tsx` (client) and `app/api/inquiry/route.ts` (server) now both
  build from it, so the rules cannot drift. Behavior-preserving: the server's shipping-signal
  inference and the client's explicit cakeMode driving are unchanged; only the duplicated rule
  lists moved. Server-side error strings adopt the client's visitor-facing phrasing.
- **B4**: dedicated 1200x630 OG crops for the three Patticake pages (they previously shared raw
  content photos at odd aspect ratios):
  - `/` -> `/og/patticake-home.jpg` (slices grid)
  - `/patticake` -> `/og/patticake-ship.jpg` (whole 8-inch cake with a piped message - the product
    that ships)
  - `/order-a-cake` -> `/og/order-a-cake.jpg` (wedding tiers with flowers)
  Each crop visually reviewed at share size; `lib/site.ts` pageMeta updated (twitter images follow
  the same refs).

## Verify result

- B6 proof: workflow re-enabled, dispatched run on main PASSED, and PR #16 (host routing) became
  the first PR gated by it - its pull_request check PASSED.
- This branch: bash verify.sh PASSED (typecheck, lint, motion audit, content validation, build,
  UI smoke, link audit, axe 0 serious / 0 critical, Lighthouse thresholds met, em-dash clean).
