# Rebuild Task List

## Current round: visual/creative audit fixes (2026-07-24)

This finalized list supersedes the original 5-item punch list from the visual/creative audit. An independent adversarial second-opinion pass re-examined that audit against the actual screenshot pixels and source code: it confirmed the two headline bugs, corrected two factually wrong claims (Patticake home's "five blue sections in a row" and the catering hero's "layered red badge"), widened the scope of two existing tasks, and surfaced new findings the original missed, including two possible rendering bugs on the Patticake commerce pages. Both source documents remain unchanged as evidence records; where they disagree, the list below follows the second opinion. Original audit (per-page scores, screenshots, methodology): `docs/history/qa/2026-07-24-visual-creative-audit/audit-report.md`. Second opinion (corrections, new findings, revised scores): `docs/history/qa/2026-07-24-visual-creative-audit/fable-second-opinion.md`. The scored visual artifact linked in the audit report predates the second opinion, so read it with that in mind. Per the one-PR-per-task rule, each item below is its own task/branch/PR, not a bundle.

Dropped from the original plan, per the second opinion: the "add a white/cream section to Patticake home" item (pixel sampling shows a white section already exists at position two; the real monotony problem is photo recycling, now P1 below) and the "simplify the catering hero badge" item (the red disc is the yum! sticker printed on the takeout box inside the photograph, not a UI element; no change needed).

**Executing this round?** Start with `docs/history/qa/2026-07-24-visual-creative-audit/HANDOFF-upgrade-round.md`. It carries the working agreement, the verified-and-closed items not to redo, the unused-photo inventory that unblocks the photo-recycling task, the three items gated on Zach, and a suggested execution order.

**Update 2026-07-26:** the two verification P0s were run live against the dev server and both came back clean, so they are closed below with no code change. The closing CTA reveals correctly on `/patticake` and `/order-a-cake`, and all three Patticake pages render clean at 390px (zero stuck reveals, zero broken images). The empty red slabs and blank mobile sections were artifacts of the audit's screenshot technique, which fires before scroll-triggered reveals finish. Full record: `docs/history/qa/2026-07-24-visual-creative-audit/2026-07-26-live-verification.md`. That leaves **5 real P0s**, the original five.

**P0 - verified bugs**

- [x] **fix-careers-hero-watermark** - DONE 2026-07-26. Repainted the credit out of the source file `public/images/yum-chef-team.jpg` (clean coat fabric cloned from above the text, feathered, re-exported at q92), so both the hero and the `lib/site.ts` careers OG image pick it up with no code change. Dimensions unchanged at 1800x1200. Verified at 4x zoom: credit gone, no seam, both chefs and both red yum! pins intact. Correction to the audit's description: it was not embroidery on the coat, it was flat black digital type composited on a lighter rectangular patch, with ghost letters above it from an earlier edit.
- [x] **fix-accessibility-statement-content** - CODE DONE 2026-07-26, BLOCKED ON ZACH BEFORE DEPLOY. The statement now runs above the existing feedback form in three sections. Every published claim was verified against this repo (the axe gate over 15 routes, the SiteShell skip link, `MotionConfig reducedMotion="user"` plus the noscript fallback, labelled fields with announced errors). A Lighthouse score claim was deliberately left out, since verify.sh enforces its a11y threshold on the homepage only. The WCAG conformance target and the response-time commitment render as visible bracketed placeholders with OWNER SIGN-OFF comments. Do not deploy this page until Zach resolves both.
- [x] **verify-patticake-final-cta-reveal** - CLOSED 2026-07-26, not a bug, no code change. Verified live: the `<Reveal>`-wrapped closing CTA animates from `opacity: 0 / translateY(24px)` to `opacity: 1 / none` on both `/patticake` and `/order-a-cake` once scrolled into view, with both CTA buttons at full opacity. Element screenshots confirm the rendered content. The empty red slabs in the audit captures were an artifact of its resize-to-full-height technique screenshotting before the last sections' reveal animations finish.
- [x] **verify-patticake-mobile-rendering** - CLOSED 2026-07-26, not a bug, no code change. Verified live at 390x844 across all three Patticake pages, scrolling each full page to let every reveal fire: zero stuck reveal elements and zero broken images on `/` (13 reveals, 13 images), `/patticake` (37, 18), and `/order-a-cake` (22, 24); footer rendered on all three. The two hero chips that measure `opacity: 0` on `/patticake` mobile are `hidden sm:grid`, deliberately not shown below the `sm` breakpoint, not stuck. Note the separate mobile *design* findings below (hero photo rendering twice) are unaffected and still open.
- [ ] **fix-hero-object-position** - Add an `objectPosition` prop to `components/Hero.tsx` (default to today's `center` behavior, so no other page changes) and set it explicitly on the two flagged crops. Honest framing per the second opinion: `/location/st-louis-park` (`yum-location-slp.jpg`) is the genuinely bad crop (dark storefront glass dominates; the human moment is clipped at the bottom edge), while `/about` (`yum-dining-room.jpg`) is mild polish, not the broken crop the original audit described. Same one-line component change covers both, and gives every future Hero page an escape hatch.
- [x] **dedupe-patticake-repeated-blocks** - DONE 2026-07-26. Canonical homes: "send cake, not a card" and "the restaurant behind patticake" on home; "make it sound like them" on `/order-a-cake`; "choose how the cake travels" retired entirely and `components/PatticakePathGuide.tsx` deleted. The `/order-a-cake` "send cake" instance was rewritten as page-specific copy rather than dropped, because `scripts/audit-motion.mjs` asserts the string "nationwide gifting" there and `CakeStudioBand` links to its `#shop-patticake` anchor. Message-preview placement was forced by `scripts/audit-visual-motion.mjs`, which requires `.message-preview-cake` on `/order-a-cake`. Ticker deliberately left on all three (script-asserted, and its resting state is a separate task).
- [x] **consolidate-patticake-process-explainers** - DONE 2026-07-26. One 4-step framework now defined once in the new `components/PatticakeProcessSteps.tsx` and reused on all three pages; wording derived from shipped copy, nothing invented. The home concierge band renders the same steps as a 2x2 grid, so the old 3-across `.concierge-note-stack` CSS became dead and was removed from `globals.css`.

**P1 - moderate effort, real payoff**

- [ ] **break-patticake-photo-recycling** - The Patticake surface's single biggest creative weakness per the second opinion: roughly six photos (light-wood slices, dark slices, buttercream swirl, gift box with ribbon, wedding-flowers cake, Just Married script cake) do twenty-plus jobs across `/`, `/patticake`, and `/order-a-cake`, sometimes twice in the same viewport. Delete the "made for every celebration" grid on `/order-a-cake` outright (zero new photos; tiles 1 and 2 are the same dark-slices shot side by side, with a ragged bottom edge), which also resolves the original audit's back-to-back-occasion-grids item, and eliminate same-viewport duplicates such as the "birthdays" tile reusing the photo from the collage directly above it. This task replaces the original P1 "add a white/cream section" item (see the dropped-items note above).
- [ ] **fix-occasion-photo-mismatches** - Occasion labels contradict their photos: on `/order-a-cake`, the "just because" tile shows a "Just Married" cake with wedding polaroids and "celebrations" shows the Just Married script cake; on `/patticake`, the "baker's man" and "coconut cake" thumbnails (generic celebration cakes per their copy) are wedding "Just Married" photos. Re-pair labels with matching photos or relabel.
- [ ] **fix-about-leader-and-founder-photos** - The Margaret ("Woodbury hospitality lead") leader card on `/about` uses `/images/yum-patti-kelli.jpeg`, whose own filename says it depicts Patti and Kelli, not Margaret. The same photo also serves "the restaurant behind patticake" on all three Patticake pages, the about-page family image, and the about OG image (six jobs total). Replace it with an actual photo of Margaret (or relabel the card), stop the six-way reuse, and give `/about` a labeled founders photo, since the copy names Patti and Robbie Soskin and never shows them.
- [x] **fix-careers-form-layout** - DONE 2026-07-26. Dropped the 0.8fr/1.2fr split that left the left column empty for ~1,300px. Page is now hero, white intro with an open-roles and hiring-locations block, then a full-width cream apply section (`#apply`) with the form at max-w-4xl so its internal two-column grid pairs fields. Open-roles block claims nothing unsupported: team names come from the page's own intro copy, all four restaurants render from `lib/locations.ts`, and no job titles, wages, shift hours, or per-location opening status are asserted. Degree question cut, plus its now-dead readers in `app/api/inquiry/route.ts` and `lib/inquiryValidation.ts`.
- [x] **fix-reviews-star-rounding** - DONE 2026-07-26. Root cause was `Math.round(value)` in `Stars()`: 4.4 rounded down and looked right by accident, 4.5 rounded up to a filled five-star row. Replaced with true fractional fill (dimmed base star plus a clipped overlay at `fillRatio * 100%`); honest at 4.0, 4.4, 4.5, 4.7, and 5.0. Accessible name still states the real numeric value, all glyphs stay aria-hidden. Headline corrected to "loved in st. louis park", since `lib/reviews.ts` shows all three rating proofs are St. Louis Park only.
- [ ] **fix-patticake-mobile-hero-double-photo** - On mobile, `/patticake` and `/order-a-cake` each render the identical hero photo twice within the first screen and a half (once captioned in the collage, then again larger below), a mobile-stacking behavior of the hero layout; desktop shows each photo once. Confirm alongside verify-patticake-mobile-rendering, then fix the stacking.
- [ ] **fix-location-page-repetition-and-press-mismatch** - On the shared location-page template: the address/phone/hours/order-button set repeats three times on one page (cut it down), and two of the three "loved in st. louis park" press proof points are actually about Patticake, not the restaurant; swap in restaurant-specific proof. (The "see what's coming out of the kitchen right now" banner is handled separately in P2 as a sitewide `ReviewsWall` change, not a location-template change.)
- [x] **dedupe-in-the-news-archive** - DONE 2026-07-26. Three duplicates removed, one more than the audit found (Eater desserts map). Verified by fetching each archive entry's old WordPress wrapper post and comparing its outbound link against the curated href, not by matching titles. Note the audit called it a 22-item archive; it was actually 23, now 20. Curated stays 8. Nothing hardcodes the count, and all three retired slugs are already in `pressArchiveRedirects` in `next.config.js`, so no SEO equity is lost. Filter pills do filter both sections; that is now stated, the archive count is filter-aware with `aria-live`, and the pills are grouped with a clearer label.
- [x] **fix-contact-cta-redundancy** - DONE 2026-07-26. Hero now says calling is quickest up front, followed by a "pick the quickest path" section with three routes (ordering via the existing CallPickerButton, catering to `/catering`, press). The `InquiryMomentumBand` that repeated the call CTA below the form is gone; `LocationGrid` stays as the call-path detail. OPEN: there is no press or media address anywhere in the repo, so press routes to the general form with a "Press" subject. If Zach has a real press address, that card should point at it.
- [x] **tailor-thank-you-confirmation** - DONE 2026-07-26, with a finding. Response-time line added (placeholder, needs Zach), "Browse Menu" replaced with a universal urgent path, and per-kind branching built behind an optional `?kind=` param for catering, cake, careers, and accessibility, with the GiftCardBand upsell suppressed for accessibility. FINDING NOT IN THE AUDIT: `/thank-you` is orphaned. Nothing in `app/`, `components/`, `lib/`, or `scripts/` links or redirects to it; `InquiryForm` shows an inline success message and resets, so no visitor reaches the page today. The branching is inert until `InquiryForm` redirects here on submit. That redirect is a conversion-flow change and needs Zach's decision, so it was deliberately not included.

**P2 - polish**

- [ ] **fix-ticker-resting-state** - The message-ideas marquee ticker can rest at a mid-loop/truncated position on load, visible as cut-off words at the left edge in the desktop captures of Patticake home and `/order-a-cake`; check its resting and reduced-motion states.
- [ ] **set-remaining-hero-crops** - `/location/woodbury` and `/location/shady-oak` heroes are portrait-sourced too but land acceptably; once the `objectPosition` prop from fix-hero-object-position exists, give them the same one-line check and explicit setting.
- [ ] **fix-patticake-hero-photo-nits** - The `/patticake` desktop hero's second photo renders as a ~190px clipped vertical sliver that reads as accidentally cut; widen or drop it. Retire the plastic-clamshell cake-slice photo (reads as leftovers in a to-go box), used twice on `/patticake` including under "family moments", or use it once at most.
- [x] **fix-kitchen-banner-promise** - DONE 2026-07-26. Softened to "follow along with what is coming out of the kitchen", which describes what the Instagram and TikTok links actually do. No fake thumbnails, counts, or timestamps; the rights-safe UGC gating is untouched.
- [ ] **reduce-yum-home-photo-repeats** - On `/yum-kitchen`, the same four dish photos (mixed berry salad, grainy mustard salmon, ahi tuna sandwich, frosted sugar cookie) each appear two to three times across three consecutive sections, and a marquee strip directly below the "breakfast, bakery, lunch, dinner" collage repeats four of the collage's photos with the same captions; thin the repeats. Also fix the collage's wide "MORNING REGULARS" tile, a bad crop of a portrait photo (mostly out-of-focus background with the coffee glass clipped at the left edge).
- [ ] **polish-cosmetic-details** - Two small ones from the second opinion: the "0 favorites selected" zero on `/order` renders like a lowercase "o" in the serif face, and the "MADE FROM SCRATCH SINCE 2005" white caption on the Yum home hero has marginal legibility over the busy photo.

## Prior round: launch-moment motion and review handoff (2026-07-21)

This round turns the nationwide Patticake launch and the yum! bakery story into four premium films across five placements. The system uses full-frame real photography, separate baby-blue message scenes, one red sentence at a time, the real yum! logo as a motion player, and a readable action close. Copy never sits on photography. The 20 new exports bring the active pack to 107 motion files and `/asset-gallery` to 220 reviewable assets.

Three owned yum! photographs received non-generative tonal finishing through Adobe and remain preserved beside the original sources. The active launch pack, delivery packages, AI-coder handoff, live-site comparison, Instagram benchmark, and Crumbl, Goldbelly, and SusieCakes cross-check now describe the same production direction. Current report: `docs/history/plans/2026-07-21-launch-moment-motion/run-report.md`.

The next production sequence is defined in `docs/superpowers/plans/2026-07-21-benchmark-beating-creative-plan.md`. It keeps the current regression guards in place while adding a one-business-day seasonal lane, commerce measurement, rights-safe human proof, and real-moment motion.

The release is intentionally ordered across [PR #26](https://github.com/zachringnight/yumkitchen-rebuild/pull/26), owned source photos, [PR #27](https://github.com/zachringnight/yumkitchen-rebuild/pull/27), motion production, and [PR #28](https://github.com/zachringnight/yumkitchen-rebuild/pull/28), review board plus stable handoff. This split avoids the combined media transport limit while preserving the complete verified release.

The final crop pass reviewed all 20 launch outputs across their photo scenes, all 20 posters, the complete Yum hero rotation at desktop and mobile sizes, and the image-heavy site routes. It corrected the wide gift-box mark, stable poster timing, and gallery thumbnail aspect handling before merge.

## Prior round: rights-safe social proof (2026-07-21)

This round replaces stale aggregate counts and unsupported sample-review language with dated, linked Google Maps, Yelp, and Restaurantji proof. `ReviewsWall` now serves `/patticake`, `/yum-kitchen`, and every location page. Instagram and TikTok point only to the owned profiles. Individual customer text, photos, and videos remain fail-closed through `yumkitchen-web/lib/ugc-rights-ledger.json`; nothing appears until written usage approval is recorded.

Merged into `main` through [PR #25](https://github.com/zachringnight/yumkitchen-rebuild/pull/25) at commit `8aa4a86`.

## Prior round: Patticake-first commerce simplification (2026-07-21)

Patticake is the single hero product. Other yum! cakes sit in a secondary treatment. Baby blue and red carry the product controls, cart, and checkout, and duplicate shipping navigation was removed. Merged into `main` through [PR #24](https://github.com/zachringnight/yumkitchen-rebuild/pull/24) at commit `86df1ae`.

## Prior round: creative regression guard and production handoff (2026-07-17)

This round merged into `main` through [PR #22](https://github.com/zachringnight/yumkitchen-rebuild/pull/22) at commit `144a142`. Current report: `docs/history/plans/2026-07-17-creative-regression-guard/run-report.md`. Stable handoff: `docs/HANDOFF_CURRENT.md`.

This round makes the current photo-led baby-blue and red system reproducible across the site, launch creative, motion masters, carousels, production board, and delivery packages. It also retires executable stale visual builders, removes the rejected equal three-choice Patticake layout, refreshes the live Instagram benchmark, and routes both the retired folder path and active work to the canonical checkout.

Do not pick an unchecked item from the historical sections below as an active task. The only standing open items are owner-gated production configuration or data listed in the current handoff and deployment runbook.

## Prior round: ParallaxImage hydration fix + repo handoff prep (2026-07-14)

Closed the one open item from the same-day browser QA audit: `components/motion/ParallaxImage.tsx` read `useReducedMotion()` directly, which resolves synchronously on the client's first render but not during SSR, so a reduced-motion visitor's first paint disagreed with the server-rendered HTML (a real hydration-mismatch console error on `/`, `/order-a-cake`, `/patticake`). Fixed with a `mounted` state that starts `false` on both server and client (so the first render always matches) and flips `true` in a pre-paint layout effect - reduced-motion users never see a flash of the parallax transform, and the console error is gone. Verified directly: zero console errors on all three affected pages in a fresh browser session, `npm run audit:visual-motion`'s reduced-motion routes still pass, full `bash verify.sh` piece-by-piece re-run clean (axe 0/0, LH 100/100/100/100). Independently code-reviewed the prior brand-warmth color-pass diff (27 files) with zero issues found.

Also did a repo handoff pass: found and fixed real staleness beyond the app code -
- `AGENTS.md` documented the cream token as `#fff4f5` (actually `#fffdf7`) and called `proxy.ts` a no-op passthrough (it has held real host-routing logic since 2026-07-12); both corrected.
- Four completed, merged rounds (host-based brand routing B1, hardening B2/B3/B4/B6, patticake design round 3, patticake motion round 4 - PRs #15-18) existed only under an undocumented top-level `docs/plans/` folder, never catalogued in this file and never moved into `docs/history/plans/` per the repo's own convention. Moved them in and added round entries below. Deleted a stale duplicate draft of the 2026-07-09 report that had been left in `docs/plans/`.
- The "known stale branch" warning about `brand-blue-pass` (PR #2) was itself stale - the PR was closed unmerged and the branch deleted back on 2026-07-12. Removed the warning, corrected the one remaining reference to it.
- `docs/design-qa.md` was a single, ungeneralized 2026-07-01 QA record dated two weeks stale despite `AGENTS.md`/`README.md` describing it as "the latest design QA record." Moved the old record into `docs/history/qa/` and replaced it with a short pointer to the actual current rounds.
- `.claude/settings.local.json` and `.claude/scheduled_tasks.lock` (personal permissions and a session-runtime lock file) were untracked but not gitignored, risking accidental commit; added to `.gitignore`. `.claude/launch.json` (a reusable dev-server shortcut) is kept trackable.

## Recommendations for the creative team (design, motion/animation, photography)

Grounded in this session's direct side-by-side check of the live `yumkitchen.com` and a read of the existing motion system, brand doctrine, and reference handoff docs. None of this is started; each item names who it's for and what it needs to move.

**Reviews / UGC wall - shipped in the 2026-07-21 round.** `components/ReviewsWall.tsx` uses linked, dated aggregate proof and attributed editorial coverage on `/patticake`, `/yum-kitchen`, and all four location pages. There are no sample customer reviews. Future Google, Yelp, Restaurantji, Instagram, or TikTok customer stories must enter `yumkitchen-web/lib/ugc-rights-ledger.json` with written usage evidence before the component can render them.

**For photography:** once dietary tags (C1), location amenities + real dining-room photos (C2), and per-location SEO copy (A2) are available (already tracked below as Zach-data-gated), swap them in for any remaining generic/stock crops. The color-warmth pass just shipped fixes the palette; specific, real photography per location is the other lever for the "fresh, warm, loving" feel the brand is going for; the two compound.

**For design:** the live site's red "serving great food for now or for later" band closes with a decorative scalloped/wave divider (SVG) into the next section - a small, tasteful bakery-ticket-style flourish our equivalent `RedBand` doesn't have. Worth a look as a possible signature edge treatment, but it's a genuinely *new* visual element, not a token swap - `AGENTS.md` currently forbids decorative gradients and doesn't define a wave/scallop motif, so this needs explicit design sign-off before anyone builds it, not an engineering call.

**For animation/motion:** the Patticake message-maker handoff (word-pop-in as you type, message transfer to the form, and an arrival pulse on the prefilled field - `components/PatticakeMessagePreview.tsx` et al., round 4) is the strongest, most distinctive interaction in the build. Worth a conversation about whether a lighter version of that same "personalize, then hand off" choreography belongs anywhere in the yum! restaurant ordering flow (building a catering order, picking a location) - reuse `Reveal`, `Stagger`, `PressButton`, and the shared spring tokens. Do not reintroduce decorative sticker or tape-chip treatments. Separately, the fix in this round to `ParallaxImage`'s reduced-motion check (a `mounted` flag that starts `false` on both server and client, then flips in a pre-paint layout effect) is a clean, reusable pattern - apply it anywhere else `useReducedMotion()` gets called directly in future motion work, to avoid reintroducing the same hydration bug.

**Already covered, no gap:** a menu/dish-photo carousel (`KineticMenuRail`, already links straight into ordering - more functional than the live site's plain non-interactive carousel), per-page OG/share images (`lib/site.ts` `pageMeta`, covers every page but the accessibility statement, which doesn't need one), and the online-ordering flow itself (the live site has no dedicated order page at all, only a modal that hands off to Toast; this build's `/order` has pickup selection, favorites browsing, and a cart).

## Prior round: brand warmth color pass (2026-07-14)

Follow-up to the same-day browser QA audit. Live `yumkitchen.com` never shows a flat gray section background (full-bleed photography + translucent card everywhere checked); this build did, root-caused to the `<body>` element defaulting to the neutral `--color-page` gray plus ~30 individual `bg-page` section/page wrappers, including a hidden CSS gradient on `LocationGrid` that silently overrode its Tailwind class. Swapped every non-functional gray usage to the brand's warm tokens (cream/blue-tint), removed the gradient. Caught and fixed a real WCAG contrast regression introduced mid-pass (gray secondary text on the new blue-tint background dropped under 4.5:1 in a few spots with no card behind it) before it shipped. `bash verify.sh`'s own server-start check flaked 3x in this environment (build/typecheck/lint always passed; server always logged Ready); re-verified every remaining piece individually against a confirmed-running server - all pass, axe 0/0 sitewide, LH 100/100/100/100. Full report: `docs/history/plans/2026-07-14-brand-warmth-color-pass/run-report.md`.

## Prior round: full browser QA / visual audit (2026-07-14)

Audit only, no app code changed at the time. `bash verify.sh` VERIFY PASSED (axe 0/0, LH 100/100/100/100). Full interactive browser sweep of all 20 routes at desktop + mobile, plus key interactive states (location picker, mobile nav, hash-anchor scroll, empty-cart/no-order states). One real finding: a reduced-motion hydration-mismatch console error in `ParallaxImage` on `/`, `/order-a-cake`, and `/patticake`, which the project's own `audit:visual-motion` script does not currently catch. Full report: `docs/history/plans/2026-07-14-browser-qa-visual-audit/run-report.md`.

- [x] Fixed same-day, see "Latest round" above. `scripts/audit-visual-motion.mjs` still does not independently catch this class of bug (it never reproduced the failure even before the fix) - if touching `ParallaxImage` or similar SSR/client motion-value patterns again, verify by hand in a real browser with reduced motion enabled, don't rely on that script alone.

## Prior round: patticake motion round 4 (2026-07-13)

Branch `claude/newest-repo-version-731b25` (this branch, merged via PR #18 before this session's work began). Added the site-wide motion layer: `motion` library + `MotionProvider` (LazyMotion, `MotionConfig reducedMotion="user"`, no-JS `<noscript>` fallback), `Reveal`/`Stagger`/`TapeTag`/`PressButton`/`ParallaxImage` primitives, and full choreography on home, `/patticake`, `/order-a-cake`, and checkout (hero sequences, the ticket-stamp set piece, the message-maker word-pop + liftoff-chip showpiece). Post-PR review round hardened `Reveal`/`Stagger` viewport thresholds and verified reduced-motion + no-JS guarantees with dedicated scripts. Full report: `docs/history/plans/2026-07-13-patticake-motion-round4/run-report.md`.

- [x] `bash verify.sh` VERIFY PASSED (axe 0/0 on 15 routes, LH mobile 100/100/100/100); merged via PR #18.
- Note: this round's own reduced-motion verification did not catch the `ParallaxImage` SSR hydration-mismatch console error found the next day (see the two 2026-07-14 rounds above) - it checked the final settled visual state, not the transient first-paint console warning.

## Prior round: patticake design round 3 (2026-07-12)

Branch `qa-visual-review-2026-07-09`, later rebased onto main (PR #14) and merged via PR #15. "The message carries through": a "Send These Words" button drops the message-maker's composed cake message directly into the delivery or pickup inquiry form (synced counter, focused/centered field, append-and-dedupe for pickup), replacing a dead-end flow where visitors had to retype it. Also de-duped the home hero proof strip, renamed moment-card CTAs to match form vocabulary, cross-linked the message maker from the home page, and fixed several floating-sticker/caption overlaps found by a full overlap audit. Full report: `docs/history/plans/2026-07-12-patticake-design-round3/run-report.md`.

- [x] `bash verify.sh` VERIFY PASSED (axe 0/0, Lighthouse home 100/100/100/100); merged via PR #15.

## Prior round: hardening round - B2/B3/B4/B6 (2026-07-12)

Branch `chore/hardening-round`, merged via PR #17. Closed backlog items from the 2026-07-09 round: **B3** single-sourced inquiry form validation (`lib/inquiryValidation.ts`, shared by client and server so the rule sets cannot drift); **B4** dedicated 1200x630 OG crops for the three Patticake pages (previously shared raw content photos at odd aspect ratios); **B6** re-enabled the `verify` GitHub Actions workflow (had been manually disabled after a since-fixed flake, leaving PRs 12-15 with no CI). B2 (`.btn-*` moved into `@layer components`) turned out already done on main; backlog entry was stale. Full report: `docs/history/plans/2026-07-12-hardening-round/run-report.md`.

- [x] `bash verify.sh` VERIFY PASSED; merged via PR #17. CI verify workflow confirmed green on main and gating PRs again.

## Prior round: host-based brand routing - B1 (2026-07-12)

Branch `feat/host-brand-routing`, merged via PR #16. Built the env-flagged (`NEXT_PUBLIC_YUM_HOST_ROUTING=1`, off by default) routing that will let `yumkitchen.com` serve the restaurant home at `/` after DNS cutover while `patticake.com` keeps the Patticake home - a middleware rewrite (not redirect, to preserve SEO equity per `docs/redirects.md`), host-aware client shell, and flag-aware canonical/sitemap. Verified byte-identical to today's behavior with the flag off. Full report: `docs/history/plans/2026-07-12-host-brand-routing/run-report.md`.

- [x] `bash verify.sh` VERIFY PASSED (flag off, default build); merged via PR #16.
- [ ] OPEN (Zach gate): set `NEXT_PUBLIC_YUM_HOST_ROUTING=1` in Vercel and redeploy at actual DNS cutover time - see `docs/DEPLOYMENT.md` runbook.

## Prior round: repo reorg + full QA visual review (2026-07-09)

Branch `chore/repo-reorg-2026-07-09`. Two tracks: (1) reorganized the whole repo for AI-coder clarity, one entry point (`AGENTS.md`), one `docs/` tree, one `scripts/` folder, obsolete handoff docs archived, stale facts corrected; (2) reconciled 9 verified fixes (modal layout bug, audit-script timing, `/logo-animation` noindex, dead redirect page removed, title-template trap fixed, 3 images converted PNG to JPEG, allergy PDF compressed 7.9 MB to 1.4 MB, JSON-LD consistency, stale doc counts) found uncommitted in a second clone from an earlier same-day QA pass. Full report: `docs/history/plans/2026-07-09-full-qa-visual-review/run-report.md`.

- [x] verify.sh VERIFY PASSED (axe 0/0 on 15 routes, LH 100/100/100/100).
- [x] Merged into `main` via PR #9 (fast-forward, `79fb13b`); branch deleted. Second clone was already gone from disk, nothing to reset.

## Prior round: upgrade-round2 (2026-07-01)

Branch `yum-upgrade-round2-2026-07-01`. Closed the safely-shippable improvements from the v1 list: gift card band (B3), catering FAQ + JSON-LD (H4), per-location cake/catering email routing (G4), per-page OG images (A5), nofollow on external press links (A6). Repo hygiene: shipped branches deleted, .bak/.DS_Store cleared. Full report: `docs/history/plans/2026-07-01-yum-upgrade-round2/run-report.md`.

- [x] verify.sh VERIFY PASSED (axe 0/0 on 15 routes, LH 100/100/100/100) after two caught-and-fixed QA findings.
- [ ] OPEN (Zach gates, unchanged): RESEND_API_KEY + live form test; GTM/GA4 DebugView confirm; DNS cutover go. (`brand-blue-pass` PR #2 was closed unmerged and its branch deleted 2026-07-12 - resolved, no longer open.)
- [ ] OPEN (Zach data): dietary tags (C1), amenities (C2), location SEO copy (A2), menu CMS (G1), holiday/loyalty/press-kit surfaces (H).

## Prior round: ship-and-elevate (2026-06-30)

Branch `ship-and-elevate-2026-06-30`. Tracks: ship-it-live + in-brand design polish. Full report: `docs/history/plans/2026-06-30-yum-ship-and-elevate/run-report.md`.

- [x] Baseline VERIFY PASSED (axe 0 serious, LH 91/100/100/100) and before-shots.
- [x] Confirmed live on Vercel preview; no custom domain attached (DNS gate intact).
- [x] In-brand mobile-rhythm polish on home, menu, Patticake (no color/content/CTA change). Re-verified: axe 0, LH 93/100/100/100.
- [x] Cutover runbook: `docs/redirects.md` 301 audit + rollback path in `docs/DEPLOYMENT.md`.
- [ ] OPEN (Zach gates): set Resend secret + live form test; confirm GTM/GA4 in a preview; DNS cutover go.
- [ ] OPEN (mechanical): redeploy polished build to a fresh preview (environment upload fault blocked it this run).

---

## Historical June 30 planning snapshot

The following branch note and checklist are preserved only as historical context. They are not the active branch or current execution plan. Do not resume `checkpoint/patticake-design-2026-06-30` from this section.

Branch at the time: `checkpoint/patticake-design-2026-06-30`, with the Patticake design pass preserved at commit `153084a`.

Checklist at the time:

- [ ] Fix homepage Lighthouse performance. Last full run: Lighthouse Perf=85 A11y=100 BP=100 SEO=100.
- [ ] Consolidate Patticake routing so `/patticake` is canonical and `/patticake-national-delivery` is legacy redirect only.
- [ ] Verify Patticake product UX on `/patticake`, mobile, and host `patticake.com`.
- [ ] Recheck main-site conversion, SEO, metadata, sitemap, social links, JSON-LD, and gift card links.
- [ ] Recheck forms, Resend env handling, analytics events, and deployment docs.
- [ ] Run `bash verify.sh` and require `VERIFY PASSED` before merge or PR-ready status.
- [ ] Write the end report in `docs/history/plans/2026-06-30-yum-upgrades-improvements/run-report.md`.

Execution plan: `docs/history/plans/2026-06-30-yum-upgrades-improvements/manifest.md`.

---

## Historical scaffold task list

The task list below is retained for context. It reflects the original PR-per-task scaffold workflow and is not the current execution order.

One PR per task. Run `bash verify.sh` before opening a PR. Do not bundle tasks.

Status:
- [ ] pending
- [/] in progress
- [x] complete

---

## T-01 - Project scaffold

**Acceptance criteria:**
- [ ] `yumkitchen-web/package.json` installs cleanly with `npm install`
- [ ] `npm run dev` boots Next.js 14 on http://localhost:3000
- [ ] `tailwind.config.ts` includes all brand tokens (`brand-primary`, `brand-primary-darker`, `ink`, `body`, `page`, `cream`, `blue-soft`, `blue-tint`)
- [ ] `next/font` loads Trocchi (weight 400) and Archivo Narrow (weights 400 + 700)
- [ ] `app/layout.tsx` sets default metadata, GTM script slot, font variables
- [ ] `app/globals.css` defines `.btn-primary`, `.btn-secondary`, `.btn-link`, `.container-content`
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` and `npm run lint` pass

Files to create: see scaffold under `yumkitchen-web/`. Most are stubbed already - fill in `lib/locations.ts` from `06_handoff/data/locations.json`.

---

## T-02 - Shared components: Header, Footer, LocationCard, LocationGrid

**Acceptance criteria:**
- [ ] `components/Header.tsx` with sticky positioning, logo (links to `/`), nav (menu, work @ yum!, gift cards, our story, locations, catering), filled-red Order Now button
- [ ] Header Order Now opens `LocationPickerModal` in `mode="order"`
- [ ] `components/Footer.tsx` includes social icons (with `aria-label`), Quick Links, 4 location cards
- [ ] `components/LocationCard.tsx` and `components/LocationGrid.tsx` already exist as scaffolds - wire them up
- [ ] `components/LocationPickerModal.tsx` already exists - verify the inside-dialog close button and 44x44 tap targets
- [ ] All 4 social icons have `aria-label` (Facebook, Instagram, Twitter/X, LinkedIn)
- [ ] Footer renders the same on every page

---

## T-03 - Homepage `/`

**Acceptance criteria:**
- [ ] Hero matches the LIVE state captured in ChromeReview_v1 (background image, translucent overlay, 3 CTAs: Find Us outline, Menu outline, Order Now filled)
- [ ] H1 is exactly `made from scratch with love` (lowercase, with the line break preserved as in the source)
- [ ] Subhead pulled verbatim from `../01_html/homepage.html`
- [ ] Order Now opens LocationPickerModal in `mode="order"`
- [ ] Below hero: 3-up section "serving great food for now or for later" on red bg with cream text
- [ ] `#locations` anchor section renders LocationGrid
- [ ] Organization JSON-LD added to `<head>`
- [ ] Homepage hero image uses `next/image` with `priority`
- [ ] No console errors in dev
- [ ] Lighthouse mobile: Perf >= 90, A11y >= 95, BP >= 95, SEO = 100

---

## T-04 - Location detail pages `/location/[slug]/`

**Acceptance criteria:**
- [ ] Static params for all 4 slugs (st-louis-park, shady-oak, saint-paul, woodbury)
- [ ] Each page renders: H1 (location name lowercase), address, phone (tel: linked), hours, Order Online button (filled red), Maps iframe with `title="Map: yum! {short_name}"`, `loading="lazy"`
- [ ] Restaurant JSON-LD via `entityJsonLd()` from `lib/locations.ts`
- [ ] JSON-LD validates on Google Rich Results Test
- [ ] Slug must match the original WordPress URLs exactly

---

## T-05 - Menu page `/menu/`

**Acceptance criteria:**
- [ ] Renders all 102 items from `lib/menu.ts` (seeded from `lib/menu-seed.json`)
- [ ] Sticky anchor nav: Lunch & Dinner / Breakfast / Bakery / Catering / Gluten & Allergens / Printable Menu
- [ ] PDF links (Takeout, GF/Allergy) open in new tab with `rel="noopener noreferrer"`
- [ ] Section H2s and item H3s match source
- [ ] Hero H1: `fresh and friendly food`
- [ ] Optional: dietary filter UI (defaults to "all", filter state in URL `?diet=gf`). Mark `[ ]` if shipped, otherwise document as deferred.

---

## T-06 - Catering, About, Careers, In the News, Accessibility pages

**Acceptance criteria:**
- [ ] `/catering/` matches the live hero (background image, "Call Us" CTA opens LocationPickerModal in `mode="call"`)
- [ ] `/about/` includes founders bio (Patti and Robbie Soskin), location leaders section
- [ ] `/careers/` includes hiring copy + general application form embed (Resend route)
- [ ] `/in-the-news/` renders 22 press hits as `<h2>` (NOT `<h1>` - the original WordPress site bug must not be replicated). External links open in new tab with `rel="noopener noreferrer"`.
- [ ] `/accessibility-statement/` renders the statement copy + feedback form (route to `info@yumkitchen.com`)
- [ ] Each page has unique title, meta description, OG image

---

## T-07 - Forms (Contact, Cake, Careers, Accessibility)

**Acceptance criteria:**
- [ ] All four forms use React Hook Form + Zod validation
- [ ] Server actions or `app/api/{form}/route.ts` post to Resend
- [ ] Each form has visible `<label>` elements paired to inputs
- [ ] Required field validation works client-side AND server-side
- [ ] Success state shows a real thank-you message (not a flash)
- [ ] Error state shows the actual error (not "something went wrong")
- [ ] reCAPTCHA or alternative spam protection wired up
- [ ] Test submission delivers to `info@yumkitchen.com`

---

## T-08 - `/order-a-cake/` page

**Acceptance criteria:**
- [ ] H1: `wedding cake order form`
- [ ] Copy verbatim from `../01_html/order-a-cake.html`
- [ ] Form fields per spec (RebuildSpec section 5.8): Name, Email [req], Phone, Date of Event [req], Pickup Location [req] dropdown, Type of Event, Guests, Description, reCAPTCHA
- [ ] 4-6 cake photo gallery above the form (Improvement B6)
- [ ] Routes submissions to the picked-up-location's email if available, else `info@yumkitchen.com`

---

## T-09 - Tracking + analytics

**Acceptance criteria:**
- [ ] GTM container `GTM-P9584HPC` installed in `app/layout.tsx`
- [ ] GA4 `G-2QEQHR7D75` fires page_view
- [ ] FB Pixel `8617229911638112` and Google Ads `AW-16625818121` fire from GTM
- [ ] Custom events: `click_order_online`, `click_call_location`, `submit_contact_form`, `submit_wedding_cake_form`, `submit_careers_form`, `click_gift_card_buy`, `click_gift_card_balance`
- [ ] UA legacy `UA-83446946-1` is NOT loaded (must be removed)
- [ ] CallRail script lazy-loads after first user interaction

---

## T-10 - Performance + a11y final pass

**Acceptance criteria:**
- [ ] All images via `next/image` (only above-the-fold uses `priority`)
- [ ] All iframes have `title`, `loading="lazy"`
- [ ] axe-core run produces ZERO serious or critical violations across all pages
- [ ] Lighthouse mobile: Perf >= 90, A11y >= 95, BP >= 95, SEO = 100 on every page
- [ ] No console errors on mobile Safari + Chrome
- [ ] Color contrast passes WCAG AA (use `bg-brand-primary-darker` on hover, font-weight 700 on filled buttons)

---

## T-11 - Sitemap, robots, OG images

**Acceptance criteria:**
- [ ] `app/sitemap.ts` generates the sitemap with all canonical URLs matching the original Yoast sitemap
- [ ] `public/robots.txt` allows all, references sitemap
- [ ] Per-page OG images (homepage = current Yum_2175.jpg, menu = a menu-themed image, etc.)
- [ ] Twitter card metadata on every page
- [ ] Canonical URLs set per page

---

## T-12 - Cutover preparation

**Acceptance criteria:**
- [ ] All 4 Toast URLs tested live (no 404s)
- [ ] All forms send to `info@yumkitchen.com` via Resend (test from 3 different IPs)
- [ ] DNS cutover runbook in `docs/DEPLOYMENT.md`
- [ ] 301 redirect map generated (if any URLs changed)
- [ ] GSC sitemap submission instructions
- [ ] First-week monitoring checklist (Core Web Vitals, GA4 conversions)

---

## Verification on every PR

Each PR must pass `bash verify.sh` which runs:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run a11y`
- `npm run lh` (key pages only)
- em dash check
