# AGENTS.md

Read this entire file before doing anything. This is the current, single contract for any AI coding agent (Codex, Cursor, Aider, Claude Code, etc.) working on this repo.

## Project

A rebuild of https://yumkitchen.com, a 4-location restaurant chain in the Twin Cities (St. Louis Park, Shady Oak/Minnetonka, St. Paul, Woodbury), plus its sister brand https://patticake.com (national cake delivery + local pickup). Stack: Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS v4.

Both brand surfaces are served from this single codebase, distinguished by pathname (see `yumkitchen-web/lib/usePatticakeSurface.ts`), not by hostname. `proxy.ts` holds host-based routing (`lib/hostRouting.ts`) gated behind `NEXT_PUBLIC_YUM_HOST_ROUTING`. The flag is unset and stays unset, so this code is inert and current behavior is unchanged. **No DNS cutover is planned or scheduled**, so do not treat the flag as pending work or a launch gate; see `docs/history/plans/2026-07-12-host-brand-routing/run-report.md` for what it does and the reference-only cutover section in `docs/DEPLOYMENT.md`.

This repo is self-contained and git-tracked (`github.com/zachringnight/yumkitchen-rebuild`). There are no external sibling reference folders to read; everything you need is inside this checkout.

## Repository layout

```
yumkitchen-rebuild/
├── AGENTS.md                  this file, the contract
├── README.md                  short human-facing orientation
├── tasks.md                   current round first, lower unchecked lists are historical only
├── setup.sh                   bootstraps a fresh environment
├── verify.sh                  full verification suite, must pass before every PR
├── docs/
│   ├── DEPLOYMENT.md           env vars, analytics events, launch/rollback runbook
│   ├── HANDOFF_CURRENT.md       stable current branch, review, package, and gate handoff
│   ├── redirects.md            301/308 redirect + SEO-equity audit
│   ├── design-qa.md            latest design QA record
│   ├── archive/                 obsolete handoff docs, historical only, do not follow
│   ├── history/                 completed round run-reports + dated QA snapshots
│   └── superpowers/             design specs and implementation plans
├── social/                    Instagram template/export workspace (marketing assets, not app code)
└── yumkitchen-web/            THE APP, this is what you ship
    ├── app/, components/, lib/, public/
    ├── scripts/                build-time + E2E/audit scripts (a11y, links, smoke UI, content validation, motion audits)
    └── package.json
```

## Brand system (DO NOT IMPROVISE)

Source of truth: `yumkitchen-web/app/globals.css` `@theme` block. Current values:

- Primary red: `#b4212b` (`--color-brand-primary`). Bright variant: `#e03a3e`. Darker (AA-safe): `#8f1c24`. Deep: `#751821`. Also `--color-brand-red: #dc3439`.
- Ink dark: `#2d2d2d` · Body gray: `#736e6e` · Cream (the brand's warm identity color, default page/section background): `#fffdf7` · Light blue: `#cae4fd` · Soft blue: `#aed2ef`
- Neutral gray `--color-page` (`#f3f3f3`, Tailwind `bg-page`) exists ONLY for small functional UI fills (form-input backgrounds, an unselected-option-tile state) - never use it as a page or section background. It read as flat and washed-out when it was (see `docs/history/plans/2026-07-14-brand-warmth-color-pass/run-report.md`); use `cream` or `blue-tint` instead.
- Headings: Trocchi 400 (serif). Body, nav, buttons: Archivo Narrow 400 (sans, 700 on filled buttons)
- Lowercase headlines preserved exactly where the source uses lowercase
- Two button styles: `.btn-primary` (filled red, white text, bold) and `.btn-secondary` (outline, dark text)
- **Wave edge (approved motif, added 2026-07-26 with Zach's sign-off).** The red band closes into the section below with a two-tone rolling wave: a soft-blue crest over a fill matching the next section's background. It mirrors the flourish on the live `yumkitchen.com` and reads as a bakery-ticket edge. Implementation is `.red-band-curve` in `globals.css`, an inline data-URI SVG tiled with `repeat-x`. This is a **shaped section edge, not a decorative gradient**, and it is the only such motif defined; do not extend it into badges, stickers, tape, or ticket stubs, which the design toolkit still forbids. Two constraints: the SVG fills are hardcoded hex because a data URI cannot read CSS custom properties, so they must be updated by hand if `--color-blue-soft` or `--color-cream` change or if the band is ever placed above a non-cream section; and the fills are drawn past the viewBox bottom on purpose, because ending them flush leaves a sub-pixel hairline of the band bleeding through.

If `globals.css` and this file ever disagree, `globals.css` wins. Update this file to match.

## Design toolkit

For new visual or creative work, read `docs/DESIGN_TOOLKIT_AI_CODER.md` after this contract and before editing. It captures the current photo-led baby-blue and red direction. It does not override the hard rules, data contracts, or token source of truth above.

For any social or creative asset work, read `social/START-HERE.md` before opening, rebuilding, or handing off a pack. It is the source-of-truth router for the active production pack, the current `/asset-gallery` review surface, and preserved historical folders that must not be rerendered or published.

## Hard rules (NEVER VIOLATE)

1. Preserve all 4 Toast order URLs exactly. They live in `yumkitchen-web/lib/locations.ts`. Do not rewrite, redirect, or wrap them.
2. Location slugs must stay: `/location/st-louis-park`, `/location/shady-oak`, `/location/saint-paul`, `/location/woodbury`. SEO equity depends on it.
3. Every location page carries `Restaurant` JSON-LD (`entityJsonLd()` from `lib/locations.ts`).
4. No em dashes anywhere in code, comments, or copy. Use hyphens, commas, or sentence breaks.
5. Headlines stay lowercase if the source uses lowercase ("made from scratch with love", "fresh and friendly food", etc.).
6. Do not invent menu items, prices, hours, or addresses. Pull from `lib/locations.ts` and `lib/menu.ts` (seeded from the checked-in `lib/locations-seed.json` / `lib/menu-seed.json`).
7. Do not describe a dish in words yumkitchen.com does not use. Dish copy comes from the seed `description`, expanded only from its `w/` and `&` shorthand. A seed entry with no description gets no description on the site: ship the name and price alone rather than writing one.
8. Food and cake photos carry no visible caption. Alt text describes the photo; nothing else names or characterizes what is in the frame. `npm run audit:motion` enforces this.
9. Every PR must pass `bash verify.sh` before requesting review.
10. A PR may carry a whole round or a coherent group of tasks. Keep each task a separate commit so it stays individually reviewable and revertable. Do not mix unrelated rounds in one PR.

## Task workflow

1. Run `bash scripts/check-repo-freshness.sh` before reading or editing anything. It fails on Zach's machine if the checkout is not `/Users/zsoskin/dev/yumkitchen-rebuild`, if the remote is wrong, or if the current branch is behind `origin/main`.
2. Read the top current-round section in `tasks.md`. Do not take unchecked work from a section labeled historical.
3. Create a branch named after the round or the task group (e.g. `visual-creative-audit-fixes`, `T-03-location-card-component`).
4. Implement inside `yumkitchen-web/` for app changes; docs changes go in `docs/`.
5. Commit per task, with the task id from `tasks.md` in the subject.
6. Run `bash verify.sh` locally. All checks must pass.
7. Push. Open a PR. In the description, note what changed and why, task by task.

### Running a round with parallel agents

A round can be split across several agents working the same branch at once. Rules that keep it safe:

- Partition by file, not by priority. Two agents must never be able to edit the same file. Assign each agent an explicit file allowlist up front.
- Do not use git worktrees for this repo. A worktree has no `node_modules`, and `scripts/check-repo-freshness.sh` hard-fails outside `/Users/zsoskin/dev/yumkitchen-rebuild`, so neither `verify.sh` nor a build will run there.
- Agents edit and self-check only. The coordinator owns all git operations (branch, commit, push) and runs `verify.sh` once per wave, not once per agent. `verify.sh` builds and runs Lighthouse, so concurrent runs fight over the port and the build directory.
- Shared files (`lib/site.ts`, `app/globals.css`, `tasks.md`, `AGENTS.md`) belong to the coordinator or to exactly one agent per wave.

## Verification

`bash verify.sh` (run from the repo root) runs, in order:
- `bash scripts/check-repo-freshness.sh` (canonical checkout, remote, branch, and `origin/main` freshness)
- `npm run typecheck` (must pass)
- `npm run lint` (must pass)
- `npm run audit:motion` and `npm run audit:visual-motion` (motion governance, must pass)
- `npm run validate:content` (menu/location data integrity, must pass)
- `npm run build` (must succeed)
- `npm run smoke:ui`, `npm run audit:links`, `npm run a11y` against a locally started production server (a11y must report zero `serious`/`critical`)
- `npm run lh` (Lighthouse mobile, key pages, must score Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100)
- A grep for em dashes in the diff against `main` (must find none)

Failure on any check blocks the PR.

## Known open items

- See `docs/HANDOFF_CURRENT.md` and the top current-round section in `tasks.md` for open owner gates. Lower unchecked lists in `tasks.md` are historical only.

## Owner context

The owner is Zach Soskin. Voice preferences: short sentences, direct, no fluff, no em dashes. Family business (Patti and Robbie Soskin). Brand voice is warm, lowercase, hospitality-forward.

## When in doubt

1. Read `docs/HANDOFF_CURRENT.md`, `docs/DEPLOYMENT.md`, and `docs/redirects.md` for current launch and operations context.
2. Read the most recent report under `docs/history/plans/` for what shipped last and why.
3. Grep the live code (`yumkitchen-web/app`, `yumkitchen-web/components`, `yumkitchen-web/lib`). It is the source of truth, not any doc.
4. If still stuck, comment on the PR with the question. Do not guess.
