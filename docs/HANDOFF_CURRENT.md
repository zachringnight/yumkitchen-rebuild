# Current yum! Kitchen and Patticake handoff

Updated July 21, 2026. This is the stable handoff entry point. Older dated handoffs are historical only.

## Source of truth

- Canonical checkout: `/Users/zsoskin/dev/yumkitchen-rebuild`
- Compatibility path: `/Users/zsoskin/YumKitchen_Rebuild` is a symlink to the canonical checkout
- Release target: `main`
- Final release review: [PR #28](https://github.com/zachringnight/yumkitchen-rebuild/pull/28) from `codex/launch-gallery-handoff`
- Release base: `main` through [PR #27](https://github.com/zachringnight/yumkitchen-rebuild/pull/27) at commit `3bd886c`
- Ordered release: [PR #26](https://github.com/zachringnight/yumkitchen-rebuild/pull/26) added the owned source photos, [PR #27](https://github.com/zachringnight/yumkitchen-rebuild/pull/27) added the motion production system, and [PR #28](https://github.com/zachringnight/yumkitchen-rebuild/pull/28) adds the gallery, benchmark plan, and stable handoff
- Current run report: `docs/history/plans/2026-07-21-launch-moment-motion/run-report.md`
- Benchmark-beating plan: `docs/superpowers/plans/2026-07-21-benchmark-beating-creative-plan.md`
- Current social entry point: `social/START-HERE.md`
- Current creative source: `social/yum-patticake-creative-launch-2026-07-14/`

Do not resume retired checkpoint branches or render from the historical social packs. Run `bash scripts/check-repo-freshness.sh` before reading or editing so a stale checkout fails closed.

## Review entry points

- Protected launch preview: `/preview`
- Creative production board: `/asset-gallery`
- Patticake homepage: `/`
- Nationwide shipping detail: `/patticake`
- Local cake pickup: `/order-a-cake`
- yum! Kitchen homepage: `/yum-kitchen`
- Preview password: `Patticake4000`

The password can be changed with `PREVIEW_PASSWORD`. Protection is enabled by default. `PREVIEW_PROTECTION_ENABLED=false` is reserved for local automated QA.

## Current creative direction

- Bright baby blue and yum! red lead. Cream, ink, white, and gray only support.
- Real owned photography stays unobstructed beside or above a dedicated baby-blue copy field.
- One idea and one action lead at a time. Equal three-choice creative and the retired three-ways Patticake framing are blocked from rebuilding.
- No floating stickers, copy cards over photography, top-left text lockups, or glow effects.
- Patticake is available nationwide. Do not describe it as a new home or a local-only launch.
- Motion resolves into a readable final action for at least two seconds.
- Launch films alternate full-frame real photography with dedicated baby-blue message scenes. Copy never sits on the image.

## Production inventory

- 14 current Yum and Patticake creative lanes
- 70 core creative MP4 masters across five orientations
- 20 launch-moment MP4 masters across four films and five placements
- 12 carousel motion MP4 masters across six sets and two orientations
- 5 Patticake logo motion video masters plus the lockup PNG
- 84 static campaign stills across six formats
- 31 carousel cards across six sets
- 107 verified motion files in the delivery pack
- 220 current items in `/asset-gallery`: 105 motion, 84 stills, and 31 carousel cards

## Local delivery packages

Large delivery ZIPs are reproducible and intentionally ignored by Git. Current packages live in:

`social/yum-patticake-creative-launch-2026-07-14/delivery-zips/`

Primary handoffs:

- `yum-patticake-creative-launch-motion-2026-07-21.zip`
- `patticake-com-launch-rollout-2026-07-21.zip`
- `yum-patticake-launch-moments.zip`
- `SHA256SUMS.txt`

That folder also contains six individual carousel ZIPs, both 8-second and 10-second motion ZIPs, the people-behind-yum package, and the Patticake slice-logo motion package. Prior dated bundles are quarantined under `delivery-zips/archive/`.

## Verification

Motion delivery validation passed 107 of 107 files. Desktop and mobile `/asset-gallery` browser QA confirmed all 220 assets, the 20-item Launch moments filter, a working 10-second hero player, review controls, and zero console errors. Final `PORT=3217 bash verify.sh` passed: production build, 52 motion checks, 36 rendered route and viewport checks, 462 image instances, 56 links and anchors, zero serious or critical accessibility violations, and Lighthouse 100/100/100/100.

## Open production gates

- Confirm the production nationwide order destination in `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`.
- Connect production form and newsletter delivery credentials.
- Confirm production analytics destinations.
- Promote only after the protected preview, conversion paths, and current creative board are approved.
