# Yum Adaptive Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved adaptive motion and conversion upgrade for the Yum Kitchen rebuild.

**Architecture:** Keep the current Next.js App Router structure and improve existing components in place. Add a small motion audit script, consolidate animation rules in `app/globals.css`, and tune homepage, menu, order, navigation, and reduced-motion behavior without adding a new animation library.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Puppeteer scripts, Lighthouse, axe.

---

## File Structure

- Create: `scripts/audit-motion.mjs`
  - Reads app CSS and component files and fails when the required motion roles, reduced-motion rules, or key UI affordances are missing.
- Modify: `package.json`
  - Add `audit:motion` script.
- Modify: `app/globals.css`
  - Add motion tokens, role classes, tuned animation timings, reduced-motion coverage, and responsive safeguards.
- Modify: `components/HomeDesign.tsx`
  - Improve homepage first-viewport proof, active hero image state text, and CTA clarity.
- Modify: `components/MenuMotionIntro.tsx`
  - Make the menu intro more useful above the fold while keeping motion appetite-led.
- Modify: `app/menu/MenuClient.tsx`
  - Improve menu status copy, quick search affordances, and visual hierarchy.
- Modify: `app/order/OrderClient.tsx`
  - Add category filtering, clearer item feedback, stronger pickup context, and better checkout confidence.
- Modify: `components/SiteHeader.tsx`
  - Add motion role attributes/classes to navigation transitions and preserve predictable keyboard behavior.
- Modify: `../scripts/smoke_ui.js`
  - Expand smoke coverage for reduced motion, menu search status, pickup selection, and cart quantity behavior.
- Output only during verification: `/Users/zsoskin/outputs/yum-audit/2026-05-26/`
  - Store screenshots and Lighthouse JSON generated during QA.

Because `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web` is not currently inside a git repository, commit steps are conditional. If `git rev-parse --is-inside-work-tree` fails, record "no git repository available" and continue without commit.

---

### Task 1: Add Motion Audit Guard

**Files:**
- Create: `scripts/audit-motion.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the failing motion audit script**

Create `scripts/audit-motion.mjs` with this content:

```js
#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const css = read('app/globals.css');
const home = read('components/HomeDesign.tsx');
const menuIntro = read('components/MenuMotionIntro.tsx');
const order = read('app/order/OrderClient.tsx');
const header = read('components/SiteHeader.tsx');

const checks = [
  ['motion token slow', css.includes('--motion-duration-slow')],
  ['motion token base', css.includes('--motion-duration-base')],
  ['motion token fast', css.includes('--motion-duration-fast')],
  ['entrance role class', css.includes('.motion-role-entrance')],
  ['ambient role class', css.includes('.motion-role-ambient')],
  ['feedback role class', css.includes('.motion-role-feedback')],
  ['modal role class', css.includes('.motion-role-modal')],
  ['reduced motion media query', css.includes('@media (prefers-reduced-motion: reduce)')],
  ['ambient disabled in reduced motion', css.includes('.motion-role-ambient')],
  ['home hero active announcement', home.includes('aria-live="polite"') && home.includes('currentHeroLabel')],
  ['menu motion labeled ambient', menuIntro.includes('motion-role-ambient')],
  ['order category filter', order.includes('orderCategoryFilters') && order.includes('selectedCategory')],
  ['header dropdown motion role', header.includes('motion-role-feedback')],
];

const failures = checks.filter(([, passed]) => !passed).map(([label]) => label);

if (failures.length > 0) {
  console.error('Motion audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Motion audit passed: ${checks.length} checks.`);
```

- [ ] **Step 2: Add package script**

Modify `package.json` scripts so the block includes `audit:motion`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "validate:content": "node ../scripts/validate_content.js",
    "smoke:ui": "node ../scripts/smoke_ui.js http://localhost:3000",
    "a11y": "node ../scripts/a11y_audit.js http://localhost:3000 / /order /menu /catering /order-a-cake /about /careers /in-the-news /contact /accessibility-statement /location/st-louis-park /location/shady-oak /location/saint-paul /location/woodbury",
    "lh": "lighthouse http://localhost:3000 --quiet --chrome-flags=\"--headless=new --no-sandbox\" --output=json --output-path=/tmp/yum-lh.json",
    "audit:motion": "node scripts/audit-motion.mjs"
  }
}
```

- [ ] **Step 3: Run audit and verify it fails before implementation**

Run:

```bash
npm run audit:motion
```

Expected: FAIL with missing motion token, role, homepage announcement, menu role, order category filter, and header role messages.

- [ ] **Step 4: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add package.json scripts/audit-motion.mjs && git commit -m "test: add yum motion audit guard"
```

Expected in this folder today: command reports that this is not a git repository. Continue without commit.

---

### Task 2: Govern Motion In CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add motion tokens inside `@theme`**

Add these tokens after `--spacing-section: 90px;`:

```css
  --motion-duration-fast: 160ms;
  --motion-duration-base: 320ms;
  --motion-duration-slow: 680ms;
  --motion-duration-ambient: 7600ms;
  --motion-ease-standard: cubic-bezier(0.22, 0.61, 0.36, 1);
  --motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-ease-feedback: ease;
```

- [ ] **Step 2: Add motion role classes after `.motion-image`**

Insert this CSS after the `.motion-image` rule:

```css
.motion-role-entrance {
  --motion-role-duration: var(--motion-duration-slow);
  --motion-role-ease: var(--motion-ease-enter);
}

.motion-role-ambient {
  --motion-role-duration: var(--motion-duration-ambient);
  --motion-role-ease: ease-in-out;
}

.motion-role-feedback {
  --motion-role-duration: var(--motion-duration-fast);
  --motion-role-ease: var(--motion-ease-feedback);
}

.motion-role-modal {
  --motion-role-duration: var(--motion-duration-base);
  --motion-role-ease: var(--motion-ease-enter);
}
```

- [ ] **Step 3: Replace hard-coded shared transition timings**

Update button, modal, and hover transitions to use motion tokens:

```css
.skip-link {
  transition: transform var(--motion-duration-fast) var(--motion-ease-feedback);
}

.home-hero-indicator {
  transition:
    background-color 220ms ease,
    border-color 220ms ease,
    color 220ms ease;
}

.kinetic-card {
  transition:
    transform var(--motion-duration-base) var(--motion-ease-feedback),
    box-shadow var(--motion-duration-base) var(--motion-ease-feedback);
}
```

Keep the existing visual values where the timing is page-specific, such as `home-hero-meter 5000ms`.

- [ ] **Step 4: Add reduced-motion role reset**

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add this rule before the long selector list:

```css
  .motion-role-entrance,
  .motion-role-ambient,
  .motion-role-feedback,
  .motion-role-modal {
    animation: none;
    transform: none;
    transition: none;
  }
```

- [ ] **Step 5: Run audit and lint**

Run:

```bash
npm run audit:motion
npm run lint
```

Expected: `audit:motion` still fails because component roles and state are not complete. `lint` passes.

- [ ] **Step 6: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add app/globals.css && git commit -m "style: define yum motion roles"
```

Expected in this folder today: no git repository available.

---

### Task 3: Upgrade Homepage First Viewport

**Files:**
- Modify: `components/HomeDesign.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add homepage proof data**

In `components/HomeDesign.tsx`, add this after `heroImages`:

```tsx
const heroProofItems = [
  { value: '4', label: 'neighborhood kitchens' },
  { value: '8am - 8pm', label: 'open daily' },
  { value: 'since 2005', label: 'made from scratch' },
] as const;
```

- [ ] **Step 2: Add active hero label**

Inside `HomeHero`, after `const [orderOpen, setOrderOpen] = useState(false);`, add:

```tsx
  const currentHeroLabel = heroImages[current].label;
```

- [ ] **Step 3: Add proof row and live state to hero panel**

After the main hero paragraph, before the following divider, insert:

```tsx
          <div className="hero-proof-grid" aria-label="Yum Kitchen proof points">
            {heroProofItems.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {currentHeroLabel}
          </p>
```

- [ ] **Step 4: Tune CTA labels**

Replace the three hero action labels with:

```tsx
            <Link href="/#locations" prefetch={false} className="btn-secondary">
              Find a Kitchen
            </Link>
            <Link href="/menu" prefetch={false} className="btn-secondary">
              Browse Menu
            </Link>
            <button type="button" className="btn-primary" onClick={() => setOrderOpen(true)}>
              Start Order
            </button>
```

- [ ] **Step 5: Add hero proof CSS**

In `app/globals.css`, add after `.home-hero-indicator[aria-pressed='true']`:

```css
.hero-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 1.15rem;
}

.hero-proof-grid div {
  border-top: 1px solid rgb(45 45 45 / 0.16);
  padding-top: 0.65rem;
}

.hero-proof-grid strong,
.hero-proof-grid span {
  display: block;
}

.hero-proof-grid strong {
  color: var(--color-ink);
  font-family: var(--font-trocchi), Georgia, serif;
  font-size: 1.35rem;
  font-weight: 400;
  line-height: 1;
}

.hero-proof-grid span {
  margin-top: 0.25rem;
  color: var(--color-body);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.15;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Run targeted checks**

Run:

```bash
npm run audit:motion
npm run lint
npm run typecheck
```

Expected: `audit:motion` still fails until menu, order, and header tasks are complete. `lint` and `typecheck` pass.

- [ ] **Step 7: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add components/HomeDesign.tsx app/globals.css && git commit -m "feat: sharpen homepage first viewport"
```

Expected in this folder today: no git repository available.

---

### Task 4: Upgrade Menu Discovery

**Files:**
- Modify: `components/MenuMotionIntro.tsx`
- Modify: `app/menu/MenuClient.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add menu fast paths**

In `components/MenuMotionIntro.tsx`, add this after `const featured = orderDemoItems.slice(0, 4);`:

```tsx
  const fastPaths = [
    { href: '/menu#sandwiches', label: 'sandwiches' },
    { href: '/menu#salads', label: 'salads' },
    { href: '/menu#entrees', label: 'dinner' },
    { href: '/menu#bakery', label: 'bakery' },
  ] as const;
```

- [ ] **Step 2: Add fast path links below intro actions**

After the existing action links in `MenuMotionIntro`, insert:

```tsx
          <nav className="menu-fast-paths" aria-label="Popular menu paths">
            {fastPaths.map((path) => (
              <Link key={path.label} href={path.href}>
                {path.label}
              </Link>
            ))}
          </nav>
```

- [ ] **Step 3: Mark orbit as ambient**

Change:

```tsx
        <div className="menu-orbit" aria-label="Featured Yum menu photography">
```

to:

```tsx
        <div className="menu-orbit motion-role-ambient" aria-label="Featured Yum menu photography">
```

- [ ] **Step 4: Improve menu status copy**

In `app/menu/MenuClient.tsx`, replace the status paragraph expression with:

```tsx
                {normalizedQuery ? `${visibleItemCount} result${visibleItemCount === 1 ? '' : 's'} for ${query}` : `${visibleItemCount} menu items across breakfast, lunch, dinner, and bakery`}
```

- [ ] **Step 5: Add menu fast path CSS**

In `app/globals.css`, add after `.menu-motion-intro`:

```css
.menu-fast-paths {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.menu-fast-paths a {
  border: 1px solid rgb(45 45 45 / 0.18);
  background: rgb(255 244 245 / 0.72);
  padding: 0.55rem 0.75rem;
  color: var(--color-ink);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  text-transform: lowercase;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-feedback),
    border-color var(--motion-duration-fast) var(--motion-ease-feedback);
}

.menu-fast-paths a:hover,
.menu-fast-paths a:focus-visible {
  border-color: var(--color-ink);
  background: var(--color-ink);
  color: var(--color-cream);
}
```

- [ ] **Step 6: Run targeted checks**

Run:

```bash
npm run audit:motion
npm run lint
npm run typecheck
```

Expected: `audit:motion` still fails until order and header tasks are complete. `lint` and `typecheck` pass.

- [ ] **Step 7: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add components/MenuMotionIntro.tsx app/menu/MenuClient.tsx app/globals.css && git commit -m "feat: improve menu discovery motion"
```

Expected in this folder today: no git repository available.

---

### Task 5: Upgrade Ordering UX

**Files:**
- Modify: `app/order/OrderClient.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add category filter data**

In `app/order/OrderClient.tsx`, add this after `orderSearchSuggestions`:

```tsx
const orderCategoryFilters = [
  { value: 'all', label: 'all favorites' },
  { value: 'entree', label: 'entrees' },
  { value: 'sandwich', label: 'sandwiches' },
  { value: 'salad', label: 'salads' },
  { value: 'soup', label: 'soups' },
  { value: 'bakery', label: 'bakery' },
] as const;
```

- [ ] **Step 2: Add category state**

Inside `OrderClient`, after `const [query, setQuery] = useState('');`, add:

```tsx
  const [selectedCategory, setSelectedCategory] = useState<(typeof orderCategoryFilters)[number]['value']>('all');
```

- [ ] **Step 3: Filter items by query and category**

Replace the `items` memo with:

```tsx
  const items = useMemo(() => {
    return orderDemoItems.filter((item) => {
      const matchesQuery = !normalizedQuery || [item.name, item.category, item.description].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [normalizedQuery, selectedCategory]);
```

- [ ] **Step 4: Add filter controls below search suggestions**

After the popular favorite searches block, insert:

```tsx
              <div className="order-filter-row" aria-label="Favorite category filters">
                {orderCategoryFilters.map((filter) => {
                  const selected = selectedCategory === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      className={`border px-3 py-2 text-base leading-none transition ${
                        selected ? 'border-brand-primary bg-brand-primary text-white' : 'border-ink/25 bg-white text-ink hover:border-ink'
                      }`}
                      aria-pressed={selected}
                      onClick={() => setSelectedCategory(filter.value)}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
```

- [ ] **Step 5: Improve empty state clear behavior**

Replace the empty state button with:

```tsx
                <button
                  type="button"
                  className="btn-primary mt-5"
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Show All Favorites
                </button>
```

- [ ] **Step 6: Add filter row CSS**

In `app/globals.css`, add after `.order-step-row`:

```css
.order-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-top: 1px solid rgb(45 45 45 / 0.1);
  margin-top: 1rem;
  padding-top: 1rem;
}
```

- [ ] **Step 7: Run targeted checks**

Run:

```bash
npm run audit:motion
npm run lint
npm run typecheck
```

Expected: `audit:motion` still fails until header role is complete. `lint` and `typecheck` pass.

- [ ] **Step 8: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add app/order/OrderClient.tsx app/globals.css && git commit -m "feat: improve order filtering and feedback"
```

Expected in this folder today: no git repository available.

---

### Task 6: Mark Navigation Motion And Expand Smoke Coverage

**Files:**
- Modify: `components/SiteHeader.tsx`
- Modify: `../scripts/smoke_ui.js`

- [ ] **Step 1: Add feedback role to desktop dropdown**

In `components/SiteHeader.tsx`, change the child dropdown class from:

```tsx
className="invisible absolute left-0 top-full z-50 grid min-w-44 translate-y-2 border border-blue-soft/70 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
```

to:

```tsx
className="motion-role-feedback invisible absolute left-0 top-full z-50 grid min-w-44 translate-y-2 border border-blue-soft/70 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
```

- [ ] **Step 2: Replace smoke script with expanded checks**

Replace `../scripts/smoke_ui.js` with:

```js
#!/usr/bin/env node
const { createRequire } = require('module');

const requireFromApp = createRequire(`${process.cwd()}/package.json`);
const puppeteer = requireFromApp('puppeteer');

const baseUrl = process.argv[2] || 'http://localhost:3000';

async function textIncludes(page, value) {
  return page.evaluate((needle) => document.body.textContent?.toLowerCase().includes(needle.toLowerCase()), value);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  try {
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const title = await page.title();
    if (!title.includes('yum!')) throw new Error(`unexpected home title: ${title}`);
    if (!(await textIncludes(page, 'neighborhood kitchens'))) throw new Error('home proof points missing');

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    if (!(await textIncludes(page, 'start order'))) throw new Error('home CTA missing under reduced motion');

    await page.goto(`${baseUrl}/order`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('main');
    await page.evaluate(() => {
      const saladButton = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim().toLowerCase() === 'salads');
      if (!saladButton) throw new Error('Salads filter not found');
      saladButton.click();
    });
    await page.waitForFunction(() => document.body.textContent?.toLowerCase().includes('mixed berry salad'));
    await page.evaluate(() => {
      const addButton = [...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Add');
      if (!addButton) throw new Error('Add button not found');
      addButton.click();
    });
    await page.waitForFunction(() => document.body.textContent?.includes('1 item selected'));
    await page.evaluate(() => {
      const addAgain = [...document.querySelectorAll('button')].find((button) => button.getAttribute('aria-label')?.startsWith('Add mixed berry salad'));
      if (!addAgain) throw new Error('Cart quantity add button not found');
      addAgain.click();
    });
    await page.waitForFunction(() => document.body.textContent?.includes('2 item selected') || document.body.textContent?.includes('2 items selected'));
    const checkoutLinks = await page.$$eval('a[data-event="click_order_online"]', (links) => links.length);
    if (checkoutLinks < 2) throw new Error(`expected checkout/order links, found ${checkoutLinks}`);

    await page.goto(`${baseUrl}/menu`, { waitUntil: 'networkidle0' });
    await page.type('input[placeholder*="Search"]', 'salmon');
    await page.waitForFunction(() => document.body.textContent?.toLowerCase().includes('grainy mustard salmon'));
    const resultStatus = await textIncludes(page, 'for salmon');
    if (!resultStatus) throw new Error('menu search status missing query text');
    const noResults = await textIncludes(page, 'no menu items found');
    if (noResults) throw new Error('menu search unexpectedly returned no results');

    await browser.close();
    console.log('UI smoke passed: home, reduced motion, order filters, cart quantity, checkout links, and menu search work.');
  } catch (error) {
    await browser.close();
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 3: Run audit and type checks**

Run:

```bash
npm run audit:motion
npm run lint
npm run typecheck
```

Expected: all three pass.

- [ ] **Step 4: Conditional commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add components/SiteHeader.tsx ../scripts/smoke_ui.js && git commit -m "test: expand yum interaction smoke coverage"
```

Expected in this folder today: no git repository available.

---

### Task 7: Full Build Verification And Visual QA

**Files:**
- Modify only if a verification failure exposes a source bug from Tasks 1 through 6.
- Output screenshots and reports under `/Users/zsoskin/outputs/yum-audit/2026-05-26/`.

- [ ] **Step 1: Run static verification**

Run:

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run audit:motion
npm run build
```

Expected: all commands pass.

- [ ] **Step 2: Start production server**

Run:

```bash
npm run start -- --port 3000
```

Expected: Next.js serves on `http://localhost:3000`. Keep the server running in this terminal session until all browser checks finish.

- [ ] **Step 3: Run automated browser checks**

In a second terminal, run:

```bash
npm run smoke:ui
npm run a11y
npm run lh
```

Expected:

- `smoke:ui` prints the expanded pass message.
- `a11y` prints zero serious and zero critical totals.
- `lh` writes `/tmp/yum-lh.json` with successful Lighthouse output.

- [ ] **Step 4: Capture desktop and mobile screenshots**

Run this Puppeteer snippet from the app root:

```bash
node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const out = '/Users/zsoskin/outputs/yum-audit/2026-05-26';
fs.mkdirSync(out, { recursive: true });

const shots = [
  { name: 'adaptive-home-desktop.png', url: 'http://localhost:3000/', width: 1440, height: 1000 },
  { name: 'adaptive-home-mobile.png', url: 'http://localhost:3000/', width: 390, height: 844 },
  { name: 'adaptive-menu-desktop.png', url: 'http://localhost:3000/menu', width: 1440, height: 1000 },
  { name: 'adaptive-menu-mobile.png', url: 'http://localhost:3000/menu', width: 390, height: 844 },
  { name: 'adaptive-order-desktop.png', url: 'http://localhost:3000/order', width: 1440, height: 1000 },
  { name: 'adaptive-order-mobile.png', url: 'http://localhost:3000/order', width: 390, height: 844 },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  for (const shot of shots) {
    const page = await browser.newPage();
    await page.setViewport({ width: shot.width, height: shot.height });
    await page.goto(shot.url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(out, shot.name), fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log(`Saved ${shots.length} screenshots to ${out}`);
})();
NODE
```

Expected: six screenshots are saved in `/Users/zsoskin/outputs/yum-audit/2026-05-26/`.

- [ ] **Step 5: Reduced-motion screenshot check**

Run:

```bash
node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const out = '/Users/zsoskin/outputs/yum-audit/2026-05-26';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  const visible = await page.evaluate(() => document.body.textContent?.includes('Start Order'));
  if (!visible) throw new Error('Start Order is not visible with reduced motion');
  await page.screenshot({ path: path.join(out, 'adaptive-home-mobile-reduced-motion.png'), fullPage: true });
  await browser.close();
  console.log('Reduced-motion screenshot saved.');
})();
NODE
```

Expected: reduced-motion screenshot is saved and the script exits zero.

- [ ] **Step 6: Stop production server**

Stop the `npm run start` terminal with `Ctrl-C`.

- [ ] **Step 7: Conditional final commit**

Run:

```bash
git rev-parse --is-inside-work-tree && git add package.json scripts/audit-motion.mjs app/globals.css components/HomeDesign.tsx components/MenuMotionIntro.tsx app/menu/MenuClient.tsx app/order/OrderClient.tsx components/SiteHeader.tsx ../scripts/smoke_ui.js docs/superpowers/specs/2026-05-26-yum-adaptive-motion-design.md docs/superpowers/plans/2026-05-26-yum-adaptive-motion.md && git commit -m "feat: upgrade yum adaptive motion and ordering ux"
```

Expected in this folder today: no git repository available.

---

## Self-Review

Spec coverage:

- Motion governance is covered by Tasks 1 and 2.
- Homepage first-viewport polish is covered by Task 3.
- Menu discovery and first-viewport usefulness are covered by Task 4.
- Ordering UX improvements are covered by Task 5.
- Header motion and smoke coverage are covered by Task 6.
- Accessibility, reduced motion, performance, screenshots, Lighthouse, and live-site comparison readiness are covered by Task 7.

Placeholder scan:

- No placeholder markers or deferred steps are present.
- Every code-changing task includes concrete code blocks or exact command lines.

Type consistency:

- `orderCategoryFilters` and `selectedCategory` are introduced before they are used.
- `currentHeroLabel` is introduced before the `aria-live` announcement uses it.
- `motion-role-*` class names match the audit script and CSS role definitions.
