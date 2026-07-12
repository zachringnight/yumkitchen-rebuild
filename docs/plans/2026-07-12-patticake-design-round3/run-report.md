# Patticake design round 3, run report

Date: 2026-07-12. Branch: `qa-visual-review-2026-07-09` (stacked on the 07-09 QA round commit).
Design rationale: `design.md` in this directory.

## What shipped

1. **The message carries through** (`PatticakeMessagePreview`, `InquiryForm`, new `lib/cakeMessage.ts`).
   The message maker on `/patticake` and `/order-a-cake` was a dead end: you composed words on the
   cake and then had to retype them in the form below. New **"Send These Words"** button drops the
   composed message into the page's form, the delivery form's Gift message field (counter synced,
   field centered in view and focused), or seeded as `Words on the cake: "…"` in the pickup form's
   message (append-only, deduped, never overwrites visitor text). URL hash updates via `pushState`
   (a native hash jump, and `HashAnchorScroll`'s 1.6 s retry loop, would stomp the scroll-to-field;
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
  HashAnchorScroll retries override the field scroll, use `pushState`; (b) synthetic
  `PopStateEvent` makes the Next router scroll-restore to the anchor, don't dispatch one; (c) lazy
  images loading mid-scroll shift layout under the animation, re-check at 700/1400 ms and nudge
  (same retry idea as HashAnchorScroll).
- `bash verify.sh`: result recorded below after the run.
- Before/after full-page screenshots: `qa_screenshots_2026-07-12_round3/` (gitignored, local).

## Mid-round additions (Zach feedback, 2026-07-12)

- **Rebased onto the new main** (b152e07, PR #14 "design, UX, and copy upgrades" with the
  CakeBuyModule checkout). Most of the 07-09 QA fixes were already on main; that commit reduced to
  its run report. The message handoff survives intact: `#delivery-support` and the delivery
  InquiryForm still exist as the "talk it through first" path beside the new checkout.
- **Sticker overlap fix** (Zach: "the random stickers shouldn't cover up other parts of the
  website"). Measured every sticker (floating tags, taped labels, the "one cake" title card)
  against every text-bearing element on `/`, `/patticake`, `/order-a-cake` at both viewports, two
  animation samples. Offenders: the centered "one cake" card covered both polaroid captions
  (49%/47% desktop; on mobile the media-query `bottom` re-set stretched the caption to 193px tall
  under the card); the "just because" tag sat on the "ready to share" caption. Fixes in
  `globals.css`: frames 1-2 carry their captions at the TOP of the polaroid (desktop + the mobile
  media query), "just because" moved up onto the photo (bottom 26%), mobile "happy birthday" moved
  below the title card (top 67%, was clipped mid-word behind it). Post-fix audit: 0 overlaps at a
  6% area threshold.
- Em dashes stripped from all round-3 additions (verify.sh gates on them; the first verify run
  failed on exactly that, everything else green).

## Verify result

Final `bash verify.sh` on the rebased branch (2026-07-12): all checks passed - typecheck, lint,
motion audit, content validation, build, UI smoke, link audit, axe 0 serious / 0 critical,
Lighthouse home 100/100/100/100. The em-dash check initially flagged the diff because the local
`main` ref was stale (pre-PR-#14); after pointing local main at origin/main the diff is clean
(zero em dashes in this branch's added lines).
