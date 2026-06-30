# YumKitchen Ship + Elevate - Manifest

Plan date: 2026-06-30
Repo: https://github.com/zachringnight/yumkitchen-rebuild.git
App root: `07_codex/yumkitchen-web/` (Next.js 16 App Router, React 19, Tailwind 4, TS strict)
Run from: `07_codex/` (where `verify.sh` lives)

## Goal

Take the built, passing rebuild from "built but unverified, sitting on main" to:
1. **Live on a Vercel preview** Zach can open and click through.
2. **Design-elevated** on home, menu, and Patticake toward best-in-class bakery commerce (Crumbl, Goldbelly, SusieCakes) without leaving the brand system.
3. **Fully verified**: forms deliver via Resend, all 9 analytics events fire, axe 0 serious, Lighthouse >= targets on every page.
4. **Cutover-ready**: 301 map, GSC steps, monitoring checklist, rollback path. No production DNS without Zach's explicit go.

Out of scope this round: new revenue surfaces (gift card module, catering form, holiday pages, press kit, FAQ). Track 3 stays on the backlog.

## Architecture

Single Next.js app. All forms route through one server endpoint `app/api/inquiry/route.ts` to Resend. Analytics centralize in `lib/analytics.ts` (dataLayer helper) fired through GTM. Locations and menu are data (`lib/locations.ts`, `lib/menu.ts`) seeded from `06_handoff/data/`. Design lives in page-level compositions plus shared band components. Motion is governed by `npm run audit:motion`.

## Tech stack

Next.js ^16.2, React ^19.2, Tailwind ^4.3, TypeScript ^6, Resend ^6, Zod ^4, react-hook-form ^7, sharp. Vercel hosting, team `zach-soskins-projects-95c2533d`. Resend for email.

## Global constraints (every packet honors these)

- **Brand system is locked.** Red `#E03A3E` (darker `#C72830` for contrast), ink `#2D2D2D`, body `#736E6E`, page `#F3F3F3`, cream `#FFF4F5`, blue tints. Trocchi (serif headings) + Archivo Narrow (sans body). Do not introduce new colors or fonts.
- **Lowercase headlines stay lowercase.** Warm hospitality voice.
- **No em dashes anywhere.** `verify.sh` fails the diff if any appear. Use commas, parens, sentence breaks.
- **Preserve Toast deep links, location slugs, and Yoast sitemap URLs exactly.** LocalBusiness/Restaurant JSON-LD stays on every location page.
- **Do not invent menu items, prices, hours, or copy.** Pull from `lib/`, `06_handoff/data/`, and `01_html/`.
- **`bash verify.sh` must print `VERIFY PASSED` before any PR-ready claim.** It is the merge gate.
- **Design elevation = density, hierarchy, photography, motion restraint, conversion clarity.** Not a restyle. Stay inside the brand system.

## File ownership map (prevents parallel collisions in Wave 1)

| Owner | Files it may edit |
|-------|-------------------|
| P03 home | `components/HomeDesign.tsx`, `Hero.tsx`, `SeasonalShowcase.tsx`, `SummerTakeoutBand.tsx`, `CateringProof.tsx`, `PhotoMotionStory.tsx`, `KineticMenuRail.tsx`, `LocationGrid.tsx`, `app/page.tsx` |
| P04 menu | `app/menu/page.tsx`, `components/MenuMotionIntro.tsx` |
| P05 patticake | `app/patticake/page.tsx`, `components/CakeStudioBand.tsx`, `PatticakeOriginBand.tsx` |
| P06 global | `app/globals.css`, `components/OpenStatus.tsx`, `MobileOrderBar.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `MediaProofBand.tsx`, `lib/analytics.ts` |

No two Wave 1 packets share a file. KineticMenuRail is owned by P03, MediaProofBand by P06.

## Task index

| ID | Name | Wave | Depends on | Files |
|----|------|------|------------|-------|
| 01 | Branch + baseline + before-screenshots | 0 | - | branch, `docs/plans/2026-06-30-yum-ship-and-elevate/before/` |
| 02 | Vercel preview live (current main) | 0 | 01 | `yumkitchen-web/.vercel`, DEPLOYMENT notes |
| 03 | Homepage elevation | 1 | 01 | see ownership map |
| 04 | Menu elevation | 1 | 01 | see ownership map |
| 05 | Patticake commerce elevation | 1 | 01 | see ownership map |
| 06 | Global polish + conversion micro-copy | 1 | 01 | see ownership map |
| 07 | a11y + Lighthouse sweep (all pages) | 2 | 03,04,05,06 | fix regressions in owned files |
| 08 | Forms + analytics live verification | 2 | 02,03,04,05,06 | DEPLOYMENT.md, verification log |
| 09 | Cutover runbook + 301 map + GSC | 3 | 07,08 | `yumkitchen-web/DEPLOYMENT.md`, `redirects` |
| 10 | Full verify + after-screenshots + end report | 3 | 07,08,09 | `run-report.md`, `after/` |

## Waves

- **Wave 0** (01, 02): branch off main, confirm baseline green, ship a preview URL same wave. Immediate "it's live" value.
- **Wave 1** (03-06): four design packets in parallel, file-isolated. Integrate at wave boundary, run `verify.sh`.
- **Wave 2** (07, 08): verify the elevated build. 07 automated (a11y/LH), 08 needs Resend secret + GTM preview (human-in-loop step flagged).
- **Wave 3** (09, 10): launch prep and end report.

## Eyeball list (machine must not decide alone)

- Production DNS cutover and domain assignment. Zach go only.
- Real Resend API key entry and any live email send.
- `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` value (real checkout vs on-page form).
- Any design change that alters brand color, font, or a Toast/order link.

## Status protocol (bake into the ultracode script)

Each packet reports one of: `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, `NEEDS_CONTEXT`. Default per-packet check is its own done-signal. Reserve adversarial cross-check for P07 (a11y regressions) only.
