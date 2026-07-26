# Handoff: Visual/Creative Upgrade Round

Prepared 2026-07-26 for the agent executing the upgrade work. Everything needed to start is either in this file or linked from it. Read this file, then `AGENTS.md`, then the current round in `tasks.md`, before touching anything.

## Mission

Execute the finalized visual/creative punch list in `tasks.md` under "Current round: visual/creative audit fixes (2026-07-24)": **5 P0, 10 P1, 6 P2**. Two additional P0s were already run and closed as non-bugs (see "Do not redo" below).

## Source-of-truth documents, in reading order

1. `AGENTS.md` - the repo contract. Non-negotiable. Note especially the brand token block (`yumkitchen-web/app/globals.css` `@theme` wins over all docs), the hard rules (Toast URLs, location slugs, JSON-LD), and the no-em-dash rule.
2. `tasks.md`, current round only - **the authoritative task list.** Lower sections are historical; do not pull work from them.
3. `docs/history/qa/2026-07-24-visual-creative-audit/audit-report.md` - the original audit. Useful for per-page context, but two of its specific claims are wrong (corrected below and in tasks.md). Do not treat it as final.
4. `docs/history/qa/2026-07-24-visual-creative-audit/fable-second-opinion.md` - the adversarial review that corrected the audit. **Where the two disagree, this one wins.**
5. `docs/history/qa/2026-07-24-visual-creative-audit/2026-07-26-live-verification.md` - live verification of the two unconfirmed risks. Both closed.
6. `docs/DESIGN_TOOLKIT_AI_CODER.md` - required before any new visual/creative work.

## Working agreement

- **One commit per task, one branch for the round.** Superseded 2026-07-26 at Zach's direction: the old one-task-one-PR rule would have produced 21 PRs for this round. `AGENTS.md` hard rule 8 now allows a coherent group in one PR as long as each task stays its own commit. See "Running a round with parallel agents" in `AGENTS.md` for the file-partitioning rules that make concurrent work on one branch safe.
- `bash verify.sh` must return `VERIFY PASSED` before any PR. It runs typecheck, lint, build, axe a11y, Lighthouse on key pages, and an em-dash check.
- Current baseline to preserve: axe 0/0, Lighthouse 100/100/100/100. Do not regress these.
- Screenshots and QA evidence stay local (already gitignored); reports stay versioned.
- Do not modify `audit-report.md` or `fable-second-opinion.md`. They are historical evidence records.

## Do not redo: already verified, closed, no code change needed

Both were run live against the dev server on 2026-07-26 and came back clean. Re-investigating them wastes a full session.

| Closed item | Finding |
|---|---|
| `verify-patticake-final-cta-reveal` | The closing CTA reveals correctly on `/patticake` and `/order-a-cake`. Measured `opacity: 0 → 1`, `translateY(24px) → none` on scroll into view. |
| `verify-patticake-mobile-rendering` | All three Patticake pages clean at 390x844: zero stuck reveals across 72 reveal elements, zero broken images across 55 images, footer present. |

Root cause of both false alarms: the audit's resize-to-full-height screenshot technique captures before scroll-triggered reveals finish. **If you take screenshots for verification, scroll the element into view and read computed styles to confirm state before trusting the image.** The repo's own QA scripts do not use `fullPage` and do not share this flaw.

Also already corrected in the task list, do not re-add: Patticake home does **not** have five blue sections in a row (it alternates blue/white/blue/white/cream, pixel-verified), and the `/catering` hero has **no** stray red badge (it is the yum! sticker printed on the takeout box inside the photograph).

## Asset inventory: the photo-recycling task is NOT blocked

The top P1 (`break-patticake-photo-recycling`) is the biggest creative win in the round, and there is more source material sitting unused in the repo than is currently in rotation. Verified 2026-07-26 by cross-referencing every cake image on disk against every reference in `app/`, `components/`, `lib/`.

**Currently in rotation (14 images, heavily skewed - this is the recycling problem):**

| Image | References |
|---|---|
| `patticake/03_top_view.jpg` | 10 |
| `patticake/gift_box_vertical.jpg` | 7 |
| `patticake/09_slices.jpg` | 6 |
| `patticake/layers_slice_vertical.jpg` | 6 |
| `patticake/02_tier_wedding_a.jpg`, `06_8inch_a.jpg`, `yum-patticake-slices.jpg` | 3 each |
| `patticake/05_tier_wedding_c.jpg`, `07_8inch_b.jpg`, `slices_plates_vertical.jpg`, `yum-patticake-slice-togo.jpeg` | 2 each |
| `patticake/04_tier_wedding_b.jpg`, `10_layers_slice.jpg`, `09_slices_mobile_lcp.webp` | 1 each |

**Available and completely unreferenced (11 images):**

```
/images/yum-patticake-floral-tier.jpg
/images/yum-patticake-layers.jpg
/images/yum-patticake-tier.jpg
/images/yum-patticake-top.jpg
/images/yum-patticake-just-married.jpeg
/images/yum-patticake-layer-closeup.jpeg
/images/yum-patticake-share-slices.jpeg
/images/yum-patticake-top-view.jpeg
/images/yum-patticake-wedding-detail.jpeg
/images/patticake/01_cover.jpg
/images/patticake/08_tier_wedding_d.jpg
```

So `break-patticake-photo-recycling` and `fix-occasion-photo-mismatches` can both be done today by swapping in real alternatives, rather than by deleting sections. Prefer swapping over deleting where a good unused photo fits. Check each candidate visually before using it; several unused ones are wedding/tier shots and are only appropriate for wedding or celebration contexts, which is exactly the mismatch problem you are fixing, so do not trade one mislabel for another.

## Blocked or gated: needs Zach, do not guess

Do these last, or park them and report. Do **not** invent content or substitute a wrong photo to close a task.

1. **`fix-about-leader-and-founder-photos` - HARD BLOCKED on assets.** There is no photo of Margaret anywhere in the repo, and no labeled photo of founders Patti and Robbie Soskin. Today `lib/site.ts:371` illustrates Margaret ("Woodbury hospitality lead") with `/images/yum-patti-kelli.jpeg`, whose own filename says it depicts Patti and Kelli. The same file is reused six ways, including `lib/site.ts:129` as the about-page OG image. **Options if no new photo arrives: relabel the card honestly, or drop the photo and run the card text-only. Do not silently swap in another staff photo.** Flag for Zach either way.
2. **`fix-accessibility-statement-content` - needs Zach's sign-off before merge.** Writing a conformance claim (WCAG level, what has been done, response-time commitment) is a factual and liability statement about the business, not copywriting. Draft it, cite what the codebase genuinely supports (axe 0 violations, Lighthouse 100 a11y, keyboard nav), but do not publish a conformance level Zach has not approved.
3. **`fix-careers-hero-watermark` - doable, but confirm the result visually.** `public/images/yum-chef-team.jpg` is 1800x1200 and carries a light-grey "Fabricio" photo-credit watermark. It is referenced twice: `app/careers/page.tsx:22` (hero) and `lib/site.ts:134` (careers OG/social-share image). **Fix the source file itself** - a page-level recrop alone still ships the watermark into link previews. A tight crop or a clean re-export both work; verify at native resolution that the credit is actually gone, and that the crop has not cut into the two chefs or the small red yum! pins on their uniforms, which are a genuine brand detail worth keeping.

## Suggested execution order

1. `fix-careers-hero-watermark` - highest embarrassment per unit of effort, and self-contained.
2. `fix-hero-object-position` - one small component change (`components/Hero.tsx` gains an `objectPosition` prop defaulting to today's `center`), unblocks a P2 later. `/location/st-louis-park` is the real offender; `/about` is mild polish.
3. `dedupe-patticake-repeated-blocks` then `consolidate-patticake-process-explainers` - **in that order, they overlap.** "choose how the cake travels" appears in both tasks; deduping first makes the consolidation smaller.
4. `break-patticake-photo-recycling` and `fix-occasion-photo-mismatches` - use the unused-asset list above.
5. Remaining P1s, then P2s.
6. `fix-accessibility-statement-content` whenever Zach can review the draft.

## Definition of done, per task

- `bash verify.sh` returns `VERIFY PASSED`.
- The specific finding is confirmed fixed **in a real browser**, not just in code. For anything animation-gated, scroll it into view and read computed styles.
- No regression to axe 0/0 or Lighthouse 100/100/100/100.
- One PR, scoped to one task, with a description naming the finding it closes and which document it came from.
- If a task turns out to be a non-issue on inspection (it has happened twice already this round), close it with the evidence rather than inventing a change.
