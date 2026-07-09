# Packet 10 - Full verify + after-screenshots + end report

Wave: 3
Depends on: 07, 08, 09

## Objective
Close the run. One full green verify, before/after screenshots side by side, and the end report Zach reviews at the second and final gate.

## Files
- `docs/plans/2026-06-30-yum-ship-and-elevate/after/` (six screenshots, same shots as P01)
- `docs/plans/2026-06-30-yum-ship-and-elevate/run-report.md`
- Update `07_codex/tasks.md` finishing checklist

## Consumes
- All prior packet done-signals and verify/log artifacts.

## Produces
- `VERIFY PASSED` evidence + the end report.

## Steps
1. From `07_codex/`: `bash verify.sh`. Require `VERIFY PASSED`.
2. Capture the six after-screenshots (home/menu/patticake/order, desktop + mobile 390px) into `after/`.
3. Write `run-report.md` in the goalplan end-review format:
   - Result + full verify outcome.
   - Done-check table per packet with any failure inline.
   - Before/after screenshot pairs.
   - Logged concerns (DONE_WITH_CONCERNS items).
   - Diff/test/build summary (files changed, insertions/deletions, Lighthouse per page, axe count).
   - Eyeball list: DNS cutover, Resend key, Patticake checkout URL, any proceed-on assumption.
   - Options: open PR, merge after review, keep branch, revise, discard.
4. Update `tasks.md` to reflect this round complete.

## Verification
```
grep -q "VERIFY PASSED" <(bash verify.sh 2>&1 | tail -5) && ls docs/plans/2026-06-30-yum-ship-and-elevate/after/*.png | wc -l
```
Expected: exit 0 and `6`.

## Done-signal
`DONE` with the report path and the recommended option. This is the only packet that ends the run.
