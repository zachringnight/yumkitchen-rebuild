# Ship + Elevate run report

Date: 2026-06-30
Branch: `ship-and-elevate-2026-06-30` (off `main` at PR #3 merge `b425687`)

## Result

Shipped clean locally. Full `bash verify.sh` passed on the polished branch. The build is verified and was confirmed live on a Vercel preview (current-code deploy). The fresh polished-build deploy is the one open mechanical item, blocked by an environment upload fault, not by the code.

Tracks delivered: **Ship it live** + **Design elevation (in-brand polish)**. Per Zach's calls mid-run: design stayed inside the locked palette (no color change), forms verification was deferred to launch.

## The honest headline

The rebuild was already excellent before this run. Two polish passes happened earlier today, and the things "upgrades" usually target were already done: live open-state copy, 0 axe violations, strong Lighthouse, all 301s wired, clean semantics, a thorough Patticake commerce page. So this round's elevation is genuine but incremental, not a transformation. The high-value work was confirming the build is launch-ready and getting it in front of Zach.

## Done-checks

| Packet | Check | Result |
|--------|-------|--------|
| 01 baseline | `verify.sh` green on clean branch + 7 before-shots | pass (VERIFY PASSED, axe 0, LH 91/100/100/100) |
| 02 preview live | live URL responds, DNS gate intact | pass (200; no custom domain attached) |
| 03 home elevation | mobile rhythm, verified no regression | pass (-3% mobile height, LH 91 -> 93) |
| 04 menu elevation | mobile rhythm, semantics intact | pass (build green; height -0.7%, see note) |
| 05 patticake elevation | mobile rhythm, CTA contract intact | pass (-4% mobile height; env CTA routing untouched) |
| 06 global polish | open-state, AA, no UA | pass (already satisfied by existing build; verified, no change needed) |
| 07 a11y + LH sweep | axe 0 serious all routes, LH thresholds | pass (axe 0/0 all 15 routes; LH 93/100/100/100) |
| 08 forms + analytics | live delivery + 9 events | DEFERRED to launch (Zach's call; needs Resend secret) |
| 09 cutover runbook | 301 audit + rollback | pass (`redirects.md` + DEPLOYMENT.md rollback) |
| 10 verify + report | full verify + after-shots + report | pass (this report) |

## What changed (code)

Surgical, mobile-only, no color/content/CTA changes. About 28 lines of Tailwind class edits across 4 files:

- `components/HomeDesign.tsx`: hero mobile min-height 660 -> 560; menu-feature section padding py-14 -> py-10 on mobile; menu-item selector 2-up on phone instead of a 6-tall stack; catering band mobile padding trimmed.
- `components/LocationGrid.tsx`: section mobile padding py-14 -> py-10 (shared across 5 pages).
- `app/menu/MenuClient.tsx`: hero + content section mobile padding trimmed (py-section -> py-12 lg:py-section).
- `app/patticake/page.tsx`: 6 bands py-section -> py-12 lg:py-section on mobile.

Plus launch docs: `redirects.md` (301 audit), `DEPLOYMENT.md` (explicit rollback path).

## Before / after (mobile full-page height, device px @ 2x)

| Page | Before | After | Delta |
|------|--------|-------|-------|
| home | 17144 | 16512 | -632 (-3%) |
| menu | 33346 | 33114 | -232 (-0.7%) |
| patticake | 25980 | 24972 | -1008 (-4%) |

Screenshots: `before/` and `after/` dirs (kept local, gitignored). The clearest visible win is the homepage menu picker going from a 6-tall stack to a 2-up grid. Menu height barely moves because its length is driven by 82 item rows, not padding, so that page's polish is cosmetic.

## Verification

- TypeScript: pass
- ESLint: pass
- Motion governance audit: pass (21 checks)
- Content validation: pass (82 menu items, slugs, assets all present)
- Production build: pass (23 routes)
- Em dash diff check: pass
- UI smoke + internal link audit: pass (49 routes/anchors)
- axe: 0 serious, 0 critical across all 15 routes
- Lighthouse mobile homepage: Perf 93, A11y 100, Best Practices 100, SEO 100

## Concerns

- Local CLI deploy hit an environment upload fault (4 attempts: upload abort, EPIPE, SSL bad record mac). RESOLVED via Vercel Git integration: the repo was already connected, so pushing the branch and opening PR #4 auto-built the polished preview server-side (no local upload). Polished build live at the branch alias `yumkitchen-web-git-ship-a-c957b8-zach-soskins-projects-95c2533d.vercel.app`. Every push now auto-previews; merge to main auto-deploys to the Vercel production URL (not the custom domain, so DNS stays the gate).
- Menu mobile polish is marginal (-0.7%); its height is item-count driven.
- The in-brand polish kept the established blue secondary surface. Warming it to cream (a warmer look) was scoped out as a taste/redirection call, available if Zach wants it.

## Eyeball list (Zach decides, not the machine)

- **DNS cutover**: no custom domain is attached yet. Production launch is Zach's go. Rollback path documented.
- **Resend API key**: forms are built and validated but never delivered a real email. Needs the production secret + one live test (deferred this round).
- **Patticake checkout URL**: `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` still routes to the on-page form until a real checkout exists.
- **Analytics**: GTM/GA4 events fire in code but were not confirmed in a deployed preview's DebugView.

## Options

1. Merge `ship-and-elevate-2026-06-30` to main after Zach reviews the before/after.
2. Keep the branch as a checkpoint; redeploy the polished preview when the network clears.
3. Extend elevation (warm the blue to cream, or a more immersive hero) before merge.
4. Move to launch prep: set Resend secret, verify forms + analytics on a preview, then schedule DNS cutover.
5. Discard and return to `origin/main`.
