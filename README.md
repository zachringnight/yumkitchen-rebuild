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
