# Packet 02 - Vercel preview live (current main)

Wave: 0
Depends on: 01

## Objective
Get a live, clickable Vercel preview URL of the current build so Zach sees it running this wave. This is the "ship it live" first value. Branch pushes will then auto-generate previews for the elevated build.

## Files
- `yumkitchen-web/.vercel/` (project link metadata, gitignored)
- Append preview URL + project ref to `docs/plans/2026-06-30-yum-ship-and-elevate/before/preview-url.txt`

## Consumes
- Branch from P01. Vercel team `zach-soskins-projects-95c2533d`.

## Produces
- A preview deployment URL for `ship-and-elevate-2026-06-30`.
- Confirmed Vercel project config: root `yumkitchen-web`, framework Next.js.

## Steps
1. Check for an existing link: `cat yumkitchen-web/.vercel/project.json` or use the Vercel MCP `list_projects` to find an existing `yumkitchen` project (a `.vercel` may already exist from commit 94b00ce).
2. If linked: push the branch (`git push -u origin ship-and-elevate-2026-06-30`) and read the auto preview URL via Vercel MCP `list_deployments`. If not linked: link with project root `yumkitchen-web`, framework Next.js, then deploy a preview (`deploy_to_vercel` or `vercel --cwd yumkitchen-web`).
3. Set preview env vars (preview scope only): `NEXT_PUBLIC_GTM_ID=GTM-P9584HPC` (so P08 can verify analytics), `RESEND_API_KEY` left UNSET for now (P08 handles real delivery), canonical URL defaults are fine.
4. Open the preview URL, confirm home renders, location picker opens with all 4 Toast links, no console errors. Record the URL.

## Consumes/produces contract
Produces `PREVIEW_URL` (string), consumed by P08 for forms/analytics verification and by P10 for the end report.

## Verification
```
test -s docs/plans/2026-06-30-yum-ship-and-elevate/before/preview-url.txt && curl -sf "$(cat docs/plans/2026-06-30-yum-ship-and-elevate/before/preview-url.txt)" -o /dev/null && echo OK
```
Expected: `OK` (preview URL returns 200).

## Done-signal
`DONE` with the preview URL. `BLOCKED` if Vercel auth or team access is missing (this is a Zach action, flag it, do not fake a URL).
