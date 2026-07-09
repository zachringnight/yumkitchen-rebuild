# Codex Handoff

> **Historical.** This describes kicking off the very first task (`T-01`) at project scaffold time. That work shipped long ago. Superseded by `AGENTS.md` at the repo root. Kept for project-history reference only, do not follow as current instructions.

How to start work on the YumKitchen rebuild with OpenAI Codex (or any agent that follows the AGENTS.md convention).

## One-time setup

1. Push this `07_codex/` directory to a GitHub repo (or use the bundled `yumkitchen-web/` subdirectory as the repo root if you only want the rebuild).
2. Connect the repo to Codex at https://chatgpt.com/codex (or your Codex deployment).
3. Confirm Codex picks up `AGENTS.md` automatically. If not, manually paste it into the task prompt.

## Starter prompt for Codex

Paste this verbatim into Codex as the first task:

```
Read AGENTS.md in full.

Then read these reference docs (you can read them but NEVER modify them):
- ../05_docs/YumKitchen_RebuildSpec_v1.md
- ../05_docs/YumKitchen_ChromeReview_v1.md (takes precedence over Playwright artifacts)
- ../05_docs/YumKitchen_Improvements_v1.md

Run setup.sh to bootstrap the dev container.

Then open tasks.md and execute task T-01 (project scaffold). Do not skip ahead.

When you finish T-01:
1. Run `bash verify.sh`. All checks must pass.
2. Commit on a branch named `T-01-scaffold`.
3. Open a PR titled `[T-01] Project scaffold`.
4. Paste the T-01 acceptance criteria from tasks.md into the PR description.
5. Stop. Wait for review.

Do not work on T-02 in the same PR.
```

## What Codex needs from you (the operator)

- Approve the first PR before it can move to T-02.
- Provide secrets when prompted: `RESEND_API_KEY` (form submissions), `NEXT_PUBLIC_GTM_ID` (GA4/Ads tracking).
- A real device for mobile QA. Codex cannot truly emulate 375px viewports.

## Why the PR-per-task workflow

Codex works best when each task has:
- A clear acceptance criteria list
- A single piece of code to verify
- A fast feedback loop

Big "rebuild the whole site" prompts produce sprawling PRs you can't review. `tasks.md` is sliced so each PR is reviewable in under 10 minutes.

## If Codex hits a wall

1. Look at its draft PR. The diff usually tells you why.
2. If it asks "should I do X?" in a PR comment, answer briefly. Then it resumes.
3. If `verify.sh` keeps failing, the task is too big. Open a sub-issue and split it.

## Difference vs. Claude Code (Path A)

| Dimension | Claude Code | Codex |
|---|---|---|
| Entry file | CLAUDE.md | AGENTS.md |
| Workflow | Interactive session | PR-per-task |
| Verification | Skills (design:critique, design:accessibility) | Standalone scripts (axe, Lighthouse) |
| Container | Your machine | Cloud container |
| Setup | Local | `setup.sh` runs on each task |
| Review gate | You, in-session | GitHub PR review |

Both paths produce the same output. Pick based on your workflow preference.
