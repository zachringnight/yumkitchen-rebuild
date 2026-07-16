# AGENTS.md

Read this entire file before doing anything. This is the current, single contract for any AI coding agent (Codex, Cursor, Aider, Claude Code, etc.) working on this repo.

## Project

A rebuild of https://yumkitchen.com, a 4-location restaurant chain in the Twin Cities (St. Louis Park, Shady Oak/Minnetonka, St. Paul, Woodbury), plus its sister brand https://patticake.com (national cake delivery + local pickup). Stack: Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS v4.

Both brand surfaces are served from this single codebase, distinguished by pathname (see `yumkitchen-web/lib/usePatticakeSurface.ts`), not by hostname. `proxy.ts` holds the host-based routing (`lib/hostRouting.ts`) that will let `yumkitchen.com` serve the restaurant home at `/` after DNS cutover; it is gated behind `NEXT_PUBLIC_YUM_HOST_ROUTING` (unset/off today, so current behavior is unchanged) - see `docs/history/plans/2026-07-12-host-brand-routing/run-report.md` and the cutover step in `docs/DEPLOYMENT.md`.

This repo is self-contained and git-tracked (`github.com/zachringnight/yumkitchen-rebuild`). There are no external sibling reference folders to read; everything you need is inside this checkout.

## Repository layout

```
yumkitchen-rebuild/
├── AGENTS.md                  this file, the contract
├── README.md                  short human-facing orientation
├── tasks.md                   PR-by-PR task list, read this for the active/next task
├── setup.sh                   bootstraps a fresh environment
├── verify.sh                  full verification suite, must pass before every PR
├── docs/
│   ├── DEPLOYMENT.md           env vars, analytics events, launch/rollback runbook
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

If `globals.css` and this file ever disagree, `globals.css` wins. Update this file to match.

## Design toolkit

For new visual or creative work, read `docs/DESIGN_TOOLKIT_AI_CODER.md` after this contract and before editing. It captures the current photo-led baby-blue and red direction. It does not override the hard rules, data contracts, or token source of truth above.

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

1. Run `bash scripts/check-repo-freshness.sh` before reading or editing anything. It fails on Zach's machine if the checkout is not `/Users/zsoskin/dev/yumkitchen-rebuild`, if the remote is wrong, or if the current branch is behind `origin/main`.
2. Read `tasks.md`. Find the next unchecked task.
3. Create a branch named after the task (e.g. `T-03-location-card-component`, or a short descriptive name for ad hoc work).
4. Implement inside `yumkitchen-web/` for app changes; docs changes go in `docs/`.
5. Run `bash verify.sh` locally. All checks must pass.
6. Commit. Push. Open a PR.
7. In the PR description, note what changed and why.

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

- See `tasks.md` for the current OPEN list (Zach-gated items like DNS cutover, live Resend key, GTM/GA4 confirmation) and Zach-data-gated items (dietary tags, location amenities, menu CMS, etc.).

## Owner context

The owner is Zach Soskin. Voice preferences: short sentences, direct, no fluff, no em dashes. Family business (Patti and Robbie Soskin). Brand voice is warm, lowercase, hospitality-forward.

## When in doubt

1. Read `docs/DEPLOYMENT.md` and `docs/redirects.md` for launch/ops context.
2. Read the most recent report under `docs/history/plans/` for what shipped last and why.
3. Grep the live code (`yumkitchen-web/app`, `yumkitchen-web/components`, `yumkitchen-web/lib`). It is the source of truth, not any doc.
4. If still stuck, comment on the PR with the question. Do not guess.
