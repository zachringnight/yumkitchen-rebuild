# Yum Upgrade Round 2 Plan (2026-07-01)

**Goal:** Close the remaining safely-shippable items from 05_docs/YumKitchen_Improvements_v1.md, plus repo hygiene, without touching Zach's launch gates (Resend secret, DNS cutover, brand palette).
**Architecture:** Inline single-session edits on branch `yum-upgrade-round2-2026-07-01` off fresh main (098f2fb). One reusable component, data edits in lib/site.ts, one API routing change, one page section. Full verify.sh as merge gate.
**Grounding:** 5-agent audit (improvements vs code, repo, docs, build, deploy) run 2026-07-01. 46 improvement items assessed: most done; safe remainders shipped here; data-dependent items deferred to Zach.

## Global constraints
- No invented facts: no dietary tags, amenities, holiday menus, or claims not already in site copy or locations.json.
- No brand token or palette changes (brand-blue-pass is Zach's open decision).
- No em dashes. Lowercase headlines. Preserve Toast deep links and slugs exactly.
- verify.sh must print VERIFY PASSED before merge.

## Task index
| ID | Task | Files touched | Improvement |
|----|------|---------------|-------------|
| 01 | Repo hygiene: fetch/prune, delete 4 shipped branches (2 remote), rm 9 .bak + 6 .DS_Store | git only | repo ask |
| 02 | Per-page OG images for about, careers, news, contact | lib/site.ts | A5 |
| 03 | rel=nofollow on featured external press links (archive links stay follow, own domain) | components/PressExplorer.tsx | A6 |
| 04 | GiftCardBand component on homepage, menu, location pages, thank-you | components/GiftCardBand.tsx (new), app/yum-kitchen/page.tsx, app/menu/page.tsx, app/location/[slug]/page.tsx, app/thank-you/page.tsx | B3 |
| 05 | Env-driven per-location routing for cake and catering inquiries, fallback unchanged | app/api/inquiry/route.ts, DEPLOYMENT.md | G4 |
| 06 | Catering FAQ section + FAQPage JSON-LD, copy sourced from existing site facts only | app/catering/page.tsx | H4 |
| 07 | Gate: full verify.sh, rendered QA on changed pages, QA_LOG rows | none | rule 8 |
| 08 | PR, merge, confirm Vercel production deploy, post-deploy redirect + GTM checks | git/gh | ship |

## Deferred to Zach (data or taste, do not fabricate)
- C1 dietary filter tags: needs a verified GF/vegan/vegetarian/nut-free item list from the team (GF/Allergy PDF is the seed).
- C2 amenities (kid-friendly, patio, Wi-Fi) + real dining room photos per location.
- A2 per-location SEO copy to 400-600 words: needs neighborhood facts worth stating.
- G1 menu CMS (Sanity/Payload): L effort, separate project decision.
- H1 loyalty, H2 holiday menu pages, H3 press kit: need program facts, seasonal menus, approved assets.
- brand-blue-pass branch and PR #2: keep or kill.
- C3 body+footer location grid duplication on 5 pages: taste call, current design just QA'd clean.
