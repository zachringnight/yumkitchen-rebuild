# AGENTS.md

Read this entire file before doing anything. This file is the contract for any AI coding agent (Codex, Cursor, Aider, Claude Code, etc.) working on this rebuild.

## Project

A rebuild of https://yumkitchen.com - a 4-location restaurant chain in the Twin Cities (St. Louis Park, Shady Oak/Minnetonka, St. Paul, Woodbury). The current site is WordPress + Themeco Pro + Cornerstone. Target stack for the rebuild is Next.js 14 (App Router) + TypeScript + Tailwind CSS.

The repo at `yumkitchen-web/` is the rebuild. Everything outside it is reference material.

## Repository layout

```
07_codex/
├── AGENTS.md                          (this file)
├── CODEX_HANDOFF.md                   How to start a Codex task
├── tasks.md                           PR-by-PR task list
├── setup.sh                           Bootstraps the dev container
├── verify.sh                          Runs full verification suite
├── yumkitchen-web/                    THE REBUILD - this is what you ship
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
└── scripts/
    ├── lighthouse_baseline.sh         Per-page LH (run via npm run lh)
    ├── a11y_audit.js                  Headless axe-core (npm run a11y)
    └── visual_diff.sh                 Diff against 02_screenshots/

Reference (read but DO NOT MODIFY):
../01_html/                            Rendered HTML snapshots
../02_screenshots/                     Visual reference (desktop + mobile)
../03_assets/                          Original images + PDFs
../04_data/                            Crawl artifacts (a11y_summary, link_graph)
../05_docs/                            Specs you must follow
    YumKitchen_RebuildSpec_v1.md       The main spec
    YumKitchen_ChromeReview_v1.md      Live browser corrections (PRECEDENCE over Playwright)
    YumKitchen_Improvements_v1.md      What to fix while you build
../06_handoff/                         Claude Code variant (you can ignore)
```

## Precedence when sources conflict

1. ChromeReview_v1 (live browser observations)
2. RebuildSpec_v1
3. 01_html/ snapshots
4. 02_screenshots/ PNGs

If ChromeReview says the live site has 3 CTAs above the fold and Playwright shows none, the live observation wins.

## Brand system (DO NOT IMPROVISE)

- Primary red: `#E03A3E` (Tailwind: `brand-primary`). AA-safe darker variant: `#C72830` (Tailwind: `brand-primary-darker`)
- Ink dark: `#2D2D2D` · Body gray: `#736E6E` · Page bg: `#F3F3F3` · Cream: `#FFF4F5`
- Headings: Trocchi 400 (serif). Body, nav, buttons: Archivo Narrow 400 (sans, 700 on filled buttons)
- Lowercase headlines preserved exactly as in source
- Two button styles: `btn-primary` (filled red, white text, bold) and `btn-secondary` (outline, dark text)

## Hard rules (NEVER VIOLATE)

1. Preserve all 4 Toast order URLs exactly. They are in `lib/locations.ts`. Do not rewrite, redirect, or wrap them.
2. Slugs must match: `/location/st-louis-park`, `/location/shady-oak`, `/location/saint-paul`, `/location/woodbury`. SEO equity depends on it.
3. Add `Restaurant` JSON-LD on every location page (use `entityJsonLd()` from `lib/locations.ts`).
4. No em dashes anywhere in code, comments, or copy. Use hyphens, commas, or sentence breaks.
5. Headlines stay lowercase if the source uses lowercase ("made from scratch with love", "fresh and friendly food", etc.).
6. Do not invent menu items, prices, hours, or addresses. Pull from `lib/locations.ts` and `lib/menu.ts` (seeded from `../06_handoff/data/menu_seed.json`).
7. Every PR must pass `bash verify.sh` before requesting review.
8. One PR per task in `tasks.md`. Do not bundle.

## Task workflow

1. Read `tasks.md`. Find the next unchecked task.
2. Create a branch named after the task ID (e.g. `T-03-location-card-component`).
3. Implement strictly inside `yumkitchen-web/`. Do not touch reference dirs.
4. Run `bash verify.sh` locally. All checks must pass.
5. Commit. Push. Open a PR. Title: `[T-XX] {task name}`.
6. In the PR description, paste the relevant section of `tasks.md` so the reviewer knows the acceptance criteria.

## Verification

`bash verify.sh` runs:
- `npm run typecheck` (must pass)
- `npm run lint` (must pass)
- `npm run build` (must succeed)
- `npm run a11y` (axe-core against all built pages - must report zero `serious` or `critical`)
- `npm run lh` (Lighthouse mobile, key pages - must score Perf >= 90, A11y >= 95, BP >= 95, SEO = 100)
- A grep for em dashes in the diff (must find none)

Failure on any check blocks the PR.

## Owner context

The owner is Zach Soskin. Voice preferences: short sentences, direct, no fluff, no em dashes. Family business (Patti and Robbie Soskin). Brand voice is warm, lowercase, hospitality-forward.

## When in doubt

1. Read `../05_docs/YumKitchen_RebuildSpec_v1.md` (full spec).
2. Read `../05_docs/YumKitchen_ChromeReview_v1.md` (live corrections).
3. Grep `../01_html/` for exact current copy.
4. Cross-reference `../02_screenshots/` for visual layout.
5. If still stuck, comment on the PR with the question. Do not guess.
