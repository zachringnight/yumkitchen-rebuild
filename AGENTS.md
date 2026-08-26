# Yum Kitchen and Patticake agent guide

## Start here

The user request is the active task. Read this file and `docs/CURRENT.md`. Do not load the archived task ledger, dated run reports, or historical plans unless the task names one specific file.

Inspect `git status --short` before editing and preserve unrelated work. App changes belong in `yumkitchen-web/`.

## Non-negotiable product rules

- Preserve the four Toast order URLs in `yumkitchen-web/lib/locations.ts` exactly.
- Preserve the four location slugs and their `Restaurant` JSON-LD.
- Never invent menu items, prices, hours, addresses, dish descriptions, or real-person details. Use the checked-in source data.
- Food and cake photos have descriptive alt text but no visible caption.
- Brand tokens in `yumkitchen-web/app/globals.css` are the source of truth. Do not improvise a new visual system.
- Preserve lowercase headlines where the source uses lowercase.
- No em dashes in code, comments, docs, commit messages, or site copy.
- Do not send messages, change DNS, merge, deploy, or mutate production data unless the current request explicitly authorizes it.

Read `docs/DESIGN_TOOLKIT_AI_CODER.md` only for visual work. Read `social/START-HERE.md` only for social asset work.

## Work and review flow

1. Start from current `main` on one branch for the coherent objective.
2. Use targeted checks while implementing.
3. Commit coherent changes and maintain one draft PR. Do not create serial checkpoint or review-fix PRs.
4. Use a `preview-*` branch only when a Vercel browser preview is needed.
5. Prefer squash merge after checks and conversations are complete.

## Verification tiers

During implementation, run the closest command for the changed surface.

Before a normal runtime PR is ready:

```bash
bash scripts/verify-standard.sh
```

Before release, routing, authentication, major interaction, or visual approval work:

```bash
bash verify.sh
```

CI runs the full deterministic gate for runtime pull requests. Documentation-only changes require `git diff --check`, not browser installation, Lighthouse, or the full release suite.

## Current work

`tasks.md` is now a short router. The pre-cleanup task ledger is preserved under `docs/history/` and is historical unless Zach explicitly reactivates an item.
