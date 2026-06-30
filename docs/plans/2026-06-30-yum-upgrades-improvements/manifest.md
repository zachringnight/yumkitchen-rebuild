# Yum Upgrades And Improvements Plan

**Goal:** Bring the current YumKitchen and Patticake Next app from saved checkpoint to merge-ready, launch-safe quality on the newest active stack.
**Architecture:** Continue from `checkpoint/patticake-design-2026-06-30` and preserve the existing advanced stack instead of rebuilding from the older scaffold. The run fixes the one known full-verify blocker first, then consolidates Patticake routing, then hardens launch surfaces and produces one end report.
**Tech stack:** Next.js 16.2.6 App Router, React 19.2.6, Tailwind CSS 4.3.0, React Compiler, TypeScript 6.0.3, Resend, Vercel.

## Global constraints
- Work from `/Users/zsoskin/YumKitchen_Rebuild/07_codex` on branch `checkpoint/patticake-design-2026-06-30`.
- Ship only inside `yumkitchen-web/`, `docs/plans/`, or release docs unless the packet explicitly says otherwise.
- Keep the current advanced stack. Do not downgrade to Next 14, React 18, or Tailwind 3.
- Preserve all four Toast order URLs exactly as defined in `yumkitchen-web/lib/locations.ts`.
- Preserve location slugs exactly: `/location/st-louis-park`, `/location/shady-oak`, `/location/saint-paul`, `/location/woodbury`.
- Keep `/patticake` as the customer-facing canonical Patticake route.
- Treat `/patticake-national-delivery` as a legacy route that permanently redirects to `/patticake`.
- Do not invent menu items, prices, hours, addresses, or delivery promises.
- Keep lowercase Yum brand headlines where the source uses lowercase.
- No em dashes anywhere in committed code, copy, comments, docs, or plan files.
- Do not deploy, change DNS, send form emails to real users, or merge without Zach approval.
- Full merge readiness requires `bash verify.sh` passing from `/Users/zsoskin/YumKitchen_Rebuild/07_codex`.

## Task index
| ID | Task | Files touched | Depends on | Wave |
|----|------|---------------|------------|------|
| 01 | Baseline state and update task map | `docs/plans/2026-06-30-yum-upgrades-improvements/run-notes.md`, `tasks.md` | none | 1 |
| 02 | Fix homepage Lighthouse performance | `yumkitchen-web/app/page.tsx`, `yumkitchen-web/components/HomeDesign.tsx`, `yumkitchen-web/components/Hero.tsx`, `yumkitchen-web/app/globals.css`, image usage as needed | 01 | 2 |
| 03 | Consolidate Patticake canonical routing | `yumkitchen-web/app/patticake/page.tsx`, `yumkitchen-web/app/patticake-national-delivery/page.tsx`, `yumkitchen-web/next.config.js`, `yumkitchen-web/app/sitemap.ts`, `yumkitchen-web/lib/site.ts`, `yumkitchen-web/package.json` | 01 | 2 |
| 04 | Harden Patticake product UX | `yumkitchen-web/components/SiteHeader.tsx`, `yumkitchen-web/components/MobileOrderBar.tsx`, `yumkitchen-web/lib/usePatticakeSurface.ts`, `yumkitchen-web/app/patticake/page.tsx`, `yumkitchen-web/app/thank-you/page.tsx` | 03 | 3 |
| 05 | Main-site conversion, SEO, and metadata polish | `yumkitchen-web/lib/site.ts`, `yumkitchen-web/app/sitemap.ts`, route page metadata files, `yumkitchen-web/components/SiteFooter.tsx`, `yumkitchen-web/components/CakeStudioBand.tsx` | 02, 03 | 3 |
| 06 | Forms, analytics, and environment hardening | `yumkitchen-web/app/api/inquiry/route.ts`, `yumkitchen-web/components/forms/InquiryForm.tsx`, `yumkitchen-web/components/AnalyticsEvents.tsx`, `yumkitchen-web/components/DeferredGoogleTagManager.tsx`, `yumkitchen-web/DEPLOYMENT.md`, `yumkitchen-web/lib/site.ts` | 04, 05 | 4 |
| 07 | Full QA, screenshots, and end report | `docs/plans/2026-06-30-yum-upgrades-improvements/run-report.md`, `yumkitchen-web/DEPLOYMENT.md`, QA screenshots if needed | 06 | 5 |

## Waves
- Wave 1: 01
- Wave 2: 02, 03
- Wave 3: 04, 05
- Wave 4: 06
- Wave 5: 07

## Handoff
Run packets in wave order. Packets in the same wave can run in parallel only if the executor is confident their files will not conflict. Every packet reports `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, or `NEEDS_CONTEXT`. Do not commit until a wave boundary unless preserving work from loss is the explicit goal.
