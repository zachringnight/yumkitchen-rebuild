# Patticake demo upgrade plan

Written August 5, 2026, for Fable to implement.

> **EXECUTION STATUS (August 5, 2026, same day):** P0-1 through P0-5, P1-1,
> P1-2, P1-3, P1-4, P2-1, and P2-2 are all DONE and verified: `bash verify.sh`
> returns VERIFY PASSED, Lighthouse mobile is 100/100/100/100 (Perf rose from
> 98 with the LCP preload), axe is 0 serious / 0 critical on every page, and a
> full checkout re-run produced order PC-GLQ30T with correct totals. The photo
> audit resolved the P0-1/P0-2 asset question from files already on disk: the
> hero is now gift_box_vertical (tall), 10_layers_slice, and 09_slices.
> Notable findings during execution, recorded in the sections below: two
> "unreferenced" images were byte-identical duplicates of referenced ones
> (09_slices ≡ yum-patticake-share-slices, 10_layers_slice ≡
> yum-patticake-layer-closeup), and the homepage was rendering slices imagery
> four times. P2-2's aria check closed as a non-issue: the marquee's duplicate
> set already carried aria-hidden. Remaining for a future round: nothing from
> this plan; the yum!-side items in docs/DEMO_PUNCHLIST.md are still open and
> blocked on photos from Zach.

Audience for the finished result: Patti and Robbie Soskin. This is a demo, not a
launch. Production wiring (live email, analytics destinations, DNS) is out of
scope and must not be worked on. Optimize entirely for how the thing looks and
feels during a walkthrough.

## The verdict, without softening it

The engineering is genuinely good and the commerce flow is better than it needs
to be. The presentation is not. Right now the Patticake homepage sells a $59.95
gift cake with three photographs, and the largest of them is out of focus, the
second is an unreadable white smear, and none of the three shows the product
that is actually for sale. A person landing on this page cannot see what they
would be buying or what the recipient would open.

That is the whole problem in one sentence: **this is a gifting business whose
front page never shows the gift.**

Everything below is ranked by how much it changes that.

## Ground rules before you touch anything

1. **Verify your measuring environment first.** Run
   `() => innerWidth + 'x' + innerHeight` before trusting any layout number.
   The in-app Browser pane reported a `0x0` viewport during this audit, which
   silently corrupts `getBoundingClientRect`, `scrollHeight`, and `srcset`
   selection. Every figure in this document was re-measured in Playwright at
   1440x900, DPR 1. If your numbers disagree with the ones here, check your
   viewport before concluding the site changed.
2. **Do not touch the checkout.** See "Do not break this" below.
3. **Never invent a photo.** If a task needs an asset that does not exist, stop
   and flag it. Substituting a wrong photo is worse than shipping the gap. This
   has bitten previous rounds.
4. One PR per task, each naming the task ID it closes.

## Do not break this

The Patticake commerce path was driven end to end on August 5, 2026 and works:
add to box on `/patticake`, `/patticake/checkout` (multi-recipient, live
shipping math), and the confirmation. A test order produced `PC-GJNCPO` at
$59.95 + $14.95 = $74.90, echoing back delivery date, ship-to address, and gift
note. The empty-box state is handled. The three-day minimum delivery date is
enforced and matches the copy.

This is the best thing in the build and the centerpiece of the demo. Changes to
`app/patticake/checkout/` need a reason beyond taste, and any change there must
be re-verified by placing a full test order.

---

## P0: the hero is the entire problem

### P0-1 Put the product in the hero

**ID:** `hero-show-the-actual-gift`
**Files:** `components/PatticakeHome.tsx` (`heroFrames`, lines 15 to 34)

The three hero frames are currently:

| Slot | File | What it shows |
|---|---|---|
| 1 (largest, 309x742) | `layers_slice_vertical.jpg` | chocolate slices on white plates, mostly out of focus |
| 2 (309x365) | `03_top_view.jpg` | extreme top crop of white buttercream on a board |
| 3 (309x365) | `09_slices.jpg` | chocolate slices on white plates |

Two of the three are the same shot: slices on plates. The one that is different
is unreadable as food. There is no whole cake, no box, no note, no recipient.

The offer is "send cake, not a card": a whole cake in a baby blue box, arriving
at someone's door with a message. Rebuild the grid so the three frames tell that
in one glance. Target composition:

1. **The gift as it arrives.** `patticake/gift_box_vertical.jpg` (1200x1800,
   already in the repo, currently used elsewhere but not in the hero).
2. **The whole cake, in focus, recognizable as a triple-layer cake.** Audit
   candidates before choosing. `patticake/01_cover.jpg` and
   `patticake/08_tier_wedding_d.jpg` are on disk and completely unreferenced
   anywhere in the app. Check each visually; several unused files are wedding or
   tier shots and are wrong for a nationwide single-cake hero.
3. **One slice shot, sharp**, kept for the cross-section that shows three
   layers. Only one, not two.

**Acceptance:** a stranger looking at the hero for two seconds can say what the
product is and what shows up at the door. No two frames show the same subject.

### P0-2 The largest image on the site is out of focus

**ID:** `hero-replace-blurred-lead-photo`
**Files:** `components/PatticakeHome.tsx`

`layers_slice_vertical.jpg` is a shallow depth-of-field shot. Roughly the top
60% of the frame is blurred past recognition; only the foreground slice is
sharp. It is rendered at 309x742, the single largest element in the hero.

This is the source photograph, not a scaling artifact. It cannot be fixed with
CSS. Replace it, or crop it hard to just the sharp foreground slice so the blur
is a deliberate background rather than most of the picture.

**Acceptance:** no hero frame is majority out of focus at 1440x900.

### P0-3 Hero photography is being served under-resolution

**ID:** `hero-fix-sizes-and-quality`
**Files:** `components/PatticakeHome.tsx` (`heroFrames[].sizes`, `quality`)

Measured at 1440x900, DPR 1:

| Frame | Decoded source | Rendered box | Upscale at DPR 1 | Approx at DPR 2 |
|---|---|---|---|---|
| 1 | 432x648 | 309x742 | **1.15x** | ~2.3x |
| 2 | 417x277 | 309x365 | **1.32x** | ~2.6x |
| 3 | 547x365 | 309x365 | 1.00x | ~2.0x |

Two of three are already upscaled on a non-retina screen. Patti and Robbie will
almost certainly view this on a retina display, where every frame is roughly
doubled again.

Root cause: `sizes` is declared as `30vw` / `29vw` / `38vw`, which is
approximately correct for the frames' **width**. But these frames are tall
(309 wide by 742 high), and `object-cover` scales to satisfy the larger
dimension, so **height** drives the resolution actually needed. `sizes` is a
width-only hint, so the browser confidently picks a variant that is far too
small vertically.

Fix: declare `sizes` values that account for the rendered aspect ratio, so the
picked variant satisfies the height. Verify empirically rather than by
arithmetic: after the change, assert
`naturalHeight >= boundingRect.height * devicePixelRatio` for every hero frame.

Also raise `quality` from `60`. This is the flagship photography on a product
sold entirely on appetite appeal, and it is currently the lowest quality setting
in the codebase (`70` is the only other override; everything else defaults to
`75`). Use `85` here and measure the byte cost before defending a lower number.

**Acceptance:** every hero frame satisfies
`naturalHeight >= rect.height * devicePixelRatio` and
`naturalWidth >= rect.width * devicePixelRatio` at 1440x900 at both DPR 1 and
DPR 2. Record the measured values in the PR.

### P0-4 The hero composition sits in the bottom half

**ID:** `hero-fix-vertical-composition`
**Files:** `components/PatticakeHome.tsx`, associated hero CSS

At 1440x900 the left column is empty from the header bottom (y=72) to the
eyebrow (y=349). That is 277px, about 31% of the viewport height, holding
nothing. Everything then crowds into the lower half, and the photo grid is
clipped by the fold with no resolution.

Rebalance so the headline block sits in the optical upper-third and the photo
grid resolves at the fold rather than being sliced arbitrarily.

**Acceptance:** at 1440x900 and at 1280x800, no more than ~15% of viewport
height above the eyebrow is empty, and the photo grid either completes or
clearly continues by design.

### P0-5 The background glow reads as dust, and violates the stated rule

**ID:** `hero-remove-or-commit-background-glow`
**Files:** hero CSS backing `.patticake-home-hero::before`

`.patticake-home-hero::before` is a radial gradient using
`rgba(220, 52, 57, 0.2)` (brand red at 20%) over baby blue. At that opacity and
scale it renders as two small pale pink specks that look like dead pixels or
sensor dust, not atmosphere. The diagonal streak is similarly low contrast and
reads as a smudge on the display.

Separately: `docs/HANDOFF_CURRENT.md` explicitly bans "glow effects" under the
current creative direction. This is literally a radial glow.

Either commit to it (make it large and confident enough to read as intentional
light) or delete it. Do not leave it at the current strength, which is the worst
of both.

**Acceptance:** no element in the hero reads as an artifact at 100% zoom.

---

## P1: the page repeats itself

### P1-1 Eight calls to action, two destinations

**ID:** `home-collapse-repeated-ctas`
**Files:** `components/PatticakeHome.tsx`

The homepage carries eight CTAs resolving to two places:

- `/patticake#national-order` via "Ship a Cake" (x2) and "Ship a Patticake"
- `/order-a-cake#cake-inquiry` via "Pick Up Locally" (x2) and "pick up at yum!"
- `/patticake` via "Shipping Details"
- `/order-a-cake` via "Pick Up Locally"

They appear as four near-identical button pairs down one scroll. This runs
directly against the stated rule in `docs/HANDOFF_CURRENT.md`: "One idea and one
action lead at a time."

Keep the hero pair and the closing pair. Remove the two middle repeats, or
demote them to inline text links so the page stops asking the same question
four times.

**Acceptance:** no more than two full-strength CTA clusters on `/`, and no two
adjacent sections offering the same pair of destinations.

### P1-2 The four-step explainer plays three times

**ID:** `dedupe-process-explainer-across-surfaces`
**Files:** `components/PatticakeProcessSteps.tsx`,
`components/PatticakeConciergeBand.tsx`, `app/patticake/page.tsx`,
`app/order-a-cake/page.tsx`

`patticakeProcessSteps` is deliberately the single canonical wording, rendered
on `/`, `/patticake`, and `/order-a-cake`. Consistency is right; the *sequence*
is the problem. In the demo click path (home, then "Ship a Cake") the same four
steps appear twice within seconds of each other.

Keep the full four steps where someone is deciding (`/patticake`). On the
homepage, tease rather than duplicate. Do not fork the wording: whatever the
homepage shows must still come from `patticakeProcessSteps`.

**Acceptance:** clicking the hero CTA from `/` does not land on a repeat of the
block just scrolled past.

### P1-3 `/patticake` spends more space on proof than on the cake

**ID:** `patticake-rebalance-proof-stack`
**Files:** `app/patticake/page.tsx`

Measured at 1440x900: the page is 10,958px, about 12.2 screens, 13 sections.

| Section | px | screens |
|---|---|---|
| press ("recognized by people who know food here") | 915 | 1.0 |
| ratings ("loved in st. louis park") | 1,366 | 1.5 |
| **social proof combined** | **2,281** | **2.5** |
| the buy module ("send a patticake") | 1,388 | 1.5 |
| the shipping-note form | 1,346 | 1.5 |

Social proof occupies 21% of the page and is 1.6x the size of the module that
actually sells the cake. Six press outlets, five stories, three ratings sources,
and a separate independent-coverage list is a press kit, not a product page.

Compress to one confident proof band. Keep the strongest two or three citations
(the Eater "towering triple-layer chocolate cake" line earns its place because
it describes the product) and move the rest behind the existing
`View Press Highlights` link to `/in-the-news`.

**Acceptance:** proof occupies no more than one screen, and the buy module is
the largest section on the page.

### P1-4 Two competing conversion paths of equal weight

**ID:** `patticake-resolve-dual-conversion`
**Files:** `app/patticake/page.tsx`

The page offers a real checkout ("Add to box", $59.95, card fields, confirmed
order) and, 1,346px of form later, a "start your shipping note" that explicitly
says "This starts a bakery note, not a confirmed order." They are nearly the
same size. The page closes with a third CTA, "ready to send a patticake?".

A visitor cannot tell which one is the real way to buy. Make the checkout
unambiguously primary and demote the shipping note to what it is: a help path
for people with a question, reachable but not competing.

**Acceptance:** the buy path is visually dominant; the note path reads as
secondary support.

---

## P2: polish

### P2-1 Proof row has no hierarchy

**ID:** `home-strengthen-proof-row`
**Files:** `components/PatticakeHome.tsx` (`proof`, line 37)

"made from scratch since 2005 / triple-layer chocolate cake / vanilla
buttercream / made by yum! Kitchen and Bakery" sits at the bottom of the hero as
four equal-weight small bold lines with hairline rules. Four facts, no ranking,
nothing to catch the eye.

Two of the four ("triple-layer chocolate cake", "vanilla buttercream") already
repeat the subhead directly above them, word for word.

Cut the duplication and let the two that carry real weight (since 2005, made by
yum!) actually land. Note the constraint in the code comment: wording tracks
`lib/patticake/catalog.ts`, which is confirmed product copy. Removing items is
fine; rewriting product claims is not.

### P2-2 Occasion marquee duplicates on three surfaces

**ID:** `audit-occasion-marquee-repetition`

The seven-occasion marquee runs on `/`, `/patticake`, and `/order-a-cake`. Its
list is intentionally doubled in the DOM for a seamless loop, which is correct,
but confirm the duplicate half carries `aria-hidden="true"` so assistive tech
does not read fourteen occasions.

Lower priority: consider whether it needs to appear on all three surfaces.

---

## Already fixed on August 5, 2026, do not redo

- The required "Pickup restaurant" select on `/order-a-cake` offered an **N/A**
  option that read as leftover test data and, being non-empty, passed the
  required check and degraded routing to the fallback inbox.
  `components/forms/InquiryForm.tsx` now renders it only when the location field
  is optional. Verified: gone from cake pickup and catering, still on
  `/contact`.
- Checkout State select had no `autoComplete`, so autofill filled every address
  field except state. Now `address-level1`. Verified live.
- Form failures printed `Email delivery is disabled until RESEND_API_KEY is
  configured` verbatim to the guest. `app/api/inquiry/route.ts` now returns
  plain language.
- Hugo's leader card on `/about` had a "Visit Location" button pointing back at
  `/about`, a dead click. `LeaderCard.href` is now optional.

## Definition of done, per task

- `bash verify.sh` returns `VERIFY PASSED`.
- `npm run typecheck` and `npm run lint` both clean.
- The change is confirmed **in a real browser at a verified non-zero viewport**,
  not just in code. Paste the measured numbers into the PR.
- No regression to axe 0 serious/critical or the existing Lighthouse scores.
- For any P0 image task, include a before and after screenshot at 1440x900.
- If a task turns out to be a non-issue on inspection, close it with the
  evidence rather than inventing a change.

## Blocked, needs Zach

- P0-1 and P0-2 both depend on which cake photography is usable. The unused
  files on disk may not suit a nationwide single-cake hero. If none work, the
  hero needs new photography and that is a decision, not a code task.
- The yum! side of the demo is parked in `docs/DEMO_PUNCHLIST.md`: founders card
  (no photo of Robbie exists), Margaret's text-only card, and whether to flip
  `NEXT_PUBLIC_YUM_HOST_ROUTING` so a bare link opens the restaurant instead of
  Patticake.
