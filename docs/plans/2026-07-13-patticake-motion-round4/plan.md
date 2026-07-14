# Patticake Signature Motion Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "message travels" motion identity across all four Patticake surfaces (`/`, `/patticake`, `/patticake/checkout`, `/order-a-cake`) using the `motion` library, per the approved spec at `docs/plans/2026-07-13-patticake-motion-round4/design.md`.

**Architecture:** A site-wide `MotionProvider` (`LazyMotion` + `domAnimation` + `strict` + `MotionConfig reducedMotion="user"`) mounts in `SiteShell`. Reusable client primitives in `yumkitchen-web/components/motion/` (`Reveal`, `Stagger`/`StaggerItem`, `TapeTag`, `PressButton`, `ParallaxImage`) wrap server-rendered children, no page converts to a client component. CSS keeps all ambient loops and the pause-button plumbing; Motion handles entrances and interactions only.

**Tech Stack:** Next 16 (app router), React 19, Tailwind 4, `motion` ^12 (`motion/react`, `m.` components only), existing verify gate (`verify.sh`).

## Global Constraints

- No palette, token, copy-voice, Toast-URL, or slug changes. No new colors, reuse existing `--color-*` vars / Tailwind utilities.
- Repo root for all paths below: `yumkitchen-web/` unless prefixed otherwise. Run all npm commands from `yumkitchen-web/`.
- Only `m.` components (never `motion.`), the provider uses `strict` and `motion.` will throw.
- Never animate `opacity` on LCP-critical elements: page `h1`s animate transform only (`fade={false}`); hero/LCP images are never wrapped in entrance animations.
- Every Motion element that SSRs a hidden/offset initial style must carry `data-motion-el=""` (the layout's `<noscript>` fallback resets those styles when JS is off).
- Existing CSS keyframes, `motion-role-*` classes, motion tokens, and every string `scripts/audit-motion.mjs` currently checks must survive verbatim.
- The rendered audit (`audit:visual-motion`) fails on ANY console warning/error, no hydration mismatches, no framer warnings.
- No changes to `CakeBuyModule.tsx`, `MediaProofBand`, `ReviewsWall`, `PatticakeOriginBand`, `PatticakePathGuide`, `PatticakeConciergeBand`, `PatticakeMessageRibbon`, `PatticakeHeroPeek` (shared/ambient components, out of scope this round).
- The repo has no unit-test runner. The test cycle per task is: `npm run typecheck`, `npm run lint`, `npm run audit:motion` (extended TDD-style where noted), and the full `bash verify.sh` in the final task.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Motion foundation, package, provider, shell mount, no-JS fallback

**Files:**
- Modify: `yumkitchen-web/package.json` (via `npm install motion`)
- Create: `yumkitchen-web/components/motion/MotionProvider.tsx`
- Modify: `yumkitchen-web/components/SiteShell.tsx`
- Modify: `yumkitchen-web/app/layout.tsx` (body, around line 41–45)
- Modify: `yumkitchen-web/scripts/audit-motion.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `MotionProvider({ children: ReactNode })`, mounted once; makes `m.` components and `MotionConfig reducedMotion="user"` available everywhere. The `[data-motion-el]` noscript contract all later primitives rely on.

- [ ] **Step 1: Write the failing audit checks**

In `yumkitchen-web/scripts/audit-motion.mjs`, after the existing `const header = read('components/SiteHeader.tsx');` line add:

```js
const shell = read('components/SiteShell.tsx');
const motionProvider = read('components/motion/MotionProvider.tsx');
const rootLayout = read('app/layout.tsx');
```

Note: `read()` throws on a missing file, so the audit fails immediately until `MotionProvider.tsx` exists, that is the intended red state.

In the `checks` array, after the last entry (`['header dropdown motion role', ...]`), add:

```js
  ['motion provider mounted in shell', shell.includes('<MotionProvider>')],
  ['motion provider lazy + strict', motionProvider.includes('LazyMotion') && motionProvider.includes('strict')],
  ['motion provider honors reduced motion', motionProvider.includes('reducedMotion="user"')],
  ['no-js motion fallback in layout', rootLayout.includes('data-motion-el')],
```

- [ ] **Step 2: Run the audit to verify it fails**

Run: `npm run audit:motion`
Expected: FAIL (throws `ENOENT` for `components/motion/MotionProvider.tsx`)

- [ ] **Step 3: Install motion**

Run: `npm install motion`
Expected: `motion` (^12.x) added to `dependencies` in `package.json`; install succeeds against React 19.

- [ ] **Step 4: Create the provider**

Create `yumkitchen-web/components/motion/MotionProvider.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
```

- [ ] **Step 5: Mount it in SiteShell**

In `yumkitchen-web/components/SiteShell.tsx`, add the import and wrap everything inside `CartProvider`:

```tsx
import { MotionProvider } from './motion/MotionProvider';
```

Change the return to:

```tsx
  return (
    <CartProvider>
      <MotionProvider>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionEnhancer />
        <HashAnchorScroll />
        <PageScrollProgress />
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <RestaurantTaskDock />
        <MobileOrderBar />
        <CartDrawer />
      </MotionProvider>
    </CartProvider>
  );
```

- [ ] **Step 6: Add the no-JS fallback to the root layout**

In `yumkitchen-web/app/layout.tsx`, immediately after the opening `<body ...>` tag (line ~41), add:

```tsx
        <noscript>
          <style>{`[data-motion-el]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
```

- [ ] **Step 7: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint`
Expected: `Motion audit passed: 25 checks.` (21 existing + 4 new), typecheck and lint clean.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(motion): add motion library, site-wide MotionProvider, no-JS fallback

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Core primitives, springs, Reveal, Stagger/StaggerItem

**Files:**
- Create: `yumkitchen-web/components/motion/springs.ts`
- Create: `yumkitchen-web/components/motion/Reveal.tsx`
- Create: `yumkitchen-web/components/motion/Stagger.tsx`
- Modify: `yumkitchen-web/scripts/audit-motion.mjs`

**Interfaces:**
- Consumes: `MotionProvider` context from Task 1 (`m.` components require it).
- Produces:
  - `springs.ts`: `export const frosting: Transition` (soft entrance spring), `export const snap: Transition` (quick feedback spring).
  - `Reveal({ children, className?, id?, as? = 'div' | 'section' | 'figure' | 'h1' | 'p' | 'span', delay? = 0, y? = 24, fade? = true })`, viewport-triggered one-shot spring entrance. `fade={false}` = transform-only (LCP-safe). `y={0}` = fade-only (safe on elements with CSS transform animations).
  - `Stagger({ children, className?, as? = 'div' | 'ul', gap? = 0.07 })` and `StaggerItem({ children, className?, as? = 'div' | 'article' | 'li', variant? = 'rise' | 'stamp', hoverLift? = false })`, orchestrated child reveals. Nested plain divs between `Stagger` and `StaggerItem` are fine (variants propagate through non-motion elements).

- [ ] **Step 1: Write the failing audit check**

In `yumkitchen-web/scripts/audit-motion.mjs`, after `const rootLayout = read('app/layout.tsx');` add:

```js
const springs = read('components/motion/springs.ts');
```

In the `checks` array, after `['no-js motion fallback in layout', ...]`, add:

```js
  ['spring tokens frosting and snap', springs.includes('export const frosting') && springs.includes('export const snap')],
```

Run: `npm run audit:motion`
Expected: FAIL (ENOENT `components/motion/springs.ts`)

- [ ] **Step 2: Create springs.ts**

Create `yumkitchen-web/components/motion/springs.ts`:

```ts
import type { Transition } from 'motion/react';

// Soft entrance with a slight overshoot that settles, like piped buttercream.
export const frosting: Transition = { type: 'spring', stiffness: 220, damping: 26, mass: 1 };

// Quick, tight feedback for hovers, presses, and word pops.
export const snap: Transition = { type: 'spring', stiffness: 480, damping: 32, mass: 0.7 };
```

- [ ] **Step 3: Create Reveal**

Create `yumkitchen-web/components/motion/Reveal.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting } from './springs';

const tags = {
  div: m.div,
  section: m.section,
  figure: m.figure,
  h1: m.h1,
  p: m.p,
  span: m.span,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: keyof typeof tags;
  delay?: number;
  /** Rise distance in px. 0 = fade only (safe on elements with CSS transform animations). */
  y?: number;
  /** false = transform-only entrance (LCP-safe: element paints fully visible). */
  fade?: boolean;
};

export function Reveal({ children, className, id, as = 'div', delay = 0, y = 24, fade = true }: RevealProps) {
  const Tag = tags[as];
  const hidden: Record<string, number> = {};
  const shown: Record<string, number> = {};
  if (fade) {
    hidden.opacity = 0;
    shown.opacity = 1;
  }
  if (y !== 0) {
    hidden.y = y;
    shown.y = 0;
  }
  return (
    <Tag
      id={id}
      className={className}
      data-motion-el=""
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{ ...frosting, delay }}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Create Stagger and StaggerItem**

Create `yumkitchen-web/components/motion/Stagger.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting, snap } from './springs';

const groupTags = { div: m.div, ul: m.ul } as const;
const itemTags = { div: m.div, article: m.article, li: m.li } as const;

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof groupTags;
  gap?: number;
};

export function Stagger({ children, className, as = 'div', gap = 0.07 }: StaggerProps) {
  const Tag = groupTags[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      variants={{ visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof itemTags;
  /** 'stamp' scales down into place with a slight rotation, the ticket-stub entrance. */
  variant?: 'rise' | 'stamp';
  /** Spring hover lift for cards. */
  hoverLift?: boolean;
};

export function StaggerItem({ children, className, as = 'div', variant = 'rise', hoverLift = false }: StaggerItemProps) {
  const Tag = itemTags[as];
  const variants =
    variant === 'stamp'
      ? {
          hidden: { opacity: 0, scale: 1.16, rotate: -6 },
          visible: { opacity: 1, scale: 1, rotate: 0, transition: frosting },
        }
      : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: frosting },
        };
  return (
    <Tag
      className={className}
      data-motion-el=""
      variants={variants}
      whileHover={hoverLift ? { y: -6 } : undefined}
      transition={hoverLift ? snap : undefined}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint`
Expected: `Motion audit passed: 26 checks.`, typecheck and lint clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(motion): spring tokens, Reveal, Stagger primitives

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Tactile primitives, TapeTag, PressButton, ParallaxImage + CSS gating

**Files:**
- Create: `yumkitchen-web/components/motion/TapeTag.tsx`
- Create: `yumkitchen-web/components/motion/PressButton.tsx`
- Create: `yumkitchen-web/components/motion/ParallaxImage.tsx`
- Modify: `yumkitchen-web/app/globals.css` (inside `@media (prefers-reduced-motion: no-preference)`, line ~2689)

**Interfaces:**
- Consumes: `frosting`, `snap` from Task 2.
- Produces:
  - `TapeTag({ children, delay? = 0 })`, renders `m.span`; entrance = drift-in + settle; after entrance it adds class `tape-tag-settled`, which is now REQUIRED for the CSS `patticake-tag-bob` ambient loop.
  - `PressButton({ children, className? })`, renders `m.span.press-wrap.inline-flex` wrapper around an existing CTA element; spring hover lift + tap squish.
  - `ParallaxImage({ children, className? })`, outer `div` (caller MUST include positioning in className, e.g. `relative min-h-[360px] ...` or `absolute inset-0`) + inner `m.div` with scroll-linked y. Children are `next/image` `fill` images (they position against the inner m.div).

- [ ] **Step 1: Confirm the tag-bob selector is only used by elements this round converts**

Run: `grep -rn "cake-message-tags\|patticake-floating-messages" yumkitchen-web/components yumkitchen-web/app --include='*.tsx'`
Expected: exactly three usage sites, `components/PatticakeHome.tsx` (floating-messages), `app/patticake/page.tsx` (cake-message-tags-delivery), `app/order-a-cake/page.tsx` (cake-message-tags). If any other site appears, STOP and flag it.

- [ ] **Step 2: Create TapeTag**

Create `yumkitchen-web/components/motion/TapeTag.tsx`:

```tsx
'use client';

import { useState, type ReactNode } from 'react';
import { m } from 'motion/react';
import { frosting } from './springs';

/**
 * A taped label that drifts in, overshoots, and settles. After the entrance
 * it adds `tape-tag-settled`, which hands the element to the CSS ambient bob
 * (patticake-tag-bob), so the pause button and reduced-motion reset keep
 * governing the loop exactly as before.
 */
export function TapeTag({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [settled, setSettled] = useState(false);
  return (
    <m.span
      className={settled ? 'tape-tag-settled' : undefined}
      data-motion-el=""
      initial={{ opacity: 0, y: -18, scale: 0.92, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...frosting, delay }}
      onAnimationComplete={() => setSettled(true)}
    >
      {children}
    </m.span>
  );
}
```

- [ ] **Step 3: Create PressButton**

Create `yumkitchen-web/components/motion/PressButton.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { snap } from './springs';

/** Wraps an existing CTA (<a>, <Link>, <button>) without changing its classes. */
export function PressButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <m.span
      className={`press-wrap inline-flex ${className}`.trim()}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={snap}
    >
      {children}
    </m.span>
  );
}
```

- [ ] **Step 4: Create ParallaxImage**

Create `yumkitchen-web/components/motion/ParallaxImage.tsx`:

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Subtle scroll-linked drift for large photos, capped at ±6%. The caller's
 * className MUST include positioning (`relative ...` for standalone blocks,
 * `absolute inset-0` when layered inside an existing positioned card).
 * Children are next/image `fill` images, they position against the inner div.
 */
export function ParallaxImage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`.trim()}>
      <m.div className="absolute inset-x-0 -inset-y-[8%]" style={reduce ? undefined : { y }}>
        {children}
      </m.div>
    </div>
  );
}
```

- [ ] **Step 5: Gate the CSS tag bob behind the settled class, neutralize double hover lift**

In `yumkitchen-web/app/globals.css`, inside the `@media (prefers-reduced-motion: no-preference)` block, change:

```css
  .patticake-floating-messages span,
  .cake-message-tags span {
    animation: patticake-tag-bob 6.8s ease-in-out infinite;
  }
```

to:

```css
  .patticake-floating-messages span.tape-tag-settled,
  .cake-message-tags span.tape-tag-settled {
    animation: patticake-tag-bob 6.8s ease-in-out infinite;
  }

  .press-wrap :is(.btn-primary, .btn-secondary):hover {
    transform: none;
  }
```

(The `:nth-child` animation-delay rules just below stay unchanged, they apply whenever the animation is active. The `[data-motion-paused]` and reduced-motion rules keep matching the spans too.)

- [ ] **Step 6: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint && npm run build`
Expected: audit 26 checks pass, typecheck/lint clean, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(motion): TapeTag, PressButton, ParallaxImage primitives + CSS handoff gating

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Before-screenshots + Home page choreography (PatticakeHome)

**Files:**
- Create: `docs/plans/2026-07-13-patticake-motion-round4/capture.mjs` (repo root path)
- Modify: `yumkitchen-web/components/PatticakeHome.tsx`
- Modify: `yumkitchen-web/scripts/audit-motion.mjs`

**Interfaces:**
- Consumes: `Reveal`, `Stagger`, `StaggerItem` (Task 2), `TapeTag`, `PressButton` (Task 3). Import paths from this component: `./motion/Reveal`, `./motion/Stagger`, `./motion/TapeTag`, `./motion/PressButton`.
- Produces: home-page choreography; `before-*.png` screenshots.

- [ ] **Step 1: Create the capture script**

Create `docs/plans/2026-07-13-patticake-motion-round4/capture.mjs` (run from `yumkitchen-web/`):

```js
#!/usr/bin/env node
// Usage (from yumkitchen-web/): node ../docs/plans/2026-07-13-patticake-motion-round4/capture.mjs <prefix>
import puppeteer from 'puppeteer';

const prefix = process.argv[2] ?? 'shot';
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3105';
const outDir = new URL('.', import.meta.url).pathname;
const routes = [
  ['/', 'home'],
  ['/patticake', 'patticake'],
  ['/order-a-cake', 'order-a-cake'],
  ['/patticake/checkout', 'checkout'],
];
const viewports = [
  ['desktop', 1280, 2400],
  ['mobile', 390, 2400],
];

const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
const page = await browser.newPage();
for (const [label, width, height] of viewports) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  for (const [route, name] of routes) {
    await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle0' });
    // let entrance springs finish before capturing
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await page.screenshot({ path: `${outDir}${prefix}-${name}-${label}.png`, fullPage: true });
    console.log(`${prefix}-${name}-${label}.png`);
  }
}
await browser.close();
```

- [ ] **Step 2: Capture the BEFORE state**

From `yumkitchen-web/`:

```bash
npm run build
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
node ../docs/plans/2026-07-13-patticake-motion-round4/capture.mjs before
kill $SERVER_PID
```

Expected: 8 files `before-{home,patticake,order-a-cake,checkout}-{desktop,mobile}.png` in the plan dir.

- [ ] **Step 3: Write the failing audit check for the home surface**

In `yumkitchen-web/scripts/audit-motion.mjs`, after `const springs = ...` add:

```js
const patticakeHomeSurface = read('components/PatticakeHome.tsx');
```

In the `checks` array append:

```js
  ['patticake home uses motion primitives', patticakeHomeSurface.includes('<Reveal') && patticakeHomeSurface.includes('<TapeTag')],
```

Run: `npm run audit:motion`, Expected: FAIL on `patticake home uses motion primitives`.

- [ ] **Step 4: Choreograph PatticakeHome**

In `yumkitchen-web/components/PatticakeHome.tsx`, add imports after the existing ones:

```tsx
import { ParallaxImage } from './motion/ParallaxImage';
import { PressButton } from './motion/PressButton';
import { Reveal } from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';
import { TapeTag } from './motion/TapeTag';
```

Apply these exact edits:

**4a, hero label** (line ~74):
```tsx
// old
<p className="section-label">yum! Kitchen and Bakery presents</p>
// new
<Reveal as="p" className="section-label" y={10}>yum! Kitchen and Bakery presents</Reveal>
```

**4b, hero h1** (LCP text, transform only):
```tsx
// old
<h1 className="font-serif text-[clamp(4rem,8vw,7.4rem)] font-normal leading-[0.9] lowercase text-ink">
  patticake
</h1>
// new
<Reveal as="h1" className="font-serif text-[clamp(4rem,8vw,7.4rem)] font-normal leading-[0.9] lowercase text-ink" fade={false} y={14} delay={0.05}>
  patticake
</Reveal>
```

(`PatticakeHeroPeek` right below is the mobile LCP image, leave it untouched.)

**4c, hero intro copy:**
```tsx
// old
<p className="mt-7 max-w-[520px] text-xl leading-9 text-ink">
  Patticake is devil&apos;s food layers, vanilla buttercream, and a message made for the table.
</p>
// new
<Reveal as="p" className="mt-7 max-w-[520px] text-xl leading-9 text-ink" delay={0.12} y={16}>
  Patticake is devil&apos;s food layers, vanilla buttercream, and a message made for the table.
</Reveal>
```

**4d, CTA row:** change the wrapper div to a `Reveal` and wrap each of the three CTAs in `PressButton`:
```tsx
// old wrapper
<div className="mt-8 flex flex-wrap gap-3">
// new wrapper (closing tag becomes </Reveal>)
<Reveal className="mt-8 flex flex-wrap gap-3" delay={0.18} y={14}>
```
Each CTA keeps its exact attributes, wrapped:
```tsx
<PressButton>
  <a
    href={patticakeNationalOrderUrl}
    target={nationalOrderIsExternal ? '_blank' : undefined}
    rel={nationalOrderIsExternal ? 'noopener noreferrer' : undefined}
    className="btn-primary"
    data-event="click_patticake_national_delivery_order"
    data-source="patticake_home_hero"
  >
    Ship a Cake
  </a>
</PressButton>
<PressButton>
  <Link href="/order-a-cake#cake-inquiry" className="btn-secondary">
    Pick Up Locally
  </Link>
</PressButton>
<PressButton>
  <Link href="/yum-kitchen" className="btn-secondary">
    yum! Kitchen and Bakery
  </Link>
</PressButton>
```

**4e, proof strip:**
```tsx
// old
<div className="mt-9 grid gap-3 sm:grid-cols-2">
  {proof.map((item) => (
    <div key={item} className="border-t border-ink/15 pt-3">
      <p className="text-base font-bold leading-6 text-ink">{item}</p>
    </div>
  ))}
</div>
// new
<Stagger className="mt-9 grid gap-3 sm:grid-cols-2" gap={0.06}>
  {proof.map((item) => (
    <StaggerItem key={item} className="border-t border-ink/15 pt-3">
      <p className="text-base font-bold leading-6 text-ink">{item}</p>
    </StaggerItem>
  ))}
</Stagger>
```

**4f, floating message tags** (inside `.patticake-floating-messages`, line ~117):
```tsx
// old
<div className="patticake-floating-messages" aria-hidden="true">
  <span>happy birthday</span>
  <span>thank you</span>
  <span>just because</span>
</div>
// new
<div className="patticake-floating-messages" aria-hidden="true">
  <TapeTag delay={0.5}>happy birthday</TapeTag>
  <TapeTag delay={0.72}>thank you</TapeTag>
  <TapeTag delay={0.94}>just because</TapeTag>
</div>
```

**4g, remotion collage frames** (fade-only so the CSS float animations keep owning transform):
```tsx
// old
{heroFrames.map((frame, index) => (
  <figure key={frame.src} className={`patticake-remotion-frame patticake-remotion-frame-${index + 1}`}>
// new
{heroFrames.map((frame, index) => (
  <Reveal as="figure" key={frame.src} className={`patticake-remotion-frame patticake-remotion-frame-${index + 1}`} y={0} delay={0.15 + index * 0.15}>
```
(closing `</figure>` becomes `</Reveal>`; the inner `<Image>` and `<figcaption>` are unchanged.)

Note: `Reveal` doesn't declare a `key` prop, `key` is a React built-in, this works as-is.

**4h, the two `data-reveal` sections** (lines ~146 and ~186) hand off to Motion:
```tsx
// old
<section className="bg-white px-6 py-12 lg:py-section" data-reveal>
// new
<Reveal as="section" className="bg-white px-6 py-12 lg:py-section">
```
```tsx
// old
<section className="bg-blue-tint px-6 py-12 lg:py-section" data-reveal>
// new
<Reveal as="section" className="bg-blue-tint px-6 py-12 lg:py-section">
```
(matching closing `</section>` tags become `</Reveal>`.)

**4i, moment cards** (line ~158): replace the CSS stagger with Motion:
```tsx
// old
<div className="stagger-reveal mt-10 grid gap-5 md:grid-cols-3">
  {moments.map((moment) => (
    <article key={moment.title} className="patticake-action-card group">
// new
<Stagger className="mt-10 grid gap-5 md:grid-cols-3">
  {moments.map((moment) => (
    <StaggerItem as="article" key={moment.title} className="patticake-action-card group" hoverLift>
```
(closing `</article>` → `</StaggerItem>`, closing `</div>` → `</Stagger>`.) Wrap each card's CTA:
```tsx
// old
<Link href={moment.href} className="btn-primary mt-6 self-end">
  {moment.action}
</Link>
// new
<PressButton className="mt-6 self-end">
  <Link href={moment.href} className="btn-primary">
    {moment.action}
  </Link>
</PressButton>
```

**4j, "what you get" band buttons** (line ~195): wrap both CTAs in `<PressButton>` the same way (keep their own classes; move no layout classes).

**4k, "what you get" wedding photo parallax** (line ~204):
```tsx
// old
<div className="relative aspect-[4/5] overflow-hidden bg-cream shadow-xl">
  <Image
    src="/images/patticake/02_tier_wedding_a.jpg"
    ...
  />
</div>
// new
<ParallaxImage className="relative aspect-[4/5] bg-cream shadow-xl">
  <Image
    src="/images/patticake/02_tier_wedding_a.jpg"
    ...
  />
</ParallaxImage>
```
(the `<Image>` props are unchanged; `ParallaxImage` supplies `overflow-hidden`.)

- [ ] **Step 5: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint && npm run build`
Expected: audit `27 checks` pass, all clean.

- [ ] **Step 6: Visual sanity pass**

```bash
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
BASE_URL=http://localhost:3105 npm run audit:visual-motion
kill $SERVER_PID
```
Expected: rendered audit passes (no console errors, no overflow, one h1, no broken images).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(patticake): home choreography - hero sequence, tape tags, staggered cards

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: /patticake flagship choreography

**Files:**
- Modify: `yumkitchen-web/app/patticake/page.tsx`
- Modify: `yumkitchen-web/scripts/audit-motion.mjs`

**Interfaces:**
- Consumes: all primitives. Import paths from this file: `@/components/motion/Reveal`, `@/components/motion/Stagger`, `@/components/motion/TapeTag`, `@/components/motion/PressButton`, `@/components/motion/ParallaxImage`.
- Produces: flagship-page choreography including the ticket set piece.

- [ ] **Step 1: Failing audit check**

In `yumkitchen-web/scripts/audit-motion.mjs`, after `const patticakeHomeSurface = ...` add:

```js
const patticakeDelivery = read('app/patticake/page.tsx');
```

Append to `checks`:

```js
  ['patticake delivery page uses motion primitives', patticakeDelivery.includes('<Reveal') && patticakeDelivery.includes('<Stagger') && patticakeDelivery.includes('<TapeTag')],
```

Run: `npm run audit:motion`, Expected: FAIL on the new check.

- [ ] **Step 2: Choreograph the page**

In `yumkitchen-web/app/patticake/page.tsx`, add imports:

```tsx
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { PressButton } from '@/components/motion/PressButton';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { TapeTag } from '@/components/motion/TapeTag';
```

Exact edits:

**2a, hero h1** (transform-only, LCP text):
```tsx
// old
<h1 className="font-serif text-[clamp(3.55rem,7vw,6.7rem)] font-normal leading-[0.9] lowercase text-ink">
  ship a patticake
</h1>
// new
<Reveal as="h1" className="font-serif text-[clamp(3.55rem,7vw,6.7rem)] font-normal leading-[0.9] lowercase text-ink" fade={false} y={14}>
  ship a patticake
</Reveal>
```

**2b, hero copy** (`<p className="mt-7 max-w-xl ...">`) → `<Reveal as="p" ... delay={0.1} y={16}>` (same classes).

**2c, hero CTA row**: `<div className="mt-8 flex flex-wrap gap-3">` → `<Reveal className="mt-8 flex flex-wrap gap-3" delay={0.16} y={14}>`; wrap the `Ship a Cake` anchor and `Pick Up Locally` Link each in `<PressButton>` (attributes unchanged).

**2d, hero notes grid**: `<div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2">` → `<Stagger className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2" gap={0.08}>`; each `<HeroNote .../>` wraps in `<StaggerItem>`:
```tsx
<StaggerItem><HeroNote title="built for gifting" copy="address, date, occasion, and message" /></StaggerItem>
<StaggerItem><HeroNote title="bakery checked" copy="timing, weather, and the best way to send it" /></StaggerItem>
```

**2e, hero card tags** (line ~248; the hero card `<Image>` is `priority` LCP, do NOT animate it):
```tsx
// old
<div className="cake-message-tags cake-message-tags-delivery" aria-hidden="true">
  <span>miss you</span>
  <span>thank you</span>
  <span>go team</span>
</div>
// new
<div className="cake-message-tags cake-message-tags-delivery" aria-hidden="true">
  <TapeTag delay={0.45}>miss you</TapeTag>
  <TapeTag delay={0.67}>thank you</TapeTag>
  <TapeTag delay={0.89}>go team</TapeTag>
</div>
```

**2f, "meet the cake" facts** (line ~276):
```tsx
// old
<div className="mt-10 grid gap-4 md:grid-cols-3">
  {cakeFacts.map((fact) => (
    <article key={fact.title} className="border border-ink/10 bg-page p-6">
// new
<Stagger className="mt-10 grid gap-4 md:grid-cols-3">
  {cakeFacts.map((fact) => (
    <StaggerItem as="article" key={fact.title} className="border border-ink/10 bg-page p-6">
```
(closers: `</article>` → `</StaggerItem>`, `</div>` → `</Stagger>`.) Also wrap the section intro column (`<div className="max-w-2xl">` at line ~269) in place: change that div to `<Reveal className="max-w-2xl">` (closer `</Reveal>`).

**2g, shipping section, gift-box photo parallax** (line ~307):
```tsx
// old
<div className="relative min-h-[360px] overflow-hidden border border-ink/10 bg-blue-soft">
  <Image src="/images/patticake/gift_box_vertical.jpg" ... />
</div>
// new
<ParallaxImage className="relative min-h-[360px] border border-ink/10 bg-blue-soft">
  <Image src="/images/patticake/gift_box_vertical.jpg" ... />
</ParallaxImage>
```
And the logistics grid (line ~316):
```tsx
// old
<div className="delivery-logistics-grid">
  {deliveryFacts.map((fact) => (
    <article key={fact.title}>
// new
<Stagger className="delivery-logistics-grid">
  {deliveryFacts.map((fact) => (
    <StaggerItem as="article" key={fact.title}>
```

**2h, the ticket set piece** (line ~330):
```tsx
// old
<div className="patticake-ticket">
  <div className="patticake-ticket-stub">
    admit one
    <br />
    patticake
  </div>
  <div>
    <h2 ...>a clearer way to send it.</h2>
    <p ...>...</p>
  </div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {steps.map((step) => (
      <article key={step.number} className="border-t border-ink/15 pt-4">
// new
<Stagger className="patticake-ticket" gap={0.12}>
  <StaggerItem variant="stamp" className="patticake-ticket-stub">
    admit one
    <br />
    patticake
  </StaggerItem>
  <StaggerItem>
    <h2 ...>a clearer way to send it.</h2>
    <p ...>...</p>
  </StaggerItem>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {steps.map((step) => (
      <StaggerItem as="article" key={step.number} className="border-t border-ink/15 pt-4">
```
(`h2`/`p` contents unchanged; closers: steps `</article>` → `</StaggerItem>`, outer `</div>` of `.patticake-ticket` → `</Stagger>`. The plain inner grid div stays a div, variants propagate through it, and the flat stagger order is stub → heading → steps 1→4.)

IMPORTANT: `.patticake-ticket` is a CSS grid; `Stagger` renders `m.div` so the class still applies. `.patticake-ticket-stub` becomes `m.div`, verify its CSS has no element-type selector (it doesn't; class-only).

**2i, occasions grid** (line ~366):
```tsx
// old
<div className="mt-10 grid gap-5 md:grid-cols-4">
  {occasions.map((occasion) => (
    <article key={occasion.title} className="patticake-action-card group">
// new
<Stagger className="mt-10 grid gap-5 md:grid-cols-4">
  {occasions.map((occasion) => (
    <StaggerItem as="article" key={occasion.title} className="patticake-action-card group" hoverLift>
```

**2j, "what to have ready" list** (line ~398):
```tsx
// old
<ul className="grid gap-4">
  {confirmations.map((item, index) => (
    <li key={item} className="grid grid-cols-[2rem_1fr] items-start gap-3 border-b border-blue-soft/70 pb-4 last:border-0 last:pb-0">
// new
<Stagger as="ul" className="grid gap-4" gap={0.06}>
  {confirmations.map((item, index) => (
    <StaggerItem as="li" key={item} className="grid grid-cols-[2rem_1fr] items-start gap-3 border-b border-blue-soft/70 pb-4 last:border-0 last:pb-0">
```

**2k, FAQ grid** (line ~421): wrap each `<details>` in a StaggerItem div:
```tsx
// old
<div className="grid gap-3 md:grid-cols-2">
  {faqs.map((faq) => (
    <details key={faq.question} className="group border border-ink/15 bg-white p-5">
// new
<Stagger className="grid gap-3 md:grid-cols-2" gap={0.05}>
  {faqs.map((faq) => (
    <StaggerItem key={faq.question}>
      <details className="group h-full border border-ink/15 bg-white p-5">
```
(add `h-full` to details since it now fills a wrapper; closers: `</details>` then `</StaggerItem>`, outer `</div>` → `</Stagger>`.)

**2l, delivery-support intro column** (line ~437): change `<div>` holding the section-label/h2/p to `<Reveal>` (no class on the original div → `<Reveal>` with no className).

**2m, final CTA band** (line ~460): change the inner grid div to `Reveal` and wrap the CTA:
```tsx
// old
<div className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
// new
<Reveal className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
```
The `Ship a Cake` anchor wraps in `<PressButton>` (all attributes incl. `data-event` unchanged). Note: this anchor's classes are inline (not `.btn-primary`), so its CSS `transition ... hover:bg-blue-tint` color hover still applies, that's fine (color only, no transform conflict).

- [ ] **Step 3: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint && npm run build`
Expected: audit `28 checks` pass, all clean.

- [ ] **Step 4: Rendered check**

```bash
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
BASE_URL=http://localhost:3105 npm run audit:visual-motion
kill $SERVER_PID
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(patticake): flagship page choreography - ticket stamp set piece, tape tags, parallax

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Message-maker showpiece + form arrival pulse

**Files:**
- Modify: `yumkitchen-web/components/PatticakeMessagePreview.tsx`
- Modify: `yumkitchen-web/components/forms/InquiryForm.tsx` (function `revealAndFocusField`, line ~56)
- Modify: `yumkitchen-web/app/globals.css`

**Interfaces:**
- Consumes: `snap` from `./motion/springs`; `m`, `AnimatePresence` from `motion/react`.
- Produces: word-pop preview, liftoff chip on "Send These Words", `.message-field-pulse` CSS class applied by `revealAndFocusField`.

- [ ] **Step 1: Rewrite the preview component**

Replace the full contents of `yumkitchen-web/components/PatticakeMessagePreview.tsx` with:

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { pushAnalyticsEvent } from '@/lib/analytics';
import { CAKE_MESSAGE_EVENT, type CakeMessageDetail } from '@/lib/cakeMessage';
import { MotionPauseButton } from './MotionPauseButton';
import { Reveal } from './motion/Reveal';
import { snap } from './motion/springs';

const quickMessages = ['love you', 'miss you', 'thank you', 'go team', 'happy day', 'congrats'] as const;

type PatticakeMessagePreviewProps = {
  formHref?: string;
};

export function PatticakeMessagePreview({ formHref = '#cake-inquiry' }: PatticakeMessagePreviewProps) {
  const [message, setMessage] = useState('love you');
  const [liftoff, setLiftoff] = useState(0);
  const displayMessage = message.trim() || 'patticake';
  const words = displayMessage.split(/\s+/).filter(Boolean);

  function sendMessageToForm() {
    pushAnalyticsEvent({
      event: 'click_patticake_use_message',
      form_kind: 'cake',
      path: window.location.pathname,
    });
    if (window.location.hash !== formHref) {
      // pushState instead of setting location.hash: the native hash jump (and
      // HashAnchorScroll's retries) would fight the form's own scroll-to-field.
      window.history.pushState(null, '', formHref);
    }
    window.dispatchEvent(
      new CustomEvent<CakeMessageDetail>(CAKE_MESSAGE_EVENT, { detail: { message: displayMessage } }),
    );
  }

  function handleSend() {
    // Let the liftoff chip read for a beat before the scroll handoff fires.
    setLiftoff((count) => count + 1);
    window.setTimeout(sendMessageToForm, 280);
  }

  return (
    <Reveal as="section" id="message-maker" className="patticake-message-maker scroll-mt-24 bg-white px-6 py-12 md:scroll-mt-28 lg:py-section">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="section-label">message maker</p>
          <h2 className="text-h2 lowercase">make it sound like them</h2>
          <p className="mt-5 max-w-xl text-xl leading-9 text-body">
            Patticake gets more personal with a few words on top. Pick a quick note or type your own, then send it with the cake at checkout or in your pickup note.
          </p>
          <div className="message-chip-grid" role="group" aria-label="Message ideas">
            {quickMessages.map((item) => (
              <m.button
                key={item}
                type="button"
                aria-pressed={message === item}
                onClick={() => setMessage(item)}
                whileTap={{ scale: 0.94 }}
                transition={snap}
              >
                {item}
              </m.button>
            ))}
          </div>
          <label className="message-maker-field" htmlFor="patticake-message-preview">
            cake message
            <input
              id="patticake-message-preview"
              value={message}
              maxLength={28}
              onFocus={(event) => event.target.select()}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <div className="relative mt-6 flex flex-wrap items-center gap-4">
            <m.button
              type="button"
              className="btn-primary"
              onClick={handleSend}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={snap}
            >
              Send These Words
            </m.button>
            <p className="text-base leading-6 text-body">drops your words into the note below</p>
            {liftoff > 0 && (
              <m.span
                key={liftoff}
                className="pointer-events-none absolute left-0 top-full z-10 mt-2 border border-ink/15 bg-cream px-3 py-1.5 font-serif text-base text-ink shadow-lg"
                aria-hidden="true"
                initial={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
                animate={{ opacity: 0, y: 64, scale: 0.88, rotate: 2 }}
                transition={{ duration: 0.55, ease: 'easeIn' }}
                onAnimationComplete={() => setLiftoff(0)}
              >
                &ldquo;{displayMessage}&rdquo;
              </m.span>
            )}
          </div>
        </div>

        <div className="message-preview-stage" aria-live="polite">
          <MotionPauseButton className="motion-pause-button" />
          <div className="message-preview-card message-preview-card-back" aria-hidden="true">
            from yum! with love
          </div>
          <div className="message-preview-cake">
            <Image
              src="/images/patticake/03_top_view.jpg"
              alt="Patticake top view with vanilla buttercream"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover crop-patticake-top"
            />
            <div className="message-preview-text">
              <AnimatePresence initial={false}>
                {words.map((word, index) => (
                  <m.span
                    key={index}
                    className="message-preview-word"
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={snap}
                  >
                    {word}
                  </m.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="message-preview-card message-preview-card-front" aria-hidden="true">
            {message.length}/28 characters
          </div>
        </div>
      </div>
    </Reveal>
  );
}
```

Notes: keys are word INDEXES on purpose, a word pops when it first appears and updates in place while being typed (no re-pop per keystroke); removed indexes exit. `liftoff` renders one chip per send, cleared on completion. The section's old `data-reveal` is gone, `Reveal as="section"` replaces it.

- [ ] **Step 2: Word-spacing CSS**

In `yumkitchen-web/app/globals.css`, directly after the `.message-preview-text` rule block (search for `.message-preview-text {`), add:

```css
.message-preview-word {
  display: inline-block;
}

.message-preview-word + .message-preview-word {
  margin-left: 0.32em;
}
```

- [ ] **Step 3: Arrival pulse in InquiryForm**

In `yumkitchen-web/components/forms/InquiryForm.tsx`, inside `revealAndFocusField` (line ~56), after `field.focus({ preventScroll: true });` and before `field.scrollIntoView(...)`, add:

```ts
      field.classList.add('message-field-pulse');
      window.setTimeout(() => field.classList.remove('message-field-pulse'), 1400);
```

- [ ] **Step 4: Pulse CSS**

In `yumkitchen-web/app/globals.css`:

At file scope, next to the other `@keyframes` (search for `@keyframes patticake-tag-bob`), add:

```css
@keyframes message-field-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-brand-primary) 55%, transparent);
  }
  100% {
    box-shadow: 0 0 0 16px color-mix(in srgb, var(--color-brand-primary) 0%, transparent);
  }
}
```

Inside `@media (prefers-reduced-motion: no-preference)` (next to the `.press-wrap` rule from Task 3), add:

```css
  .message-field-pulse {
    animation: message-field-pulse 1.15s cubic-bezier(0.16, 1, 0.3, 1) 1;
  }
```

Inside `@media (prefers-reduced-motion: reduce)` (after the `[data-reveal]` reset rule), add:

```css
  .message-field-pulse {
    animation: none;
  }
```

- [ ] **Step 5: Verify green + manual handoff check**

Run: `npm run typecheck && npm run lint && npm run build`
Then:
```bash
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
BASE_URL=http://localhost:3105 npm run audit:visual-motion
kill $SERVER_PID
```
Expected: all pass. Manually (or via the browser pane): on `/patticake`, type words in the message maker (each new word pops), click "Send These Words", chip lifts off, page scrolls to the shipping note, gift-message field is prefilled and pulses. Repeat on `/order-a-cake` (message textarea gets `Words on the cake: "…"`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(patticake): message-maker showpiece - word pops, liftoff chip, arrival pulse

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: /order-a-cake + checkout light treatment

**Files:**
- Modify: `yumkitchen-web/app/order-a-cake/page.tsx`
- Modify: `yumkitchen-web/app/patticake/checkout/page.tsx`

**Interfaces:**
- Consumes: all primitives (`@/components/motion/...` paths).
- Produces: shared-vocabulary choreography on both pages; no bespoke set pieces.

- [ ] **Step 1: /order-a-cake choreography**

Add the same five imports as Task 5. Exact edits (same patterns as Task 5, every old/new pair below is complete):

**1a, h1** (line ~121, keep `aria-label`):
```tsx
// old
<h1 className="font-serif text-[clamp(4rem,8vw,7.5rem)] font-normal leading-[0.88] lowercase text-ink" aria-label="order a patticake">
// new, Reveal doesn't forward aria-label, so keep the h1 and wrap its parts is NOT possible;
// instead wrap the h1 in a transform-only Reveal div:
<Reveal fade={false} y={14}>
  <h1 className="font-serif text-[clamp(4rem,8vw,7.5rem)] font-normal leading-[0.88] lowercase text-ink" aria-label="order a patticake">
    ...unchanged children...
  </h1>
</Reveal>
```

**1b, hero copy p** (line ~132) → `<Reveal as="p" className="mt-7 max-w-[500px] text-xl leading-8 text-ink" delay={0.1} y={16}>`.

**1c, hero CTA row** (line ~135): div → `<Reveal className="mt-8 flex flex-wrap items-center gap-3" delay={0.16} y={14}>`; wrap both CTAs in `<PressButton>`.

**1d, HeroNote grid** (line ~143): div → `<Stagger className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2" gap={0.08}>`, each `<HeroNote/>` in `<StaggerItem>`.

**1e, hero-card tags** (line ~161): the three `<span>`s → `<TapeTag delay={0.45}>happy birthday</TapeTag>`, `<TapeTag delay={0.67}>just married</TapeTag>`, `<TapeTag delay={0.89}>love you</TapeTag>`. (The hero-card `<Image priority>` stays untouched, LCP.)

**1f, ticket band** (line ~184): same stamp pattern as Task 5 step 2h:
`<div className="patticake-ticket">` → `<Stagger className="patticake-ticket" gap={0.12}>`; `<div className="patticake-ticket-stub patticake-ticket-stub-brand">` → `<StaggerItem variant="stamp" className="patticake-ticket-stub patticake-ticket-stub-brand">`; the heading `<div>` → `<StaggerItem>`; proofPoints articles → `<StaggerItem as="article" key={point.title} className="border-t border-ink/15 pt-4">`.

**1g, shop grid** (line ~221): div → `<Stagger className="mt-10 grid gap-5 md:grid-cols-3">`; articles → `<StaggerItem as="article" key={path.title} className="patticake-action-card group" hoverLift>`; each card CTA:
```tsx
<PressButton className="mt-6 self-end">
  <a href={path.href} className="btn-primary">
    {path.action}
  </a>
</PressButton>
```

**1h, orderSteps grid** (line ~254): div → `<Stagger className="mt-11 grid gap-5 md:grid-cols-4">`; articles → `<StaggerItem as="article" key={step.number} className="border-t-2 border-brand-primary pt-5">`.

**1i, celebrations wedding photo parallax** (line ~285):
```tsx
// old
<div className="relative row-span-2 aspect-[3/4] overflow-hidden bg-blue-soft">
// new
<ParallaxImage className="relative row-span-2 aspect-[3/4] bg-blue-soft">
```
(inner `<Image>` unchanged; closer → `</ParallaxImage>`.) Wrap the celebrations text column CTA (`Plan a Cake`, line ~280) in `<PressButton>`.

**1j, gallery grid** (line ~312): div → `<Stagger className="grid gap-4 md:grid-cols-4" gap={0.06}>`; each photo div → `<StaggerItem key={`${image.alt}-${index}`} className={`relative overflow-hidden bg-page ${index === 1 ? 'aspect-[4/5]' : 'aspect-square'}`}>`.

**1k, inquiry intro column** (line ~324): the `<div>` holding label/h2/p/cross-link → `<Reveal>` (no className).

**1l, final CTA band** (line ~353): inner grid div → `<Reveal className="mx-auto grid max-w-[980px] gap-6 text-center md:grid-cols-[1fr_auto_auto] md:items-center md:text-left">`; wrap both CTAs in `<PressButton>`.

- [ ] **Step 2: Checkout light treatment**

In `yumkitchen-web/app/patticake/checkout/page.tsx` (already `'use client'`), add imports:

```tsx
import { m } from 'motion/react';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { snap } from '@/components/motion/springs';
```

**2a, page header** (line ~111): `<div className="mx-auto max-w-[1180px]">` → `<Reveal className="mx-auto max-w-[1180px]" y={12}>` (closer `</Reveal>`).

**2b, order summary lines** (line ~278):
```tsx
// old
<ul className="mt-4 divide-y divide-ink/10">
  {items.map((item) => (
    <li key={item.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3">
// new
<Stagger as="ul" className="mt-4 divide-y divide-ink/10" gap={0.06}>
  {items.map((item) => (
    <StaggerItem as="li" key={item.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3">
```

**2c, place-order button** (line ~312):
```tsx
// old
<button type="button" onClick={placeOrder} disabled={submitting} className="btn-primary mt-5 w-full">
  {submitting ? 'Placing order…' : `Place order · ${formatUsd(total)}`}
</button>
// new
<m.button type="button" onClick={placeOrder} disabled={submitting} className="btn-primary mt-5 w-full" whileTap={{ scale: 0.98 }} transition={snap}>
  {submitting ? 'Placing order…' : `Place order · ${formatUsd(total)}`}
</m.button>
```

Nothing else on checkout, no parallax, no tape play, no hover lifts (calm conversion page). The empty-cart branch stays untouched.

- [ ] **Step 3: Verify green**

Run: `npm run audit:motion && npm run typecheck && npm run lint && npm run build`
Expected: all pass (audit stays at 29 checks, no new check this task).

- [ ] **Step 4: Rendered check**

```bash
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
BASE_URL=http://localhost:3105 npm run audit:visual-motion
kill $SERVER_PID
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(patticake): order-a-cake choreography + calm checkout entrances

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Full verify gate, after-screenshots, run report

**Files:**
- Create: `docs/plans/2026-07-13-patticake-motion-round4/run-report.md`
- Create: `docs/plans/2026-07-13-patticake-motion-round4/after-*.png` (8 files)

**Interfaces:**
- Consumes: everything.
- Produces: green verify gate, before/after evidence, run report.

- [ ] **Step 1: Full verify gate**

From the repo root: `bash verify.sh`
Expected: every stage green, typecheck, lint, motion governance audit (29 checks), content validation, build, UI smoke, rendered visual/motion audit, link audit, axe, Lighthouse. If Lighthouse LCP regressed vs the gate's threshold, revisit: the only allowed fixes are removing `fade`/entrance from whichever element became LCP-blocking (never loosening the gate).

- [ ] **Step 2: Capture the AFTER state**

From `yumkitchen-web/`:

```bash
PORT=3105 npm run start &
SERVER_PID=$!
sleep 4
node ../docs/plans/2026-07-13-patticake-motion-round4/capture.mjs after
kill $SERVER_PID
```

Expected: 8 `after-*.png` files. Eyeball each pair against its `before-*` twin: no layout shifts, no missing content, tags landed, nothing overlapping.

- [ ] **Step 3: Write the run report**

Create `docs/plans/2026-07-13-patticake-motion-round4/run-report.md` summarizing: what shipped per task, verify.sh output summary (each stage + pass), any deviations from this plan and why, and the before/after screenshot inventory.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs(patticake): round 4 run report + before/after captures

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review (done at write time)

- **Spec coverage:** provider site-wide ✔ (T1); springs/Reveal/Stagger ✔ (T2); TapeTag/PressButton/ParallaxImage + CSS handoff ✔ (T3); home choreography ✔ (T4); flagship + ticket set piece ✔ (T5); message-maker showpiece + pulse ✔ (T6); order-a-cake + calm checkout ✔ (T7); audit extension ✔ (T1/T2/T4/T5); noscript fallback ✔ (T1); LCP protection ✔ (global constraint + fade={false} h1s, untouched priority images); verification + screenshots ✔ (T4/T8).
- **Placeholders:** none, every step has complete code or exact commands.
- **Type consistency:** `frosting`/`snap` (T2) consumed by T3–T7 by those names; `Reveal` props (`as`, `delay`, `y`, `fade`, `id`) match all usage; `StaggerItem` props (`as`, `variant`, `hoverLift`) match all usage; `TapeTag({ children, delay })`, `PressButton({ children, className })`, `ParallaxImage({ children, className })` match all usage.
