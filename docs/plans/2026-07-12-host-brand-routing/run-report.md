# Host-based brand routing (backlog B1) - run report

Date: 2026-07-12. Branch: `feat/host-brand-routing`.

## What this builds

The env-flagged routing that lets yumkitchen.com serve the restaurant home at `/` after the DNS
cutover, while patticake.com keeps the Patticake home. Off by default - without the flag the build
is byte-for-byte today's behavior (verified below).

Flag: `NEXT_PUBLIC_YUM_HOST_ROUTING=1` (build-time; set in Vercel env + redeploy at cutover -
runbook step added to docs/DEPLOYMENT.md).

## Behavior with the flag on

- `yumkitchen.com/` -> middleware REWRITE to the restaurant home (URL stays `/`). Rewrite, not
  redirect, because docs/redirects.md maps the old WordPress home to `/` as identity - the bare
  domain must render content for SEO equity.
- `yumkitchen.com/yum-kitchen` -> 308 to `/` (consolidates the duplicate).
- Restaurant-home canonical becomes `https://yumkitchen.com` (was `/yum-kitchen`); sitemap home
  entry likewise.
- Client shell (`usePatticakeSurface`) is host-aware at `/` so the header/dock/order-bar stay
  restaurant-branded on the yum host. The prerendered HTML for the rewrite comes from
  `/yum-kitchen` (restaurant-branded on the server), and the window-host check resolves the same
  way on the client, so hydration is consistent.
- patticake.com, previews, and localhost: completely unchanged in both modes.

## Files

- `yumkitchen-web/lib/hostRouting.ts` (new): flag + host predicate, shared by server and client.
- `yumkitchen-web/proxy.ts`: the rewrite/redirect (was a passthrough stub).
- `yumkitchen-web/lib/usePatticakeSurface.ts`: host-aware at `/`.
- `yumkitchen-web/app/yum-kitchen/page.tsx`: flag-aware canonical.
- `yumkitchen-web/app/sitemap.ts`: flag-aware home entry (priority preserved).
- `docs/DEPLOYMENT.md`: cutover runbook gains the flag step (now step 2), later steps renumbered.

## Verification

Flag ON (local prod build, curl with Host headers + Puppeteer with host-resolver mapping):
- `yumkitchen.com/` -> title "restaurants · yum! Kitchen and Bakery", canonical
  `https://yumkitchen.com`, hydrated header is restaurant nav ("Order Now", no visible Ship a Cake).
- `yumkitchen.com/yum-kitchen` -> 308 to `/`.
- `www.patticake.com/` -> title "Patticake", Patticake shell intact.
- `localhost/` -> Patticake home (previews unaffected).
- Sitemap emits `https://yumkitchen.com` (bare) instead of `/yum-kitchen`, priority 0.85 kept.

Flag OFF (default build):
- `yumkitchen.com/` -> Patticake home, `/yum-kitchen` 200, canonical `/yum-kitchen`, sitemap
  entry `/yum-kitchen` - identical to production today.
- `bash verify.sh` (runs flagless): result recorded below.

## Verify result

VERIFY PASSED (2026-07-12): typecheck, lint, motion audit, content validation, build, UI smoke,
link audit, axe 0 serious / 0 critical, Lighthouse thresholds met, em-dash check clean.
