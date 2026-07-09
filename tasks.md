# Rebuild Task List

> Known stale branch: `brand-blue-pass` (PR #2 on GitHub) is 20 commits ahead but based on a commit before three shipped rounds. Merging it as-is would delete since-shipped components and docs. Needs manual salvage of just the color-token intent, or closure. Do not merge as-is.

## Latest round: upgrade-round2 (2026-07-01)

Branch `yum-upgrade-round2-2026-07-01`. Closed the safely-shippable improvements from the v1 list: gift card band (B3), catering FAQ + JSON-LD (H4), per-location cake/catering email routing (G4), per-page OG images (A5), nofollow on external press links (A6). Repo hygiene: shipped branches deleted, .bak/.DS_Store cleared. Full report: `docs/history/plans/2026-07-01-yum-upgrade-round2/run-report.md`.

- [x] verify.sh VERIFY PASSED (axe 0/0 on 15 routes, LH 100/100/100/100) after two caught-and-fixed QA findings.
- [ ] OPEN (Zach gates, unchanged): RESEND_API_KEY + live form test; GTM/GA4 DebugView confirm; DNS cutover go; brand-blue-pass keep-or-kill (PR #2).
- [ ] OPEN (Zach data): dietary tags (C1), amenities (C2), location SEO copy (A2), menu CMS (G1), holiday/loyalty/press-kit surfaces (H).

## Prior round: ship-and-elevate (2026-06-30)

Branch `ship-and-elevate-2026-06-30`. Tracks: ship-it-live + in-brand design polish. Full report: `docs/history/plans/2026-06-30-yum-ship-and-elevate/run-report.md`.

- [x] Baseline VERIFY PASSED (axe 0 serious, LH 91/100/100/100) and before-shots.
- [x] Confirmed live on Vercel preview; no custom domain attached (DNS gate intact).
- [x] In-brand mobile-rhythm polish on home, menu, Patticake (no color/content/CTA change). Re-verified: axe 0, LH 93/100/100/100.
- [x] Cutover runbook: `docs/redirects.md` 301 audit + rollback path in `docs/DEPLOYMENT.md`.
- [ ] OPEN (Zach gates): set Resend secret + live form test; confirm GTM/GA4 in a preview; DNS cutover go.
- [ ] OPEN (mechanical): redeploy polished build to a fresh preview (environment upload fault blocked it this run).

---

Prior status: the rebuild is past the original scaffold-first task plan. The active branch is `checkpoint/patticake-design-2026-06-30`, with the Patticake design pass preserved at commit `153084a`.

Current finishing checklist:

- [ ] Fix homepage Lighthouse performance. Last full run: Lighthouse Perf=85 A11y=100 BP=100 SEO=100.
- [ ] Consolidate Patticake routing so `/patticake` is canonical and `/patticake-national-delivery` is legacy redirect only.
- [ ] Verify Patticake product UX on `/patticake`, mobile, and host `patticake.com`.
- [ ] Recheck main-site conversion, SEO, metadata, sitemap, social links, JSON-LD, and gift card links.
- [ ] Recheck forms, Resend env handling, analytics events, and deployment docs.
- [ ] Run `bash verify.sh` and require `VERIFY PASSED` before merge or PR-ready status.
- [ ] Write the end report in `docs/history/plans/2026-06-30-yum-upgrades-improvements/run-report.md`.

Execution plan: `docs/history/plans/2026-06-30-yum-upgrades-improvements/manifest.md`.

---

## Historical scaffold task list

The task list below is retained for context. It reflects the original PR-per-task scaffold workflow and is not the current execution order.

One PR per task. Run `bash verify.sh` before opening a PR. Do not bundle tasks.

Status:
- [ ] pending
- [/] in progress
- [x] complete

---

## T-01 - Project scaffold

**Acceptance criteria:**
- [ ] `yumkitchen-web/package.json` installs cleanly with `npm install`
- [ ] `npm run dev` boots Next.js 14 on http://localhost:3000
- [ ] `tailwind.config.ts` includes all brand tokens (`brand-primary`, `brand-primary-darker`, `ink`, `body`, `page`, `cream`, `blue-soft`, `blue-tint`)
- [ ] `next/font` loads Trocchi (weight 400) and Archivo Narrow (weights 400 + 700)
- [ ] `app/layout.tsx` sets default metadata, GTM script slot, font variables
- [ ] `app/globals.css` defines `.btn-primary`, `.btn-secondary`, `.btn-link`, `.container-content`
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` and `npm run lint` pass

Files to create: see scaffold under `yumkitchen-web/`. Most are stubbed already - fill in `lib/locations.ts` from `06_handoff/data/locations.json`.

---

## T-02 - Shared components: Header, Footer, LocationCard, LocationGrid

**Acceptance criteria:**
- [ ] `components/Header.tsx` with sticky positioning, logo (links to `/`), nav (menu, work @ yum!, gift cards, our story, locations, catering), filled-red Order Now button
- [ ] Header Order Now opens `LocationPickerModal` in `mode="order"`
- [ ] `components/Footer.tsx` includes social icons (with `aria-label`), Quick Links, 4 location cards
- [ ] `components/LocationCard.tsx` and `components/LocationGrid.tsx` already exist as scaffolds - wire them up
- [ ] `components/LocationPickerModal.tsx` already exists - verify the inside-dialog close button and 44x44 tap targets
- [ ] All 4 social icons have `aria-label` (Facebook, Instagram, Twitter/X, LinkedIn)
- [ ] Footer renders the same on every page

---

## T-03 - Homepage `/`

**Acceptance criteria:**
- [ ] Hero matches the LIVE state captured in ChromeReview_v1 (background image, translucent overlay, 3 CTAs: Find Us outline, Menu outline, Order Now filled)
- [ ] H1 is exactly `made from scratch with love` (lowercase, with the line break preserved as in the source)
- [ ] Subhead pulled verbatim from `../01_html/homepage.html`
- [ ] Order Now opens LocationPickerModal in `mode="order"`
- [ ] Below hero: 3-up section "serving great food for now or for later" on red bg with cream text
- [ ] `#locations` anchor section renders LocationGrid
- [ ] Organization JSON-LD added to `<head>`
- [ ] Homepage hero image uses `next/image` with `priority`
- [ ] No console errors in dev
- [ ] Lighthouse mobile: Perf >= 90, A11y >= 95, BP >= 95, SEO = 100

---

## T-04 - Location detail pages `/location/[slug]/`

**Acceptance criteria:**
- [ ] Static params for all 4 slugs (st-louis-park, shady-oak, saint-paul, woodbury)
- [ ] Each page renders: H1 (location name lowercase), address, phone (tel: linked), hours, Order Online button (filled red), Maps iframe with `title="Map: yum! {short_name}"`, `loading="lazy"`
- [ ] Restaurant JSON-LD via `entityJsonLd()` from `lib/locations.ts`
- [ ] JSON-LD validates on Google Rich Results Test
- [ ] Slug must match the original WordPress URLs exactly

---

## T-05 - Menu page `/menu/`

**Acceptance criteria:**
- [ ] Renders all 82 items from `lib/menu.ts` (seeded from `../06_handoff/data/menu_seed.json`)
- [ ] Sticky anchor nav: Lunch & Dinner / Breakfast / Bakery / Catering / Gluten & Allergens / Printable Menu
- [ ] PDF links (Takeout, GF/Allergy) open in new tab with `rel="noopener noreferrer"`
- [ ] Section H2s and item H3s match source
- [ ] Hero H1: `fresh and friendly food`
- [ ] Optional: dietary filter UI (defaults to "all", filter state in URL `?diet=gf`). Mark `[ ]` if shipped, otherwise document as deferred.

---

## T-06 - Catering, About, Careers, In the News, Accessibility pages

**Acceptance criteria:**
- [ ] `/catering/` matches the live hero (background image, "Call Us" CTA opens LocationPickerModal in `mode="call"`)
- [ ] `/about/` includes founders bio (Patti and Robbie Soskin), location leaders section
- [ ] `/careers/` includes hiring copy + general application form embed (Resend route)
- [ ] `/in-the-news/` renders 22 press hits as `<h2>` (NOT `<h1>` - the original WordPress site bug must not be replicated). External links open in new tab with `rel="noopener noreferrer"`.
- [ ] `/accessibility-statement/` renders the statement copy + feedback form (route to `info@yumkitchen.com`)
- [ ] Each page has unique title, meta description, OG image

---

## T-07 - Forms (Contact, Cake, Careers, Accessibility)

**Acceptance criteria:**
- [ ] All four forms use React Hook Form + Zod validation
- [ ] Server actions or `app/api/{form}/route.ts` post to Resend
- [ ] Each form has visible `<label>` elements paired to inputs
- [ ] Required field validation works client-side AND server-side
- [ ] Success state shows a real thank-you message (not a flash)
- [ ] Error state shows the actual error (not "something went wrong")
- [ ] reCAPTCHA or alternative spam protection wired up
- [ ] Test submission delivers to `info@yumkitchen.com`

---

## T-08 - `/order-a-cake/` page

**Acceptance criteria:**
- [ ] H1: `wedding cake order form`
- [ ] Copy verbatim from `../01_html/order-a-cake.html`
- [ ] Form fields per spec (RebuildSpec section 5.8): Name, Email [req], Phone, Date of Event [req], Pickup Location [req] dropdown, Type of Event, Guests, Description, reCAPTCHA
- [ ] 4-6 cake photo gallery above the form (Improvement B6)
- [ ] Routes submissions to the picked-up-location's email if available, else `info@yumkitchen.com`

---

## T-09 - Tracking + analytics

**Acceptance criteria:**
- [ ] GTM container `GTM-P9584HPC` installed in `app/layout.tsx`
- [ ] GA4 `G-2QEQHR7D75` fires page_view
- [ ] FB Pixel `8617229911638112` and Google Ads `AW-16625818121` fire from GTM
- [ ] Custom events: `click_order_online`, `click_call_location`, `submit_contact_form`, `submit_wedding_cake_form`, `submit_careers_form`, `click_gift_card_buy`, `click_gift_card_balance`
- [ ] UA legacy `UA-83446946-1` is NOT loaded (must be removed)
- [ ] CallRail script lazy-loads after first user interaction

---

## T-10 - Performance + a11y final pass

**Acceptance criteria:**
- [ ] All images via `next/image` (only above-the-fold uses `priority`)
- [ ] All iframes have `title`, `loading="lazy"`
- [ ] axe-core run produces ZERO serious or critical violations across all pages
- [ ] Lighthouse mobile: Perf >= 90, A11y >= 95, BP >= 95, SEO = 100 on every page
- [ ] No console errors on mobile Safari + Chrome
- [ ] Color contrast passes WCAG AA (use `bg-brand-primary-darker` on hover, font-weight 700 on filled buttons)

---

## T-11 - Sitemap, robots, OG images

**Acceptance criteria:**
- [ ] `app/sitemap.ts` generates the sitemap with all canonical URLs matching the original Yoast sitemap
- [ ] `public/robots.txt` allows all, references sitemap
- [ ] Per-page OG images (homepage = current Yum_2175.jpg, menu = a menu-themed image, etc.)
- [ ] Twitter card metadata on every page
- [ ] Canonical URLs set per page

---

## T-12 - Cutover preparation

**Acceptance criteria:**
- [ ] All 4 Toast URLs tested live (no 404s)
- [ ] All forms send to `info@yumkitchen.com` via Resend (test from 3 different IPs)
- [ ] DNS cutover runbook in `docs/DEPLOYMENT.md`
- [ ] 301 redirect map generated (if any URLs changed)
- [ ] GSC sitemap submission instructions
- [ ] First-week monitoring checklist (Core Web Vitals, GA4 conversions)

---

## Verification on every PR

Each PR must pass `bash verify.sh` which runs:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run a11y`
- `npm run lh` (key pages only)
- em dash check
