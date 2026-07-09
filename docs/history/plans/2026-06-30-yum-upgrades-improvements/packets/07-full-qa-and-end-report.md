# Task 07: Full QA And End Report

**Wave:** 5
**Depends on:** 06

## Files
- Create: `docs/plans/2026-06-30-yum-upgrades-improvements/run-report.md`
- Modify: `yumkitchen-web/DEPLOYMENT.md` only if QA finds missing release steps.
- Create QA screenshots under `yumkitchen-web/public` only if the project already expects public QA artifacts. Otherwise store local screenshots outside the app and reference paths in the report.

## Interfaces
- Consumes: reports from tasks 01 through 06.
- Produces: one end-of-run report in the format from `goalplan/references/end-review.md`.

## Steps
- [ ] Run full verification.
  Run from `07_codex`: `bash verify.sh`
  Expected: `VERIFY PASSED`.
- [ ] Run visual QA on desktop and mobile for these routes:
  `/`, `/menu`, `/order`, `/order-a-cake`, `/patticake`, `/catering`, `/location/st-louis-park`, `/location/woodbury`.
- [ ] Verify route redirects.
  Check `/patticake-national-delivery`, `/featured-menu`, `/order-now`, and `/jobs/general-job-description`.
- [ ] Verify host behavior if possible.
  Check `patticake.com/` host-mapped locally rewrites to Patticake content and shell.
- [ ] Capture the final git diff summary.
  Run: `git status --short --branch && git diff --stat origin/main...HEAD`
- [ ] Write `run-report.md`.
  Include result, done-checks, concerns, changes, branch, tests, build, Lighthouse scores, and the eyeball list.
- [ ] Do not merge. Offer options: merge, open PR, keep branch, revise, discard.

## Done-check
Run: `rg -n "Result|Done-checks|Concerns|Eyeball list|Options" docs/plans/2026-06-30-yum-upgrades-improvements/run-report.md`
Expected: all headings are found.

## Report
DONE if full verify passes and the report is complete. DONE_WITH_CONCERNS if only manual production checks remain, such as real Resend delivery, GTM DebugView, DNS, or live Toast click tracking.
