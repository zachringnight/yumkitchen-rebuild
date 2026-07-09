# Task 01: Baseline State And Task Map

**Wave:** 1
**Depends on:** none

## Files
- Create: `docs/plans/2026-06-30-yum-upgrades-improvements/run-notes.md`
- Modify: `tasks.md`

## Interfaces
- Consumes: current branch `checkpoint/patticake-design-2026-06-30`, commit `153084a wip: preserve patticake design pass`.
- Produces: a current task map that replaces the stale scaffold-first task sequence with the finishing sequence in this manifest.

## Steps
- [ ] Confirm repo state.
  Run: `git status --short --branch && git log --oneline --decorate --max-count=5`
  Expected: branch is `checkpoint/patticake-design-2026-06-30`, worktree is clean except the plan if it has not been committed.
- [ ] Record the preserved checkpoint and known verification result in `run-notes.md`.
  Include: branch, checkpoint commit, full verify result from June 30, known failure `Lighthouse Perf=85 A11y=100 BP=100 SEO=100`.
- [ ] Update `tasks.md` so it reflects the current app state.
  Replace the old scaffold-first workflow with a short status note and a current finishing checklist aligned to packets 02 through 07.
- [ ] Do not delete historical task entries unless Zach explicitly asks. Move stale task details under a clearly labeled `Historical scaffold task list` heading if needed.

## Done-check
Run: `rg -n "checkpoint/patticake-design-2026-06-30|Lighthouse Perf=85|Current finishing checklist" docs/plans/2026-06-30-yum-upgrades-improvements/run-notes.md tasks.md`
Expected: all three strings are found.

## Report
DONE unless the branch is not the saved checkpoint or `tasks.md` contains newer user edits that conflict with this packet.
