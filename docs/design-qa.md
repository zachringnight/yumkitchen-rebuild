# Latest Design QA Record

This file always points at the most recent design/QA round. Full history lives in `docs/history/plans/` (dated run reports) and `docs/history/qa/` (dated standalone QA snapshots) - do not follow anything there as current, it is historical only.

## Current: ParallaxImage hydration fix + repo handoff prep (2026-07-14)

No open findings. Full report and prior-round history: `tasks.md`.

Chronological same-day chain: full browser QA audit (`docs/history/plans/2026-07-14-browser-qa-visual-audit/run-report.md`) found the `ParallaxImage` hydration-mismatch bug -> brand warmth color pass (`docs/history/plans/2026-07-14-brand-warmth-color-pass/run-report.md`) fixed the site leaning on flat gray instead of the brand's warm tokens, confirmed against a direct side-by-side check of the live `https://www.yumkitchen.com` -> this round fixed the `ParallaxImage` bug and brought `AGENTS.md`, `tasks.md`, and the `docs/` tree back into sync with what has actually shipped.
