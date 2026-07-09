# Repo reorganization for AI-coder clarity — design

Date: 2026-07-09

## Problem

The repo grew through three shipped rounds plus two genesis-era handoff docs, and now has:

- Three overlapping root "read me first" docs (`AGENTS.md`, `CODEX_HANDOFF.md`, `AI_WEB_DEV_HANDOFF.md`) written for different AI tools at different points in the project's life, each stale in different ways: `AGENTS.md` cites Next.js 14 (actual: 16.2.9), the wrong brand red, and references sibling folders (`../01_html`, `../05_docs`, `../06_handoff`, etc.) that don't exist in this repo. `CODEX_HANDOFF.md` is entirely about kicking off the first task (`T-01`), long shipped. `AI_WEB_DEV_HANDOFF.md` hardcodes the dead absolute path `/Users/zsoskin/YumKitchen_Rebuild/07_codex/...` throughout.
- Two `scripts/` folders (root, `yumkitchen-web/scripts/`) and two `docs/` folders (root, `yumkitchen-web/docs/`) — no obvious reason to guess which one matters for a given task.
- Three current, live operational docs (`yumkitchen-web/DEPLOYMENT.md`, `redirects.md`, `design-qa.md`) sitting inside the app folder, mixed in with app config.
- Historical run-reports (`docs/plans/*`, three completed rounds) and dated pre-launch QA snapshots (`docs/qa/*`) sitting at the same level as anything current, with no signal that they're finished work rather than active instructions.
- No root `README.md` — no single, obvious entry point.

No branch/worktree issues block this: PR #8 (clean, current) is merged. PR #2 (`brand-blue-pass`) is badly stale (20 commits ahead, but based on a commit from before three shipped rounds — would delete large amounts of shipped work if merged as-is) and is left open, untouched, flagged in the new docs as needing manual salvage or closure later.

## Goal

Reorganize the repo so a new AI coder (or human) can land in the repo, read one entry point, and know exactly where current instructions, current ops docs, and historical record live — with the facts in what they read being true.

## Scope

Both structure and content: move/rename/consolidate files, **and** correct stale facts in the docs that remain live (Next.js version, brand color, dead paths, repo layout description). Historical docs that move into an archive/history location keep their original text unchanged — they're a frozen record, not living instructions.

## Target structure

```
yumkitchen-rebuild/
├── README.md                 NEW — orientation: what this is, where to start, quick links
├── AGENTS.md                  REWRITTEN — single current contract for AI coders
├── tasks.md                    kept at root; internal path references updated
├── setup.sh                    kept; dead external-reference-dir warnings removed
├── verify.sh                   kept as-is (already path-agnostic via ROOT_DIR/APP_DIR)
├── .github/, .gitignore, .vercelignore   unchanged
├── docs/
│   ├── archive/               NEW
│   │   ├── CODEX_HANDOFF.md          moved from root, unchanged, header note added
│   │   └── AI_WEB_DEV_HANDOFF.md     moved from root, unchanged, header note added
│   ├── history/                NEW
│   │   ├── plans/                     moved from docs/plans/ (3 completed rounds), unchanged
│   │   └── qa/                        moved from docs/qa/ (3 dated snapshots), unchanged
│   ├── superpowers/            MERGED — root docs/superpowers/ + yumkitchen-web/docs/superpowers/
│   │   ├── plans/
│   │   └── specs/
│   ├── DEPLOYMENT.md           moved from yumkitchen-web/ (current, live)
│   ├── redirects.md            moved from yumkitchen-web/ (current, live)
│   └── design-qa.md            moved from yumkitchen-web/ (current QA record)
├── social/                     unchanged (render script already resolves here correctly)
└── yumkitchen-web/             pure app: app/, components/, lib/, public/, config
    └── scripts/                MERGED — 4 root E2E/audit scripts join the 3 already here
        ├── audit-motion.mjs
        ├── audit-visual-motion.mjs
        ├── render-instagram-templates.mjs
        ├── a11y_audit.js        moved from root scripts/
        ├── link_audit.js        moved from root scripts/
        ├── smoke_ui.js          moved from root scripts/
        └── validate_content.js  moved from root scripts/
```

Root `scripts/` folder is removed once its contents move.

## Mechanical fixes (required for things to still run)

- `yumkitchen-web/package.json`: 4 script paths change from `../scripts/X.js` to `scripts/X.js` (`validate:content`, `smoke:ui`, `audit:links`, `a11y`).
- `tasks.md`: update its own references — `docs/plans/...` → `docs/history/plans/...`, `yumkitchen-web/redirects.md` → `docs/redirects.md`, `yumkitchen-web/DEPLOYMENT.md` → `docs/DEPLOYMENT.md`.
- `yumkitchen-web/DEPLOYMENT.md`'s internal reference to `redirects.md` stays valid (both move into `docs/` together, same directory).
- Historical docs under `docs/history/` and `docs/archive/` **keep their original path references as written** — no edits to their body text beyond the short header note on the two archived handoff docs.

## Content rewrite: AGENTS.md

Single current entry point replacing all three old handoff docs. Contents:

- Project summary (4-location Twin Cities restaurant chain, Next.js 16.2 rebuild, two brand surfaces via pathname not hostname)
- Corrected repo layout (no phantom sibling folders — this repo is self-contained)
- Corrected brand tokens pulled from `yumkitchen-web/app/globals.css` (current reds: `#b4212b` primary / `#e03a3e` bright / `#dc3439` red, ink/body/cream/blue tokens, Trocchi + Archivo Narrow)
- Hard rules that are still true today: preserve the 4 Toast order URLs, location slugs, `Restaurant` JSON-LD per location, no em dashes, lowercase headlines where source used them, don't invent menu/location data, `bash verify.sh` must pass, one PR per task
- Current workflow: read `tasks.md` for the active/next task, current docs live in `docs/`, historical record in `docs/history/` and `docs/archive/`
- One-line flag on PR #2 (`brand-blue-pass`): stale, needs manual salvage or closure, do not merge as-is

## Content: new README.md

Short (front-door) orientation, not a duplicate of AGENTS.md: what the project is, the two live domains, pointer to `AGENTS.md` as the detailed contract, pointer to `tasks.md` for current work, pointer to `docs/` for supporting material, one line each on `docs/archive/` and `docs/history/` explaining they're historical.

## Out of scope

- No code changes inside `yumkitchen-web/app`, `components`, `lib`.
- No rewriting of historical docs' content/facts (only the two archived handoff docs get a one-line header note).
- No action on PR #2 beyond a documentation flag.
- No deletion of the `brand-blue-pass` branch.

## Verification

After the moves: `bash verify.sh` from repo root must still reach `VERIFY PASSED` (confirms `package.json` script paths and `verify.sh` still resolve correctly, since scripts moved and paths changed). `git status` reviewed before commit to confirm only intended moves/edits are staged.
