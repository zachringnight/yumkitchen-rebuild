# Run report: upgrades and tools (17 Aug 2026)

Branch: `patticake-pre-demo-polish`. PR: [#36](https://github.com/zachringnight/yumkitchen-rebuild/pull/36).
Head at walk: `0599184`.

This round did not invent site copy or checkout math. Code-only send-path work
was already on the PR. This report covers the leftover send-ready steps and
the parked after-demo list.

## Cutaway photo

No file was dropped in chat. No `yumkitchen-web/public/images/patticake/patticake_cutaway.jpg`.
Searched the repo and Downloads for a 1400px+ landscape whole-cake-with-slice-out.

Not used, per spec:

- `10_layers_slice.jpg` stays in `heroFrames[1]` (1138x758).
- `yum-patticake-layers.jpg` is 420x360. Do not upscale.
- `layers_slice_vertical.jpg` is owned but shallow focus.

Send proceeds. Brief: the box and slices carry the gift. The cutaway is next.

## Last visual walk

Production server, not `next dev`: `npx next start --hostname 127.0.0.1 --port 3004`
with preview protection on. Fresh `npm run build` after `0599184`.

Viewports evaluated first with `innerWidth + 'x' + innerHeight`:

| Screen | Desktop | Mobile |
| --- | --- | --- |
| Gate | 1440x900 | 390x844 |
| Home | 1440x900 | 390x844 |
| Ship / buy | 1440x900 | 390x844 |
| Checkout | 1440x900 | 390x844 |
| Confirmation | 1440x900 | 390x844 |
| Pickup | 1440x900 | 390x844 |

None were `0x0`. Device-scale screenshots. Sharpness judged from those files,
not `naturalWidth`.

Walk: `/preview` (password `Patticake4000`), home, Ship a Cake, add the
signature cake, place the demo order, pickup. Pickup-note submit skipped.

Confirmation recapture after the 900ms demo submit delay:

- Desktop `PC-Y0SEFL`, mobile `PC-Y0SGLE`.
- $59.95 + $14.95 demo shipping = $74.90.
- Cake words `love you` echoed. No card charged.

Header `Ship a Cake` is hidden on checkout (`headerHasShip: false`).

Local captures: `/tmp/patticake-last-walk/shots/` and
`yumkitchen-web/output/last-walk/` (gitignored). Canvas:
`patticake-demo-creative-review`.

## Send the preview

PR 36 preview:
https://yumkitchen-web-git-pattic-05fb39-zach-soskins-projects-95c2533d.vercel.app

CI `verify` on `0599184` passed. Local `verify.sh` ran as part of this round.

Smoke-locked strings still present: `now available nationwide`, `Place demo
order`, `Demo checkout`, gate teaser `something sweet is taking shape`.

## After they sit down (not in this PR)

Vercel env names for `yumkitchen-web`, 17 Aug 2026. Values not copied here.

| Item | State | Next |
| --- | --- | --- |
| `NEXT_PUBLIC_PATTICAKE_NATIONAL_ORDER_URL` | unset | Zach pastes real URL, then wire |
| `RESEND_API_KEY` | missing | then pickup submit is safe to walk |
| `RESEND_FROM` / `YUM_FORMS_TO` | set | keep |
| `NEXT_PUBLIC_GTM_ID` | `GTM-P9584HPC` | GTM Preview + GA4 DebugView. Do not guess destinations |
| Newsletter enable + webhook | unset | footer stays hidden |
| Margaret still | `yum-margaret-curbside.jpg`, masked | Zach photo only. Do not generate |
| Parade cut | `Yum! Parade v1.mov` on disk, 45MB / 88s | Zach picks a 10-15s cut, then place |
| `NEXT_PUBLIC_YUM_HOST_ROUTING` | unset | stays unset. No DNS cutover |

## Tools used

- Camera / Photos: Zach, none dropped.
- Cursor Agent: search, no swap, handoff, PR send notes.
- Production `next start` + Puppeteer at real viewports.
- Cursor Canvas for the ranked leftover list.
- `bash verify.sh` with `PUPPETEER_CACHE_DIR=/Users/zsoskin/.cache/puppeteer`.
- Vercel CLI `env ls` for names only.
- Not used: Sora, stock, Figma, git worktrees, host-routing flag.
