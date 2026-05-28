# Yum Baby Blue Brand Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Yum rebuild feel more directly derived from Yum packaging and marketing assets.

**Architecture:** Keep the existing Next.js/Tailwind v4 app structure. Change shared brand tokens first, then apply small reusable CSS motifs and scoped page/component class updates. Keep food-truck motion work outside the web repo as a generated artifact.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 theme tokens, Remotion for motion output.

---

### Task 1: Package-Derived Website Color System

**Files:**
- Modify: `yumkitchen-web/app/globals.css`
- Modify: `yumkitchen-web/components/SiteHeader.tsx`
- Modify: `yumkitchen-web/components/SiteFooter.tsx`

- [ ] **Step 1: Update token values**

Use packaging-sampled colors:

```css
--color-page: #f6fbfe;
--color-cream: #fff7f8;
--color-blue-soft: #b4d2ee;
--color-blue-tint: #dceefa;
--color-blue-packaging: #deedf8;
--color-blue-gingham: #b6cee0;
```

- [ ] **Step 2: Add packaging motif utilities**

Add `.packaging-field`, `.paper-surface`, and `.red-ribbon-rule` in `globals.css` for pale-blue fields, warm white surfaces, and thin red brand rules.

- [ ] **Step 3: Apply to header/footer**

Use `bg-blue-packaging` and `border-white/70` in the header. Use a pale blue footer shell and red top rule to remove gray/black weight.

- [ ] **Step 4: Verify**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: both pass.

### Task 2: High-Impact Page Brand Polish

**Files:**
- Modify: `yumkitchen-web/components/HomeDesign.tsx`
- Modify: `yumkitchen-web/app/patticake-national-delivery/page.tsx`
- Modify: `yumkitchen-web/app/globals.css`

- [ ] **Step 1: Homepage**

Make the hero panel and category chips feel like white label surfaces on a pale-blue package field. Keep food imagery unchanged.

- [ ] **Step 2: Patticake national delivery**

Make the opening section and ordering band use packaging blue as the base field, with white card surfaces and red action accents. Keep every cake image as real Patticake photography.

- [ ] **Step 3: Verify**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.

### Task 3: Food-Truck Motion Artifact

**Files:**
- Modify/create under `/Users/zsoskin/outputs/yum-foodtruck-motion`

- [ ] **Step 1: Use actual packaging direction**

Use the existing concept board as source but frame it as a packaging-derived decision: warm white upper truck, baby-blue lower wrap, red logo/ribbon/awning accents.

- [ ] **Step 2: Create Remotion sequence**

Create a short motion proof that pans across the concept and includes palette callouts. Use Remotion frame-based animation only.

- [ ] **Step 3: Render still/video**

Render a still and MP4 into `/Users/zsoskin/outputs/yum-foodtruck-motion/renders`.

### Task 4: Browser QA and Handoff

**Files:**
- Create: `docs/qa/brand-blue-pass.md`

- [ ] **Step 1: Start local dev server**

Run the app from the worktree and capture desktop/mobile screenshots for `/` and `/patticake-national-delivery`.

- [ ] **Step 2: Inspect screenshots**

Use `view_image` on the brand reference board and final screenshots. Confirm no big black panels, no fake photos, baby-blue field dominance, red action hierarchy, and readable mobile layouts.

- [ ] **Step 3: Final checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.
