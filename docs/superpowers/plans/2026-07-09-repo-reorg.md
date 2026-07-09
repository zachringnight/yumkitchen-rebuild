# Repo Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Honor each task's **Review tier** — only `full`-tier tasks get the two-stage review; `standard` gets one combined review; `light` is executed directly with no subagents.

**Goal:** Reorganize `yumkitchen-rebuild` so a new AI coder has one accurate entry point (`AGENTS.md`), one `docs/` tree, one `scripts/` folder inside the app, and clear separation between current instructions and historical record.

**Architecture:** Pure file moves (`git mv`, preserves history) plus two content rewrites (`AGENTS.md`, new `README.md`) and small mechanical path-reference fixes in `package.json`, `tasks.md`, and `setup.sh`. No application code changes.

**Tech Stack:** Next.js 16.2 repo; Node/npm scripts; bash.

**Spec:** `docs/superpowers/specs/2026-07-09-repo-reorg-design.md`

---

### Task 1: Merge root `scripts/` into `yumkitchen-web/scripts/`

**Review tier:** light

**Files:**
- Move: `scripts/a11y_audit.js` → `yumkitchen-web/scripts/a11y_audit.js`
- Move: `scripts/link_audit.js` → `yumkitchen-web/scripts/link_audit.js`
- Move: `scripts/smoke_ui.js` → `yumkitchen-web/scripts/smoke_ui.js`
- Move: `scripts/validate_content.js` → `yumkitchen-web/scripts/validate_content.js`
- Modify: `yumkitchen-web/package.json`

- [ ] **Step 1: Move the four scripts**

```bash
cd /Users/zsoskin/dev/yumkitchen-rebuild
git mv scripts/a11y_audit.js yumkitchen-web/scripts/a11y_audit.js
git mv scripts/link_audit.js yumkitchen-web/scripts/link_audit.js
git mv scripts/smoke_ui.js yumkitchen-web/scripts/smoke_ui.js
git mv scripts/validate_content.js yumkitchen-web/scripts/validate_content.js
rmdir scripts
```

Expected: `scripts/` directory no longer exists at repo root; `git status` shows 4 renames.

- [ ] **Step 2: Update package.json script paths**

```bash
sed -i '' 's#../scripts/validate_content.js#scripts/validate_content.js#' yumkitchen-web/package.json
sed -i '' 's#../scripts/smoke_ui.js#scripts/smoke_ui.js#' yumkitchen-web/package.json
sed -i '' 's#../scripts/link_audit.js#scripts/link_audit.js#' yumkitchen-web/package.json
sed -i '' 's#../scripts/a11y_audit.js#scripts/a11y_audit.js#' yumkitchen-web/package.json
```

Expected: `grep '\.\./scripts' yumkitchen-web/package.json` returns nothing.

- [ ] **Step 3: Verify the moved script still runs**

```bash
cd yumkitchen-web && npm run validate:content && cd ..
```

Expected: exits 0, prints `all 102 menu items preserved` (or equivalent pass lines), no `Cannot find module` error.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: merge root scripts/ into yumkitchen-web/scripts/"
```

---

### Task 2: Move current ops docs out of `yumkitchen-web/` into `docs/`

**Review tier:** light

**Files:**
- Move: `yumkitchen-web/DEPLOYMENT.md` → `docs/DEPLOYMENT.md`
- Move: `yumkitchen-web/redirects.md` → `docs/redirects.md`
- Move: `yumkitchen-web/design-qa.md` → `docs/design-qa.md`

- [ ] **Step 1: Move the three files**

```bash
git mv yumkitchen-web/DEPLOYMENT.md docs/DEPLOYMENT.md
git mv yumkitchen-web/redirects.md docs/redirects.md
git mv yumkitchen-web/design-qa.md docs/design-qa.md
```

- [ ] **Step 2: Verify DEPLOYMENT.md's internal reference to redirects.md still resolves**

```bash
grep -n "redirects.md" docs/DEPLOYMENT.md
```

Expected: the reference reads `redirects.md` (bare filename, same directory) — still correct since both files now live in `docs/` together. No edit needed.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: move DEPLOYMENT.md, redirects.md, design-qa.md into docs/"
```

---

### Task 3: Move historical plans and QA snapshots into `docs/history/`

**Review tier:** light

**Files:**
- Move: `docs/plans/` → `docs/history/plans/`
- Move: `docs/qa/` → `docs/history/qa/`

- [ ] **Step 1: Move both directories**

```bash
mkdir -p docs/history
git mv docs/plans docs/history/plans
git mv docs/qa docs/history/qa
```

- [ ] **Step 2: Verify nothing was left behind**

```bash
find docs/history/plans -type f | wc -l   # expect 40
find docs/history/qa -type f | wc -l      # expect 3
test -d docs/plans && echo "FAIL: docs/plans still exists" || echo "OK"
test -d docs/qa && echo "FAIL: docs/qa still exists" || echo "OK"
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: move docs/plans and docs/qa into docs/history/"
```

---

### Task 4: Merge `yumkitchen-web/docs/superpowers/` into root `docs/superpowers/`

**Review tier:** light

**Files:**
- Move: `yumkitchen-web/docs/superpowers/plans/2026-05-26-yum-adaptive-motion.md` → `docs/superpowers/plans/2026-05-26-yum-adaptive-motion.md`
- Move: `yumkitchen-web/docs/superpowers/specs/2026-05-26-yum-adaptive-motion-design.md` → `docs/superpowers/specs/2026-05-26-yum-adaptive-motion-design.md`

- [ ] **Step 1: Move both files**

```bash
git mv yumkitchen-web/docs/superpowers/plans/2026-05-26-yum-adaptive-motion.md docs/superpowers/plans/2026-05-26-yum-adaptive-motion.md
git mv yumkitchen-web/docs/superpowers/specs/2026-05-26-yum-adaptive-motion-design.md docs/superpowers/specs/2026-05-26-yum-adaptive-motion-design.md
```

- [ ] **Step 2: Remove the now-empty yumkitchen-web/docs tree**

```bash
find yumkitchen-web/docs -type f
```

Expected: no output (empty). Then:

```bash
rm -rf yumkitchen-web/docs
```

- [ ] **Step 3: Verify**

```bash
test -d yumkitchen-web/docs && echo "FAIL: yumkitchen-web/docs still exists" || echo "OK"
ls docs/superpowers/plans docs/superpowers/specs
```

Expected: `docs/superpowers/plans/` contains both `2026-05-22-yumkitchen-flagship-rebuild.md` and `2026-05-26-yum-adaptive-motion.md`; `docs/superpowers/specs/` contains both `2026-05-26-yum-adaptive-motion-design.md` and `2026-07-09-repo-reorg-design.md`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: merge yumkitchen-web/docs/superpowers into root docs/superpowers"
```

---

### Task 5: Archive the two obsolete handoff docs

**Review tier:** light

**Files:**
- Move: `CODEX_HANDOFF.md` → `docs/archive/CODEX_HANDOFF.md`
- Move: `AI_WEB_DEV_HANDOFF.md` → `docs/archive/AI_WEB_DEV_HANDOFF.md`

- [ ] **Step 1: Move both files**

```bash
mkdir -p docs/archive
git mv CODEX_HANDOFF.md docs/archive/CODEX_HANDOFF.md
git mv AI_WEB_DEV_HANDOFF.md docs/archive/AI_WEB_DEV_HANDOFF.md
```

- [ ] **Step 2: Add a header note to docs/archive/CODEX_HANDOFF.md**

Insert immediately after the `# Codex Handoff` title line (use the Edit tool or equivalent):

```markdown
# Codex Handoff

> **Historical.** This describes kicking off the very first task (`T-01`) at project scaffold time. That work shipped long ago. Superseded by `AGENTS.md` at the repo root. Kept for project-history reference only — do not follow as current instructions.

How to start work on the YumKitchen rebuild with OpenAI Codex (or any agent that follows the AGENTS.md convention).
```

- [ ] **Step 3: Add a header note to docs/archive/AI_WEB_DEV_HANDOFF.md**

Insert immediately after the `# AI Web Dev Handoff - Yum Website Graphics, Motion, and Social Assets` title line:

```markdown
# AI Web Dev Handoff - Yum Website Graphics, Motion, and Social Assets

> **Historical.** Written 2026-05-26 to hand off social/motion asset integration. All paths below use the pre-move absolute path `/Users/zsoskin/YumKitchen_Rebuild/07_codex/...`, which no longer exists — the repo now lives at the current checkout root and is git-tracked. The assets described here are already integrated (see `social/` and `yumkitchen-web/components/`). Superseded by `AGENTS.md` at the repo root. Kept for project-history reference only — do not follow as current instructions.

Prepared for an AI web-dev coder taking over the Yum website and JSON-driven asset integration work.
```

- [ ] **Step 4: Verify**

```bash
head -5 docs/archive/CODEX_HANDOFF.md
head -5 docs/archive/AI_WEB_DEV_HANDOFF.md
test -f CODEX_HANDOFF.md && echo "FAIL: still at root" || echo "OK"
test -f AI_WEB_DEV_HANDOFF.md && echo "FAIL: still at root" || echo "OK"
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: archive obsolete CODEX_HANDOFF and AI_WEB_DEV_HANDOFF docs"
```

---

### Task 6: Fix path references inside `tasks.md`

**Review tier:** light

**Files:**
- Modify: `tasks.md`

- [ ] **Step 1: Apply the six replacements**

Each `old_string` below is the exact current line (or line fragment); replace with `new_string` using the Edit tool (exact match required, not regex):

1. old: `` Full report: `docs/plans/2026-07-01-yum-upgrade-round2/run-report.md`. ``
   new: `` Full report: `docs/history/plans/2026-07-01-yum-upgrade-round2/run-report.md`. ``

2. old: `` Full report: `docs/plans/2026-06-30-yum-ship-and-elevate/run-report.md`. ``
   new: `` Full report: `docs/history/plans/2026-06-30-yum-ship-and-elevate/run-report.md`. ``

3. old: `` - [x] Cutover runbook: `yumkitchen-web/redirects.md` 301 audit + rollback path in DEPLOYMENT.md. ``
   new: `` - [x] Cutover runbook: `docs/redirects.md` 301 audit + rollback path in `docs/DEPLOYMENT.md`. ``

4. old: `` - [ ] Write the end report in `docs/plans/2026-06-30-yum-upgrades-improvements/run-report.md`. ``
   new: `` - [ ] Write the end report in `docs/history/plans/2026-06-30-yum-upgrades-improvements/run-report.md`. ``

5. old: `` Execution plan: `docs/plans/2026-06-30-yum-upgrades-improvements/manifest.md`. ``
   new: `` Execution plan: `docs/history/plans/2026-06-30-yum-upgrades-improvements/manifest.md`. ``

6. old: `` - [ ] DNS cutover runbook in `yumkitchen-web/DEPLOYMENT.md` ``
   new: `` - [ ] DNS cutover runbook in `docs/DEPLOYMENT.md` ``

- [ ] **Step 2: Verify no dangling old-path references remain**

```bash
grep -n "docs/plans/\|yumkitchen-web/redirects.md\|yumkitchen-web/DEPLOYMENT.md" tasks.md
```

Expected: no output.

- [ ] **Step 3: Add a one-line flag about PR #2**

Add near the top of `tasks.md`, directly below the `# Rebuild Task List` title:

```markdown
# Rebuild Task List

> Known stale branch: `brand-blue-pass` (PR #2 on GitHub) is 20 commits ahead but based on a commit before three shipped rounds — merging it as-is would delete since-shipped components and docs. Needs manual salvage of just the color-token intent, or closure. Do not merge as-is.
```

- [ ] **Step 4: Commit**

```bash
git add tasks.md
git commit -m "docs: fix tasks.md path references after reorg, flag stale PR #2"
```

---

### Task 7: Simplify `setup.sh` — remove dead external-reference-dir checks

**Review tier:** light

**Files:**
- Modify: `setup.sh`

**Context:** `setup.sh` currently checks for and conditionally seeds from `../05_docs/*` and `../06_handoff/data/*` — sibling folders from the original pre-git-tracked project scaffold that never exist in this repo (confirmed: the repo is now self-contained at `/Users/zsoskin/dev/yumkitchen-rebuild`, no sibling reference dirs). The seed files (`yumkitchen-web/lib/locations-seed.json`, `yumkitchen-web/lib/menu-seed.json`) already exist and are checked into git, so the copy-if-missing logic is permanently a no-op. Removing this removes confusing `WARN: missing reference` output for a future coder.

- [ ] **Step 1: Replace setup.sh with the trimmed version**

Replace the full file content with:

```bash
#!/usr/bin/env bash
# Bootstrap script for Codex (or any fresh container).
# Idempotent - safe to re-run.

set -e

echo "==> Verifying Node 20+"
if ! command -v node > /dev/null; then
  echo "ERROR: Node.js not found. Install Node 20+ first." >&2
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node 20+ required (found $NODE_MAJOR)" >&2
  exit 1
fi

echo "==> Installing npm dependencies in yumkitchen-web/"
cd yumkitchen-web
npm install --no-audit --no-fund
cd ..

echo "==> Installing global tools for verify.sh"
npm install -g --no-audit --no-fund lighthouse @axe-core/cli 2>/dev/null || true

echo "==> Setup complete. Run \`bash verify.sh\` to validate before each PR."
```

- [ ] **Step 2: Verify it's syntactically valid**

```bash
bash -n setup.sh && echo OK
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add setup.sh
git commit -m "chore: remove dead external-reference-dir checks from setup.sh"
```

---

### Task 8: Rewrite AGENTS.md as the single current entry point

**Review tier:** standard

**Files:**
- Modify: `AGENTS.md` (full rewrite)

- [ ] **Step 1: Replace AGENTS.md content**

```markdown
# AGENTS.md

Read this entire file before doing anything. This is the current, single contract for any AI coding agent (Codex, Cursor, Aider, Claude Code, etc.) working on this repo.

## Project

A rebuild of https://yumkitchen.com — a 4-location restaurant chain in the Twin Cities (St. Louis Park, Shady Oak/Minnetonka, St. Paul, Woodbury) — plus its sister brand https://patticake.com (national cake delivery + local pickup). Stack: Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS v4.

Both brand surfaces are served from this single codebase, distinguished by pathname (see `yumkitchen-web/lib/usePatticakeSurface.ts`), not by hostname — `proxy.ts` is currently a no-op passthrough.

This repo is self-contained and git-tracked (`github.com/zachringnight/yumkitchen-rebuild`). There are no external sibling reference folders to read — everything you need is inside this checkout.

## Repository layout

```
yumkitchen-rebuild/
├── AGENTS.md                  this file — the contract
├── README.md                  short human-facing orientation
├── tasks.md                   PR-by-PR task list — read this for the active/next task
├── setup.sh                   bootstraps a fresh environment
├── verify.sh                  full verification suite — must pass before every PR
├── docs/
│   ├── DEPLOYMENT.md           env vars, analytics events, launch/rollback runbook
│   ├── redirects.md            301/308 redirect + SEO-equity audit
│   ├── design-qa.md            latest design QA record
│   ├── archive/                 obsolete handoff docs — historical only, do not follow
│   ├── history/                 completed round run-reports + dated QA snapshots
│   └── superpowers/             design specs and implementation plans
├── social/                    Instagram template/export workspace (marketing assets, not app code)
└── yumkitchen-web/            THE APP — this is what you ship
    ├── app/, components/, lib/, public/
    ├── scripts/                build-time + E2E/audit scripts (a11y, links, smoke UI, content validation, motion audits)
    └── package.json
```

## Brand system (DO NOT IMPROVISE)

Source of truth: `yumkitchen-web/app/globals.css` `@theme` block. Current values:

- Primary red: `#b4212b` (`--color-brand-primary`). Bright variant: `#e03a3e`. Darker (AA-safe): `#8f1c24`. Deep: `#751821`. Also `--color-brand-red: #dc3439`.
- Ink dark: `#2d2d2d` · Body gray: `#736e6e` · Page bg: `#f3f3f3` · Cream: `#fff4f5` · Light blue: `#cae4fd` · Soft blue: `#aed2ef`
- Headings: Trocchi 400 (serif). Body, nav, buttons: Archivo Narrow 400 (sans, 700 on filled buttons)
- Lowercase headlines preserved exactly where the source uses lowercase
- Two button styles: `.btn-primary` (filled red, white text, bold) and `.btn-secondary` (outline, dark text)

If `globals.css` and this file ever disagree, `globals.css` wins — update this file to match.

## Hard rules (NEVER VIOLATE)

1. Preserve all 4 Toast order URLs exactly. They live in `yumkitchen-web/lib/locations.ts`. Do not rewrite, redirect, or wrap them.
2. Location slugs must stay: `/location/st-louis-park`, `/location/shady-oak`, `/location/saint-paul`, `/location/woodbury`. SEO equity depends on it.
3. Every location page carries `Restaurant` JSON-LD (`entityJsonLd()` from `lib/locations.ts`).
4. No em dashes anywhere in code, comments, or copy. Use hyphens, commas, or sentence breaks.
5. Headlines stay lowercase if the source uses lowercase ("made from scratch with love", "fresh and friendly food", etc.).
6. Do not invent menu items, prices, hours, or addresses. Pull from `lib/locations.ts` and `lib/menu.ts` (seeded from the checked-in `lib/locations-seed.json` / `lib/menu-seed.json`).
7. Every PR must pass `bash verify.sh` before requesting review.
8. One PR per task in `tasks.md`. Do not bundle.

## Task workflow

1. Read `tasks.md`. Find the next unchecked task.
2. Create a branch named after the task (e.g. `T-03-location-card-component`, or a short descriptive name for ad hoc work).
3. Implement inside `yumkitchen-web/` for app changes; docs changes go in `docs/`.
4. Run `bash verify.sh` locally. All checks must pass.
5. Commit. Push. Open a PR.
6. In the PR description, note what changed and why.

## Verification

`bash verify.sh` (run from the repo root) runs, in order:
- `npm run typecheck` (must pass)
- `npm run lint` (must pass)
- `npm run audit:motion` and `npm run audit:visual-motion` (motion governance — must pass)
- `npm run validate:content` (menu/location data integrity — must pass)
- `npm run build` (must succeed)
- `npm run smoke:ui`, `npm run audit:links`, `npm run a11y` against a locally started production server (a11y must report zero `serious`/`critical`)
- `npm run lh` (Lighthouse mobile, key pages — must score Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100)
- A grep for em dashes in the diff against `main` (must find none)

Failure on any check blocks the PR.

## Known open items

- PR #2 (`brand-blue-pass` branch) is stale — see the flag at the top of `tasks.md`. Do not merge as-is.
- See `tasks.md` for the current OPEN list (Zach-gated items like DNS cutover, live Resend key, GTM/GA4 confirmation) and Zach-data-gated items (dietary tags, location amenities, menu CMS, etc.).

## Owner context

The owner is Zach Soskin. Voice preferences: short sentences, direct, no fluff, no em dashes. Family business (Patti and Robbie Soskin). Brand voice is warm, lowercase, hospitality-forward.

## When in doubt

1. Read `docs/DEPLOYMENT.md` and `docs/redirects.md` for launch/ops context.
2. Read the most recent report under `docs/history/plans/` for what shipped last and why.
3. Grep the live code (`yumkitchen-web/app`, `yumkitchen-web/components`, `yumkitchen-web/lib`) — it is the source of truth, not any doc.
4. If still stuck, comment on the PR with the question. Do not guess.
```

- [ ] **Step 2: Verify no leftover references to old facts**

```bash
grep -n "Next.js 14\|E03A3E\|01_html\|05_docs\|06_handoff\|07_codex\|tailwind.config.ts" AGENTS.md
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: rewrite AGENTS.md as single current entry point"
```

---

### Task 9: Write the new root README.md

**Review tier:** standard

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

```markdown
# yum! kitchen & bakery — website rebuild

Next.js 16.2 rebuild of [yumkitchen.com](https://yumkitchen.com), a 4-location Twin Cities restaurant chain, and its sister brand [patticake.com](https://patticake.com) (national cake delivery). One codebase serves both, split by pathname — see `yumkitchen-web/lib/usePatticakeSurface.ts`.

## Start here

- **`AGENTS.md`** — the full contract for AI coding agents: stack, structure, brand tokens, hard rules, workflow. Read this first before making any change.
- **`tasks.md`** — the current task list. Find the next unchecked item here.
- **`docs/`** — supporting documentation:
  - `docs/DEPLOYMENT.md`, `docs/redirects.md`, `docs/design-qa.md` — current, live operational docs
  - `docs/archive/` — obsolete handoff docs, kept for project history only, do not follow as instructions
  - `docs/history/` — completed round run-reports and dated QA snapshots, reference only
  - `docs/superpowers/` — design specs and implementation plans

## Local development

```bash
bash setup.sh          # one-time bootstrap (Node 20+, npm install, global lighthouse/axe)
cd yumkitchen-web
npm run dev             # http://localhost:3000
```

## Before every PR

```bash
bash verify.sh
```

Runs typecheck, lint, motion audits, content validation, production build, smoke/link/a11y checks against a local server, and Lighthouse. Must end in `VERIFY PASSED`. Full rules in `AGENTS.md`.
```

- [ ] **Step 2: Verify**

```bash
test -f README.md && echo OK
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add root README.md as project entry point"
```

---

### Task 10: Full verification pass

**Review tier:** light

**Files:** none (verification only)

- [ ] **Step 1: Run the non-server checks**

```bash
cd /Users/zsoskin/dev/yumkitchen-rebuild/yumkitchen-web
npm run typecheck
npm run lint
npm run audit:motion
npm run validate:content
npm run build
cd ..
```

Expected: all five exit 0.

- [ ] **Step 2: Confirm the repo tree matches the target structure**

```bash
find . -path ./node_modules -prune -o -path ./.git -prune -o -path './yumkitchen-web/node_modules' -prune -o -path './yumkitchen-web/.next' -prune -o -type d -print | sort
```

Expected: no `scripts/` at root, no `docs/plans/`, no `docs/qa/` at root (only under `docs/history/`), no `yumkitchen-web/docs/`, no `yumkitchen-web/DEPLOYMENT.md` etc. (moved into `docs/`).

- [ ] **Step 3: Run the full verify.sh if Chrome/Lighthouse are available locally**

```bash
cd /Users/zsoskin/dev/yumkitchen-rebuild
bash verify.sh
```

Expected: ends in `VERIFY PASSED`. (If Chrome/Lighthouse aren't installed in this environment, Step 1's checks are sufficient confirmation that the path fixes work — note this explicitly rather than claiming full verify.sh passed if it wasn't actually run.)

- [ ] **Step 4: Push the branch and confirm CI**

```bash
git push -u origin HEAD
gh pr create --title "chore: reorganize repo for AI-coder clarity" --body "$(cat <<'EOF'
## Summary
- Consolidate three overlapping handoff docs into one current AGENTS.md; archive the other two
- Merge split scripts/ and docs/ folders into one location each
- Move current ops docs (DEPLOYMENT.md, redirects.md, design-qa.md) out of yumkitchen-web/ into docs/
- Move completed round run-reports and dated QA snapshots into docs/history/
- Add root README.md
- Fix stale facts (Next.js version, brand color, dead paths) in AGENTS.md
- Flag PR #2 (brand-blue-pass) as stale in tasks.md

## Test plan
- [x] npm run typecheck / lint / audit:motion / validate:content / build all pass
- [ ] bash verify.sh reaches VERIFY PASSED (full suite incl. Lighthouse)
EOF
)"
```

Note: this is a repo-wide structural change touching every doc file — confirm with the repo owner before pushing/opening the PR if not already agreed.
