# Patticake design round 4: signature motion layer, run report

Date: 2026-07-14. Branch: `claude/newest-repo-version-731b25`.
Spec: `design.md` (this dir). Plan: `plan.md` (this dir). All 8 tasks executed and committed.

## What shipped

- **Task 1** (`e87b8eb`): `motion` ^12.42.2 installed. `MotionProvider` (LazyMotion + domAnimation +
  strict + MotionConfig reducedMotion="user") mounted site-wide in `SiteShell`. `<noscript>` fallback
  in the root layout resets `[data-motion-el]` styles when JS is off. 4 new motion-audit checks.
- **Task 2** (`4d751e2`): `springs.ts` (`frosting` entrance spring, `snap` feedback spring), `Reveal`
  (viewport spring entrance; `fade={false}` = LCP-safe transform-only; `y={0}` = fade-only),
  `Stagger`/`StaggerItem` (orchestrated grids; `stamp` variant; `hoverLift`). 1 new audit check.
- **Task 3** (`d4eba15`): `TapeTag` (drift-in + settle, then hands off to the CSS `patticake-tag-bob`
  ambient loop via `tape-tag-settled`, keeping the pause button in charge), `PressButton` (hover lift
  + tap squish wrapper), `ParallaxImage` (scroll-linked ±6% drift, reduced-motion aware). CSS: the
  tag bob now requires `.tape-tag-settled`; `.press-wrap` neutralizes the old CSS hover translate.
- **Task 4** (`2364438`): Home choreography. Hero sequence (label → headline rise → copy → CTAs →
  proof stagger), TapeTag landings on the floating messages, collage frames fade in 1-2-3, moment
  cards stagger with hover lift, wedding photo parallax. Before-screenshots captured first. 1 new
  audit check.
- **Task 5** (`28cd96d`): `/patticake` flagship. Hero sequence + TapeTags, cake-facts stagger,
  gift-box parallax, logistics stagger, the ticket set piece ("admit one" stub stamps in, steps 1→4
  draw in), occasions stagger with hover lift, confirmations list stagger, FAQ stagger (kept
  `<details>` semantics), form intro reveal, final CTA press. 1 new audit check.
- **Task 6** (`a4fadd5`): Message-maker showpiece. Words pop onto the cake per-word as you type
  (AnimatePresence, index keys so the word being typed grows in place), "Send These Words" fires a
  liftoff chip that drops toward the form, and the prefilled field pulses on arrival
  (`message-field-pulse`, reduced-motion reset included). Verified end-to-end with a scripted
  puppeteer check on both `/patticake` (gift-message prefill) and `/order-a-cake` (textarea seed).
- **Task 7** (`66aaa36`): `/order-a-cake` gets the full shared vocabulary (hero sequence, TapeTags,
  ticket stamp, path/step/gallery staggers, celebration parallax, PressButtons). Checkout stays calm:
  header reveal, order-summary line stagger, tap feedback on Place order. Nothing else.
- **Task 8** (this commit): full verify gate green, after-screenshots, this report.

## Verify gate (bash verify.sh)

All stages PASS: TypeScript, ESLint, motion governance audit (28 checks), content validation
(slugs, Toast/maps/phones, 102 menu items, assets), production build, em-dash check, UI smoke,
rendered visual/motion audit (36 route/viewport checks, 458 images, reduced-motion routes), link
audit (56 routes/anchors), axe (0 serious/critical on 15 routes), Lighthouse mobile
Perf=100 A11y=100 BP=100 SEO=100.

## Deviations from plan

1. `capture.mjs` resolves puppeteer via `createRequire(process.cwd())` since the script lives
   outside `yumkitchen-web/` (plan assumed plain import).
2. The first after-capture showed below-fold sections at opacity 0: full-page screenshots never
   scroll, so `whileInView` never fired. The capture script now scrolls through the page like a
   reader before capturing. Not a product bug; reveals fire on scroll for real users.
3. The em-dash gate (diff vs main) caught em dashes in the spec/plan docs and in four component
   comments; replaced with commas/hyphens. Product copy was never touched.
4. The plan's audit-count expectations drifted by one (25 vs 26 etc.) after check consolidation;
   final count is 28 checks, all passing.

## Evidence

- `before-{home,patticake,order-a-cake,checkout}-{desktop,mobile}.png`: pre-round state.
- `after-{home,patticake,order-a-cake,checkout}-{desktop,mobile}.png`: post-round, captured after
  scrolling through each page so entrances have fired.
- Message handoff: scripted check passed (word pops render 3 words for "go team maya"; hash moves
  to `#delivery-support` / `#cake-inquiry`; fields prefill; pulse class applied).
