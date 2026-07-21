# Yum and Patticake launch-moment motion - 2026-07-21

Release sequence:

- [PR #26](https://github.com/zachringnight/yumkitchen-rebuild/pull/26), owned source photos, merged at `c32b56a`.
- [PR #27](https://github.com/zachringnight/yumkitchen-rebuild/pull/27), motion production system, merged at `3bd886c`.
- [PR #28](https://github.com/zachringnight/yumkitchen-rebuild/pull/28), asset gallery, benchmark plan, run report, and stable handoff.

The release was split into ordered PRs after the combined media push hit a Git transport limit. The verified creative and review inventory were not reduced or replaced.

## Outcome

The active creative pack now includes four launch films built around real Patticake and yum! moments. Each film ships in 10-second vertical, 8-second vertical, 4:5, 1:1, and 16:9 placements. Full-frame photography and dedicated message scenes replace the old split-card rhythm. Baby blue and yum! red lead every designed scene. Copy never covers the photographs.

The site review board, Remotion source, delivery packages, publishing notes, provenance, benchmark, and AI-coder handoff now agree on the same system.

## New launch films

1. `patticake-launch-day`: nationwide launch hero for Reels, Stories, paid social, and the protected preview.
2. `patticake-blue-box-arrival`: packaging, unboxing, and first-slice story.
3. `patticake-bakery-to-nationwide`: real yum! kitchen, packaging, and cake-origin story.
4. `yum-kitchen-to-handoff`: real restaurant production and bright baby-blue packaging for yum! social.

Each film has five outputs:

- 10-second 9:16
- 8-second 9:16
- 8-second 4:5
- 8-second 1:1
- 8-second 16:9

## Creative system

- Full-frame real photography alternates with full-frame baby-blue message scenes.
- One red sentence leads at a time.
- The actual yum! logo moves only inside the blue player rail or end card.
- A short red wipe provides the only graphic transition.
- Patticake closes on the approved nationwide truth and `patticake.com`.
- yum! closes on the current restaurant order path.
- There are no stickers, glow effects, text shadows, corner lockups, copy cards over photos, or equal three-box layouts.

## Source finishing and provenance

Three checked-in, owned yum! photographs received non-generative Adobe tonal finishing for warmth and contrast. People, packaging, logos, food, and scene content were not generated or replaced.

- `yum-packaging-counter-adobe.png`
- `yum-bakery-gift-boxes-adobe.png`
- `yum-chef-kitchen-adobe.png`

The active Canva account returned no yum! or Patticake brand kits or existing designs, so the checked-in toolkits, packaging photography, logo files, and `globals.css` tokens remain the source of truth. The repository `/asset-gallery` is the canonical production review board.

## Delivery inventory

- 14 existing campaign lanes.
- 4 launch-moment films.
- 70 existing campaign MP4 masters.
- 20 new launch-moment MP4 masters.
- 12 carousel motion MP4 masters.
- 5 Patticake logo motion video masters plus one lockup PNG.
- 107 total verified motion files.
- 84 static campaign stills.
- 31 carousel cards.
- 220 items in `/asset-gallery`: 105 motion, 84 stills, and 31 carousel cards.

Primary delivery packages:

- `yum-patticake-creative-launch-motion-2026-07-21.zip`
- `patticake-com-launch-rollout-2026-07-21.zip`
- `yum-patticake-launch-moments.zip`
- `SHA256SUMS.txt`

Prior dated packages remain quarantined under `delivery-zips/archive/`. Nothing was deleted or silently replaced.

## Browser and visual QA

- `/asset-gallery` showed 220 of 220 assets on desktop.
- The Launch moments filter showed exactly 20 assets on mobile.
- The featured nationwide launch modal loaded the 540 by 960, 10-second source and played through the native player.
- Keep, revise, download, previous, and next controls remained present.
- The gallery produced no console errors.
- Representative film frames and the rebuilt yum! and Patticake home pages were visually compared at desktop and mobile.

Local QA captures:

- `asset-gallery-desktop.png`
- `asset-gallery-launch-modal.png`
- `asset-gallery-mobile-launch-filter.png`
- `rebuilt-yum-home.png`
- `rebuilt-patticake-home.png`

They are stored under `/Users/zsoskin/.codex/visualizations/2026/07/14/019f6163-8584-7542-8b35-72eba5ca4a25/launch-motion-2026-07-21/`.

## Final crop and focal-point QA

The release received an additional manual crop pass before merge:

- 60 representative photo frames covered all four films, all five placements, and all three photo scenes.
- A 20-poster contact sheet confirmed that every launch poster now lands on a stable photo frame instead of a fade or red transition.
- The 16:9 gift-box close-up was rerendered with the complete yum! circle visible through the full animated scene.
- Gallery tiles now preserve each asset's native aspect ratio with `contain`; the review modal already used the same non-cropping behavior.
- All six rotating yum! hero images were checked at desktop and mobile sizes.
- Full-page desktop and mobile captures covered Patticake, nationwide delivery, local pickup, yum! Kitchen, menu, order, catering, about, and a location page.
- The narrow frosting image beside the nationwide-delivery hero remains an intentional texture accent. The cake and packaging focal points remain in the dominant frame.

Audit captures are stored under `/Users/zsoskin/.codex/visualizations/2026/07/14/019f6163-8584-7542-8b35-72eba5ca4a25/crop-audit-2026-07-21/`.

## Live-site, social, and competitor comparison

The July 21 comparison used the live [yum! Kitchen site](https://yumkitchen.com/), the protected [Patticake preview](https://patticake.com/), and the official [Crumbl](https://crumblcookies.com/), [Goldbelly](https://www.goldbelly.com/), and [SusieCakes](https://susiecakes.com/) sites.

- The rebuilt yum! and Patticake surfaces are stronger than the live yum! hero on ownable baby-blue and red memory, readable hierarchy, and keeping copy off photography.
- The new films match Crumbl's one-idea immediacy without copying its black typography or weekly novelty voice.
- Patticake covers Goldbelly's useful gifting occasions without marketplace clutter or an aggressive discount gate.
- Patticake now matches SusieCakes on clear nationwide, local-pickup, bakery-story, and social-proof structure while keeping a more distinctive packaging-led identity.
- The last successful `@yumkitchen` Instagram review remains July 17. The feed still sets the bar for spontaneous people, guests, food, and neighborhood texture. The new assets are stronger in repeatable motion, packaging memory, and conversion clarity.

The active benchmark is `social/yum-patticake-creative-launch-2026-07-14/live-instagram-benchmark-2026-07-14.md`.

The actionable follow-up plan is `docs/superpowers/plans/2026-07-21-benchmark-beating-creative-plan.md`. It defines benchmark-specific win conditions, the weekly current-moment production lane, social mix, commerce measurement, rights-safe proof, motion criteria, and the next three production tasks.

## Verification

- Remotion composition discovery passed for all 20 new compositions.
- Motion review rebuilt for 105 playable MP4 masters.
- Motion delivery validation passed 107 of 107 files.
- All exact output-set and creative-regression checks passed.
- Delivery ZIPs and the SHA-256 manifest rebuilt successfully.
- Gallery sync completed with 220 current items.
- `git diff --check` passed and no em dashes were found in the active change set.
- Final `PORT=3223 bash verify.sh` passed after the focal-point corrections: TypeScript, ESLint, 53 motion checks, content validation, production build, critical UI flows, 36 rendered route and viewport checks, 462 image instances, 56 links and anchors, zero serious or critical accessibility violations, and Lighthouse 100/100/100/100.

## External release gates unchanged

- Confirm the production nationwide order destination in `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`.
- Connect production form and newsletter delivery credentials.
- Confirm production analytics destinations.
- Promote only after the protected preview, conversion paths, and current creative board are approved.
