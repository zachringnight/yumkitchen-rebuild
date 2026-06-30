# Packet 01 - Branch + baseline + before-screenshots

Wave: 0
Depends on: none

## Objective
Create the working branch off `main`, prove the build is green as a baseline, and capture before-screenshots so the design elevation has a documented starting point.

## Files
- New branch: `ship-and-elevate-2026-06-30`
- New dir: `docs/plans/2026-06-30-yum-ship-and-elevate/before/`

## Consumes
- Clean `main` at `b425687` (PR #3 merged).

## Produces
- Branch `ship-and-elevate-2026-06-30` checked out.
- Baseline `verify.sh` result recorded in `before/verify-baseline.txt`.
- Before screenshots: `home-desktop.png`, `home-mobile.png`, `menu-mobile.png`, `patticake-desktop.png`, `patticake-mobile.png`, `order-mobile.png` (mobile = 390px).

## Steps
1. From `07_codex/`: `git checkout main && git pull && git checkout -b ship-and-elevate-2026-06-30`.
2. `cd yumkitchen-web && npm install --no-audit --no-fund`.
3. From `07_codex/`: `bash verify.sh | tee docs/plans/2026-06-30-yum-ship-and-elevate/before/verify-baseline.txt`. It must end in `VERIFY PASSED`.
4. With the prod server up (verify.sh starts one, or `npm run start`), capture the six screenshots via Playwright MCP at desktop (1280) and mobile (390) into `before/`.
5. Commit: `chore: baseline before ship-and-elevate`.

## Verification
```
grep -q "VERIFY PASSED" docs/plans/2026-06-30-yum-ship-and-elevate/before/verify-baseline.txt && ls docs/plans/2026-06-30-yum-ship-and-elevate/before/*.png | wc -l
```
Expected: exit 0 and `6`.

## Done-signal
`DONE` with branch name and baseline Lighthouse home numbers. `BLOCKED` if verify.sh fails on a clean main (do not proceed to elevation on a red baseline).
