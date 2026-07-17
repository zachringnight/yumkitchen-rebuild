# Yum and Patticake creative regression guard - 2026-07-17

Branch: `codex/creative-regression-guard`.

## Outcome

The current Yum and Patticake launch system is now photo-led, motion-ready, reviewable in one site gallery, and protected against the visual regressions called out during review. Real Yum and Patticake photography stays unobstructed. Baby blue and logo red lead every designed frame. Copy and the active yum! logo player remain inside a dedicated field beside or below the image.

The website, Remotion source, social toolkit generator, review boards, package builder, AI-coder contract, and stale-pack routing now agree on the same direction.

## Root causes found

1. A stale Next development CSS cache could render removed overlay styles even when current source was clean.
2. Remotion `AbsoluteFill` kept its default full width and height when right or bottom offsets were added, so wide photo regions were hidden behind the blue panel instead of being reserved.
3. Compact motion panels did not reserve enough footer space for the proof, CTA, and logo rail.
4. Poster frames sampled the CTA before it reached full contrast.
5. The thank-you lane used a wedding-specific `Just Married` cake image.
6. Old builders, READMEs, review snapshots, and packaging folders could still present superseded white-card, three-choice, or over-photo direction as current.
7. Review and package metadata could drift from renamed carousel assets and newly added carousel sets.

## What changed

### Current creative

- Rebuilt the 14-lane motion and still system around separate photo and baby-blue copy regions.
- Kept red type, CTA, packaging ribbon, and active yum! logo player inside the blue field.
- Removed carousel number badges and logo marks from photography.
- Replaced the retired `new home` carousel ID with the current nationwide launch ID.
- Replaced the wedding-specific thank-you image with neutral cake proof.
- Moved the CTA earlier so it is fully visible for the final two seconds.
- Moved review poster sampling to 88 percent so proof and CTA are fully resolved.
- Replaced the equal three-choice structures on both active Patticake surfaces with one dominant nationwide gifting feature. Pickup, celebration planning, and the yum! bakery now sit in a secondary support rail.

### Asset factory and review

- Added exact filename-set validation for all five creative motion folders, six still folders, six carousel sets, two carousel-motion formats, and six brand deliverables.
- Added automatic rebuilds for the static and carousel Creative Production review boards whenever metadata is regenerated.
- Kept `/asset-gallery` as the current review surface and synced it only from the active launch pack.
- Added stale-review-asset archival so renamed files leave the active gallery without deleting provenance.
- Added one individual upload ZIP for each of the six carousel sets.
- Added dated bundle and staging quarantine so prior packages cannot sit beside the current handoff as ambiguous alternatives.
- Added outer ZIP checksums and made the Patticake slice-logo bundle rebuild from current exports on every package run.

### Source-of-truth and regression prevention

- Added `social/START-HERE.md` as the social creative router and linked it from mandatory `AGENTS.md` instructions.
- Marked the old Instagram kit, six-asset launch batch, motion pack, and motion template as historical and superseded in their own first-screen READMEs.
- Blocked their direct builders unless an explicit provenance-only environment override is set.
- Updated the full social toolkit generator so it preserves historical review state, emits LF-only CSV files, resolves the newest Creative Production renderer, and cannot regenerate white headline cards or copy over photos.
- Added motion audits for photo-region geometry, compact panel safety, CTA hold, poster timing, nationwide IDs, neutral thank-you imagery, stale-pack routing, builder fail-closed behavior, current gallery sync, and delivery completeness.
- Added an ownership-aware development cache cleaner. It clears stale `.next/dev` state but leaves an active development server untouched.
- Quarantined old Creative Production run-state, stream, widget, and generated-preview snapshots under the archive. Current review folders now contain only current boards and manifests.
- Added `docs/HANDOFF_CURRENT.md` and removed stale branch routing from the active task and handoff docs.

## Delivery inventory

- 14 campaign lanes.
- 70 creative MP4 masters across 10-second 9:16, 8-second 9:16, 4:5, 1:1, and 16:9.
- 12 carousel motion MP4s across 9:16 and 4:5.
- 5 brand motion video deliverables plus one Patticake slice-logo lockup PNG.
- 84 still placement masters.
- 31 carousel cards across 6 publishable sets.
- 200 browser-ready assets in `/asset-gallery`: 85 motion previews, 84 stills, and 31 carousel cards.

## Visual QA evidence

Durable review evidence is checked into the repository:

- Full motion contact sheet: `social/yum-patticake-creative-launch-2026-07-14/motion-review/contact-sheet.png`.
- Static campaign contact sheet: `social/yum-patticake-creative-launch-2026-07-14/contact-sheet.png`.
- Carousel contact sheet: `social/yum-patticake-creative-launch-2026-07-14/carousel-review/contact-sheet.png`.
- Wide human frame: `yumkitchen-web/public/review-assets/posters/motion-16x9-yum-people-behind-the-plate.jpg`.
- Wide cake frame: `yumkitchen-web/public/review-assets/posters/motion-16x9-patticake-gift-drop.jpg`.
- Fully resolved Patticake CTA frame: `yumkitchen-web/public/review-assets/posters/motion-9x16-10s-patticake-birthday.jpg`.
- Neutral thank-you still: `yumkitchen-web/public/review-assets/posters/static-feed-patticake-thank-you.jpg`.

## Verification

- Full media render completed from the final Remotion and carousel source.
- Motion QA passed 87 of 87 files. Exact output-set and creative regression checks all passed.
- Motion review rebuilt for 85 playable MP4 masters.
- Gallery sync completed with 200 current items and zero active `new home` references. The retired poster is preserved under the review archive.
- All 12 current top-level delivery ZIPs passed the outer SHA-256 manifest. The two full handoff bundles also passed all 182 and 215 internal file hashes.
- Web TypeScript passed and the expanded motion/design audit passed 52 checks after the final site hierarchy change.
- Final `bash verify.sh` passed on the final source: production build, critical UI flows, 36 route and viewport visual checks, 454 rendered images, 30 motion-role checks, 6 reduced-motion routes, 56 links and anchors, zero serious or critical accessibility violations, and Lighthouse 100/100/100/100.
- Final pull-request review remains the release gate for this branch.

## July 17 Instagram refresh

The read-only public `@yumkitchen` profile and latest 12 feed items were refreshed and visually reviewed. The July 6 through July 17 window contained 11 single-image posts, one community carousel, and no Reels. The organic account remains the reference for real people, food, restaurant life, and neighborhood texture. The launch pack is materially stronger in repeatable motion, baby-blue and red recognition, product explanation, and conversion clarity. The publishing recommendation remains a mixed feed, not a wall of designed conversion assets.

## External release gates unchanged

- Production DNS and host-routing cutover.
- Live Resend credential and form-delivery test.
- GTM and GA4 DebugView confirmation.
- Checkout-specific Patticake dates, fees, and address eligibility. Nationwide availability is approved launch truth.
