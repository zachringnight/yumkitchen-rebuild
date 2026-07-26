# Live Verification of the Two Unconfirmed P0 Risks

Date: 2026-07-26. Verifier: Claude (Opus 5), live browser session against the local dev server.

The 2026-07-24 audit and its second-opinion review both flagged two items that had only ever been seen in static screenshots, never confirmed against a running site. The finalized punch list made both P0 with the explicit instruction "verify this live in a real browser first." This document records that verification.

**Result: both risks are resolved as capture artifacts. Neither is a real bug. Both P0 tasks are closed without code changes.**

## Method

- Local dev server (`next dev`, port 3010), the same build the original audit browsed.
- Playwright (`browser_navigate` / `browser_evaluate` / `browser_take_screenshot`), desktop 1280x720 and mobile 390x844.
- Judgments come from **computed styles read out of the live DOM**, not from screenshots. Screenshots were used only as confirming evidence after the DOM already showed the expected state, which is the reverse of the original audit's order and the reason it reached a different conclusion.

## Finding 1: the final CTA reveal works correctly

**Claim under test:** the closing CTA on `/patticake` ("ready to send a patticake?") and `/order-a-cake` ("ready to make someone's day?") renders as an empty solid-red slab, so real visitors may never see the closing conversion CTA.

**Verdict: false. The CTA reveals correctly on both pages.**

`components/motion/Reveal.tsx` starts its children at `initial={{opacity: 0, y: 24}}` and animates to `{opacity: 1, y: 0}` when Framer Motion's `whileInView` observer fires. Measured on both pages, before and after scrolling the section into view:

| Page | Before (out of view) | After (in view, +2s) |
|---|---|---|
| `/patticake` | `opacity: 0`, `transform: matrix(1, 0, 0, 1, 0, 24)` | `opacity: 1`, `transform: none` |
| `/order-a-cake` | `opacity: 0`, `transform: matrix(1, 0, 0, 1, 0, 24)` | `opacity: 1`, `transform: none` |

Both CTA buttons measured `opacity: 1`. Element screenshots taken after the reveal completed show the full content, "ready to send a patticake?" with its Ship a Cake button, and "ready to make someone's day?" with Pick Up Locally / Ship a Cake. Saved as `screenshots/VERIFIED-2026-07-26-cta-patticake.png` and `screenshots/VERIFIED-2026-07-26-cta-order-a-cake.png` (screenshots stay local per the repo's QA-evidence convention).

**Root cause of the original empty slabs:** the audit's resize-viewport-to-full-content-height capture technique fires its screenshot before the scroll-triggered reveal animations on the last sections have finished. The elements were mid-animation (still at or near `opacity: 0`) at capture time. This is the same class of blind spot the original report warned about in other people's scripts, applied to its own captures.

## Finding 2: Patticake mobile rendering is clean

**Claim under test:** the audit's mobile screenshots show blank image slots, an entire unrendered section, and two files truncated mid-page, so the Patticake mobile surface may have real lazy-load or reveal bugs.

**Verdict: false. No rendering bugs found.** Swept all three Patticake pages at 390x844, scrolling the full page in 0.8-viewport steps to let every reveal fire, then measuring every `[data-motion-el]` and every `<img>`:

| Page | Page height | Reveal elements | Stuck (opacity < 0.9) | Broken images |
|---|---|---|---|---|
| `/` (Patticake home) | 8,278px | 13 | **0** | **0** of 13 |
| `/patticake` | 24,324px | 37 | **0** | **0** of 18 |
| `/order-a-cake` | 16,703px | 22 | **0** | **0** of 24 |

Footer present and rendered on all three.

One false positive worth recording so it is not re-reported: on `/patticake` mobile, the "built for gifting" and "bakery checked" hero proof chips do measure `opacity: 0`. They are not stuck. Their container carries `hidden sm:grid`, so it is `display: none` below the `sm` breakpoint by design, and the reveal never needs to fire. Any future sweep should exclude elements whose `offsetParent` is null or whose bounding box is zero, as this one did.

## The repo's own QA scripts are clean

The original report suggested checking whether this project's screenshot-based QA scripts share the same reveal-gated blind spot. They do not: `grep -rn "fullPage" yumkitchen-web/scripts/` returns nothing, so neither `audit-visual-motion.mjs` nor `smoke_ui.js` uses `fullPage` captures. No task needed.

## Note for future audit passes

Two capture environments were tried before Playwright. The in-app browser pane reported `prefers-reduced-motion: reduce` and throttled `requestAnimationFrame`, so reveal animations never completed there and the DOM genuinely sat at `opacity: 0`. Read without care, that environment reproduces the "bug" convincingly and falsely. Any future check of animation-gated content should confirm the harness actually runs animation frames before concluding anything from what it sees, and should read computed styles rather than trusting a screenshot.

## Consequences for the punch list

- `verify-patticake-final-cta-reveal`: **closed, no bug, no code change.**
- `verify-patticake-mobile-rendering`: **closed, no bug, no code change.**
- The Patticake mobile surface is now genuinely audited for rendering integrity, which it was not before. Note this does not re-audit its *design* at mobile widths; the second opinion's separate mobile-design findings (for example the hero photo rendering twice within the first screen and a half) stand and remain on the list.
- The audit's capture-methodology caveat is upgraded from a suggestion into a confirmed limitation, recorded above.
