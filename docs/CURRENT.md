# Current state

Updated: 2026-08-26

- `main` is canonical.
- The current user request defines the active objective.
- The application shipped by this repository is `yumkitchen-web/`.
- No DNS cutover or host-routing activation is implicitly pending.
- Historical plans and completed task rounds are evidence only.

## Read by task

- Deployment, domains, environment, or rollback: `docs/DEPLOYMENT.md`
- Redirect or SEO changes: `docs/redirects.md`
- Visual work: `docs/DESIGN_TOOLKIT_AI_CODER.md`
- Social creative work: `social/START-HERE.md`
- Historical implementation context: the specific dated report named by the task

Do not read all of these by default.

## Review and deployment behavior

- One branch and one draft PR per coherent objective.
- Targeted checks during implementation.
- `bash scripts/verify-standard.sh` before ordinary runtime review.
- `bash verify.sh` for release-level, routing, authentication, major interaction, or visual approval work.
- Ordinary branches should not request Vercel previews. Use `preview-*` only when rendered review is required.
- Merge and production deployment require explicit authorization.
