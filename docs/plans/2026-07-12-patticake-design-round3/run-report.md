# Patticake design round 3 — run report

Date: 2026-07-12. Branch: `qa-visual-review-2026-07-09` (stacked on the 07-09 QA round commit).
Design rationale: `design.md` in this directory.

## What shipped

1. **The message carries through** (`PatticakeMessagePreview`, `InquiryForm`, new `lib/cakeMessage.ts`).
   The message maker on `/patticake` and `/order-a-cake` was a dead end: you composed words on the
   cake and then had to retype them in the form below. New **"Send These Words"** button drops the
   composed message into the page's form — the delivery form's Gift message field (counter synced,
   field centered in view and focused), or seeded as `Words on the cake: "…"` in the pickup form's
   message (append-only, deduped, never overwrites visitor text). URL hash updates via `pushState`
   (a native hash jump — and `HashAnchorScroll`'s 1.6 s retry loop — would stomp the scroll-to-field;
   a synthetic popstate triggers Next's own scroll restoration, also stomping it; both found the hard
   way, see Verification). Fires `click_patticake_use_message` to the dataLayer.
2. **Home hero proof strip de-duped** (`PatticakeHome`): first cell was "Patticake", a duplicate of
   the H1 above it; now "made from scratch since 2005" (the footer's long-standing claim).
3. **Home moment-card buttons name the next step**: "Ship a Cake"/"Pick Up Locally" buttons that
   repeated their card titles are now "Start a Shipping Note" / "Start a Pickup Note", matching the
   forms' vocabulary.
4. **Home cross-links the message maker**: the white "patticake" card in the "what you get" band
   gained "try the message maker" → `/patticake#message-maker` (the band now carries that id with
   scroll-margin).

In-brand throughout: no palette/token, slug, Toast-URL, or voice changes.

## Verification

- Functional (Puppeteer, production build, 11/11 pass): delivery gift message prefilled + 140-clamp
  counter synced + field focused and centered in viewport; re-send replaces; pickup message seeded,
  re-send dedupes, different words append below visitor-typed text; hash lands on
  `#delivery-support` / `#cake-inquiry`; analytics events pushed.
- Scroll-stomping bugs found by the probe and fixed before ship: (a) `location.hash` navigation and
  HashAnchorScroll retries override the field scroll — use `pushState`; (b) synthetic
  `PopStateEvent` makes the Next router scroll-restore to the anchor — don't dispatch one; (c) lazy
  images loading mid-scroll shift layout under the animation — re-check at 700/1400 ms and nudge
  (same retry idea as HashAnchorScroll).
- `bash verify.sh`: result recorded below after the run.
- Before/after full-page screenshots: `qa_screenshots_2026-07-12_round3/` (gitignored, local).

## Verify result

VERIFY PASSED — typecheck, lint, motion audit, content validation (102 items), build, UI smoke,
link audit (55 routes), axe 0 serious / 0 critical on 15 routes, Lighthouse thresholds met
(home 100/100/100/100), em dash check clean.
