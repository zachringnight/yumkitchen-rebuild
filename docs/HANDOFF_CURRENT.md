# Current yum! Kitchen and Patticake handoff

Updated July 17, 2026. This is the stable handoff entry point. Older dated handoffs are historical only.

## Source of truth

- Canonical checkout: `/Users/zsoskin/dev/yumkitchen-rebuild`
- Compatibility path: `/Users/zsoskin/YumKitchen_Rebuild` is a symlink to the canonical checkout
- Release branch: `main`
- Implementation branch for this round: `codex/creative-regression-guard`, ready in [PR #22](https://github.com/zachringnight/yumkitchen-rebuild/pull/22)
- Current run report: `docs/history/plans/2026-07-17-creative-regression-guard/run-report.md`
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

## Production inventory

- 14 current Yum and Patticake creative lanes
- 70 core creative MP4 masters across five orientations
- 12 carousel motion MP4 masters across six sets and two orientations
- 5 Patticake logo motion video masters plus the lockup PNG
- 84 static campaign stills across six formats
- 31 carousel cards across six sets
- 200 current items in `/asset-gallery`: 85 motion, 84 stills, and 31 carousel cards

## Local delivery packages

Large delivery ZIPs are reproducible and intentionally ignored by Git. Current packages live in:

`social/yum-patticake-creative-launch-2026-07-14/delivery-zips/`

Primary handoffs:

- `yum-patticake-creative-launch-motion-2026-07-17.zip`
- `patticake-com-launch-rollout-2026-07-17.zip`
- `SHA256SUMS.txt`

That folder also contains six individual carousel ZIPs, both 8-second and 10-second motion ZIPs, the people-behind-yum package, and the Patticake slice-logo motion package. Prior dated bundles are quarantined under `delivery-zips/archive/`.

## Verification

Final `bash verify.sh` passed on the July 17 source. Production build, critical UI flows, visual and reduced-motion checks, all 56 links and anchors, accessibility with zero serious or critical violations, and Lighthouse 100/100/100/100 all passed. Motion delivery validation also passed 87 of 87 files. Pull-request evidence is recorded in the current run report.

## Open production gates

- Confirm the production nationwide order destination in `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL`.
- Connect production form and newsletter delivery credentials.
- Confirm production analytics destinations.
- Promote only after the protected preview, conversion paths, and current creative board are approved.
