# Patticake design round 4: signature motion layer, design

Date: 2026-07-13. Branch: `claude/newest-repo-version-731b25` (stacked on main `7b78347`).
Brief: "upgrade patticake.com visual design, ui, ux, animations, motion." Prior rounds deliberately
deferred new motion; this round builds the motion identity those rounds left room for.

Decisions made with Zach during brainstorming:
- Ambition: signature motion layer. Brand palette, tokens, copy voice, and layout bones stay.
- Scope: all four Patticake surfaces, `/` (PatticakeHome), `/patticake`, `/patticake/checkout`,
  `/order-a-cake`. Checkout gets the lightest treatment.
- Tech: the `motion` library (`motion/react`, the current name for framer-motion), loaded via
  `LazyMotion` + `domAnimation`.
- Direction: A+B blend, "the message travels" narrative choreography as the backbone, plus
  bakery-physics tactile hovers and presses throughout.
- The motion provider loads site-wide in `SiteShell` (not gated to Patticake surfaces), so future
  rounds can use the primitives on yum! pages. Only Patticake pages get choreography this round.

## Creative direction: the message travels

Round 3 identified the Patticake brand's signature element: the message, taped labels, the
message ribbon, the message maker. This round's motion identity is built around that one idea.
Words and taped labels drift in with spring physics and settle like they've been pressed onto the
cake. Everything else (reveals, hovers, presses) shares one spring vocabulary so the pages feel
like one designed system, not a collection of animations.

## Architecture

### Motion primitives, `yumkitchen-web/components/motion/`

All client components; pages stay server components and pass server-rendered children through.

- `MotionProvider`, `LazyMotion features={domAnimation} strict` + `MotionConfig
  reducedMotion="user"`. Mounted once in `SiteShell`.
- `springs.ts`, two named spring configs used by every primitive:
  - `frosting`: soft, slight overshoot, settles (all entrances),
  - `snap`: quick and tight (hovers, presses, feedback).
- `Reveal`, viewport-triggered spring entrance (`whileInView`, `once`). Props: `direction`
  (default rise), `delay`. Replaces `data-reveal` on Patticake pages.
- `Stagger` / `StaggerItem`, orchestrated child reveals for grids and sequences, 60–80ms gaps.
- `TapeTag`, the signature primitive. A taped label that drifts in, overshoots, and settles with
  a tape-hinge wobble; per-tag rotation offset. After its entrance completes it adds the existing
  CSS ambient-bob class, so the loop phase stays governed by the pause button and the
  reduced-motion reset exactly as today.
- `PressButton`, spring lift on hover (`whileHover`), squish on press (`whileTap`). Wraps
  existing `.btn-primary` / `.btn-secondary` elements without changing their classes.
- `ParallaxImage`, `useScroll` + `useTransform` scroll-linked `y` drift, capped at ~6%.

### Division of responsibility

- CSS keeps what it has: all ambient loops (remotion board, floating bobs, ribbon marquee,
  frosting drift), the `motion-role-*` classes, motion tokens, and the pause-button plumbing
  (`data-motion-paused`). Nothing in `globals.css` that the motion audit checks is removed.
- The `motion` library handles entrances and interactions only, one-shot animations. The pause
  button governs loops; one-shot entrances are out of its jurisdiction by design.

### Governance

`scripts/audit-motion.mjs` gains checks: `SiteShell` mounts `MotionProvider`;
`MotionProvider` sets `reducedMotion="user"` and uses `LazyMotion`/`strict`; `app/patticake/page.tsx`
and `PatticakeHome.tsx` use `Reveal`/`Stagger`; `springs.ts` defines `frosting` and `snap`.
All existing checks keep passing.

## Per-page choreography

### Shared vocabulary (all four pages)
- Section reveals: linear CSS fades upgrade to spring `Reveal` with a gentle rise.
- Card grids: `Stagger` (cake facts, occasions, moments, FAQ cards, order summary lines).
- CTAs: `PressButton` on primary/secondary buttons within Patticake pages.
- Large standalone photos: `ParallaxImage` (marketing pages only).

### Home `/`
- Hero entrance sequence: section label, then the `patticake` headline rising with `frosting`,
  then proof strip and CTA row staggering in.
- The three floating message tags become `TapeTag`s landing one by one, then handing off to the
  existing CSS ambient bob (pause button keeps governing the loop).
- Remotion-board collage frames land in a quick 1-2-3 sequence on load; the board's ambient CSS
  animation is unchanged.
- Moment cards: stagger in; spring hover lift.

### `/patticake` (flagship)
- Hero: headline and copy rise in sequence; "miss you / thank you / go team" tags land as
  `TapeTag`s.
- Ticket band set piece: the "admit one" stub stamps in (scale + slight rotation) as the band
  enters the viewport, then steps 1→4 draw in sequentially.
- Message maker showpiece: each composed word pops onto the cake preview with a `snap` spring
  (per-word `AnimatePresence`); clicking "send these words" animates the message chip lifting off
  toward the form before the existing hash-scroll handoff fires, and the prefilled field gets a
  highlight pulse on arrival (CSS feedback role).
- Occasion cards stagger; the gift-box photo and hero photo get `ParallaxImage`.
- FAQ stays semantically `<details>`; it only gets a stagger reveal. No accordion rebuild.

### `/order-a-cake`
Shared vocabulary only: hero entrance, staggers, `TapeTag` on label moments, hovers, presses.
No bespoke set pieces.

### `/patticake/checkout`
Calm: one gentle page entrance, staggered order-summary lines, `PressButton` on the pay CTA.
No parallax, no tape play.

## Performance

- `LazyMotion` + `domAnimation` + `strict` (only `m.` components) keeps the runtime ~18kb and
  prevents the full runtime from entering the bundle.
- Entrances animate `transform`/`opacity` only. Parallax rides native scroll via `useScroll`.
- LCP protection: hero headline and LCP image render visible immediately; entrance offsets are
  subtle (≤12px rise) and near-full starting opacity on LCP-adjacent elements. Lighthouse stays
  in the verify gate and must not regress.

## Accessibility and failure behavior

- `reducedMotion="user"` disables transform animation globally for reduced-motion users; opacity
  fades remain, matching current CSS behavior.
- Content is server-rendered and visible if JS never runs: initial hidden states are applied
  client-side only, so nothing is hidden behind un-run JavaScript.
- `Reveal` keeps content in the DOM at all times. Focus states untouched.
- The pause button's contract is unchanged: it pauses ambient loops (CSS), including the ambient
  phase of `TapeTag`s.

## Explicitly not done (restraint)

- No palette, token, copy-voice, Toast-URL, or slug changes (family brand rule holds).
- No FAQ accordion rebuild, no page transitions / View Transitions, no scroll-jacking.
- No choreography on yum!-branded pages this round; the provider is merely available to them.

## Verification plan

`bash verify.sh` end-to-end (typecheck, lint, motion audit incl. new checks, content validation,
build, UI smoke, link audit, axe, Lighthouse; `audit:visual-motion` must stay green). Rendered
before/after screenshots, desktop + mobile, all four pages, saved to
`docs/plans/2026-07-13-patticake-motion-round4/`. Manual pass of the message-maker
fly-to-form handoff on both `/patticake` and `/order-a-cake` form targets.
