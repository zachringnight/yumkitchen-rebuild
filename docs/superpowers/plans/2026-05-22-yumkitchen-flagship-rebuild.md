# YumKitchen Flagship Rebuild Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build the most impressive final version of yum! Kitchen and Bakery's website while preserving the real brand, real locations, real menu data, exact Toast order URLs, accessibility, SEO, and conversion flows.

**Architecture:** Use the existing Next.js 14 App Router scaffold in `yumkitchen-web/`. The site should be a high-end, image-led restaurant website backed by typed local data first, with clean seams that allow Sanity CMS to be added later for menu, press, seasonal modules, and location copy. The accepted visual direction is the generated flagship concept at `/Users/zsoskin/.codex/generated_images/019e50f1-f97c-7942-83a9-56e77a4b3f74/ig_05bfec72cc7b3847016a10a2ad4e248198817b9802159f8d3a.png`, corrected to use the real Yum locations and content.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, next/font, next/image, React Hook Form, Zod, Resend, GTM, JSON-LD, local typed data files, Vercel.

---

## Non-Negotiables

- Preserve real location slugs: `/location/st-louis-park`, `/location/shady-oak`, `/location/saint-paul`, `/location/woodbury`.
- Preserve all four Toast order URLs exactly from `lib/locations.ts`.
- Use real locations only: St. Louis Park, Shady Oak, Saint Paul, Woodbury. Do not use Edina, Maple Grove, Roseville, or any generated concept locations.
- Preserve brand voice: lowercase source headlines, warm family hospitality, short direct copy.
- Preserve design tokens from `AGENTS.md`, including `#E03A3E`, `#C72830`, `#2D2D2D`, `#736E6E`, `#F3F3F3`, `#FFF4F5`, `#AED2EF`, `#CAE4FD`.
- Use Trocchi for headings and Archivo Narrow for body, nav, and buttons.
- No em dashes in code, comments, markdown, or visible copy.
- Every location page must include Restaurant JSON-LD via `entityJsonLd()`.
- Every external link that opens a new tab must use `rel="noopener noreferrer"`.
- Every shipped page must pass typecheck, lint, build, axe serious or critical threshold, Lighthouse mobile thresholds, and manual visual QA.

## Current State To Fix First

- `verify.sh` can pass while skipping axe and Lighthouse. Make skipped required tools fail verification.
- `package.json` references `axe` and `lighthouse` scripts but does not install those CLIs locally.
- Homepage still renders visible scaffold copy.
- Global metadata references missing `/og/default.jpg` and `/favicon.png`.
- Location canonicals include trailing slashes while Next redirects trailing slash URLs to no-slash paths.
- The generated visual concept is useful for visual direction, but contains incorrect locations that must be replaced.

## Phase 1 - Foundation And Verification

- [x] Fix `package.json` so required QA tools are local dev dependencies, not assumed globals: Lighthouse, axe CLI or the existing Puppeteer axe script dependencies, and any browser driver package required for stable local runs.
- [x] Rewrite `verify.sh` so missing axe, missing Lighthouse, no running server, or broken browser driver is a failure, not a skip. The script may start `npm run start` after `npm run build` on an available local port and then shut it down.
- [x] Add `package-lock.json` to the scaffold after a clean `npm install`.
- [x] Add a real favicon copied from `03_assets/images/favicon.png` or `cropped-yum-favicon-270x270.png`.
- [x] Add first real OG images under `public/og/`, starting with homepage, menu, catering, and default.
- [x] Set canonical URL policy to no trailing slash everywhere unless `next.config.js` is changed to enforce trailing slashes globally. Recommended default: no trailing slash to match current Next redirect behavior.
- [x] Run and record baseline verification: `npm run typecheck`, `npm run lint`, `npm run build`, full `bash verify.sh`.

## Phase 2 - Data And Design System

- [x] Create a small data layer around the existing seed files: locations, menu, press, site navigation, footer links, seasonal modules, and homepage feature modules.
- [x] Keep local typed data as the source of truth for v1. Structure the modules so Sanity can replace the data source later without rewriting components.
- [x] Extend Tailwind and globals into a flagship design system:
  - editorial hero sections with full-bleed photography and cream translucent text panels.
  - no-radius red primary buttons and dark outlined secondary buttons.
  - larger restaurant editorial type scale while keeping Trocchi and Archivo Narrow.
  - stable responsive spacing, section bands, image rails, and accessible focus styles.
  - restrained soft blue sections for catering, cakes, gift cards, and location modules.
- [x] Copy selected original assets from `03_assets/images/` into `public/images/` with clear names and use `next/image`. Use real food, bakery, catering, cake, exterior, and interior photos instead of generated food assets.
- [x] Define shared primitives: `Button`, `SectionShell`, `ImageFrame`, `Hero`, `LocationPickerModal`, `LocationCard`, `FoodFeatureCard`, `GiftCardFeature`, `NewsletterSignup`, `JsonLd`.

## Phase 3 - Global Shell And Conversion Flow

- [x] Build the sticky header:
  - logo links to `/`.
  - nav: menu, order now, catering, cakes, locations, gift cards, about us.
  - desktop has `Find Us` outline and `Order Now` filled actions.
  - mobile keeps `Order Now` visible and moves secondary links behind a menu.
- [x] Build the global footer:
  - real social links with aria-labels.
  - compact menu, order, about, support, follow, and newsletter sections.
  - all four real location cards or a compact location rail.
- [x] Finish `LocationPickerModal`:
  - order mode uses exact Toast URLs as plain anchors.
  - call mode uses exact `tel:` links.
  - close button is inside the dialog with a 44px target.
  - Escape closes, backdrop closes, focus returns to trigger, focus stays inside dialog.
- [x] Wire analytics event attributes or a typed helper for:
  - `click_order_online`
  - `click_call_location`
  - `click_find_location`
  - `click_gift_card_buy`
  - `click_gift_card_balance`

## Phase 4 - Flagship Pages

- [x] Homepage:
  - implement the approved flagship direction.
  - first viewport uses full-bleed real food photography, translucent cream panel, `made from scratch with love`, exact live-site subhead, and CTAs `Find Us`, `Menu`, `Order Now`.
  - add fresh favorites section for sandwiches, soups and salads, breakfast all day, bakery.
  - add red promise section: `serving great food for now or for later`.
  - add catering and cakes split feature with real assets.
  - add location finder with four real locations.
  - add gift card module and footer.
  - add Organization JSON-LD.
- [x] Menu:
  - render all 82 seeded menu items.
  - sticky anchor nav for lunch and dinner, breakfast, bakery, catering, gluten and allergens, printable menu.
  - add text search and dietary filtering if tags exist; if tags are unavailable, show anchor navigation and leave dietary filtering out of v1 instead of inventing tags.
  - PDF links open in a new tab with `noopener noreferrer`.
- [x] Location pages:
  - static pages for all four slugs.
  - each page includes hero photo, location-specific address, phone, hours, parking or neighborhood copy, order CTA, call CTA, map, nearby favorites, and JSON-LD.
  - map iframe title must be `Map: yum! {short_name}`.
- [x] Catering:
  - image-led hero with `yum! catering`.
  - CTAs for call, catering inquiry, and PDF menu.
  - show catering platter photography, order timing, guest-count guidance, and most useful catering categories.
- [x] Cakes:
  - `/order-a-cake/` keeps H1 `wedding cake order form`.
  - add 4 to 6 cake photos before the form.
  - route the form by pickup location when location emails are available, otherwise `info@yumkitchen.com`.
- [x] About:
  - tell the family story with Patti and Robbie Soskin, made from scratch since 2005, location leaders, and hospitality philosophy.
  - keep it warm, not corporate.
- [x] Careers:
  - hiring page with values, roles, benefits copy if present in source, and application form.
- [x] In the News:
  - one H1 only.
  - press entries render as H2 or H3 with outlet, date when available, image, and external link.
- [x] Contact and Accessibility:
  - contact page includes call modal CTA, location grid, contact form.
  - accessibility page includes statement, feedback form, and corrected accessibility posture after the rebuild passes audits.

## Phase 5 - Forms, Tracking, SEO, And Cutover

- [x] Implement forms with React Hook Form and Zod:
  - contact
  - catering inquiry
  - wedding cake inquiry
  - careers
  - accessibility feedback
- [x] Use API routes or server actions with Resend. Never expose secrets to the client.
- [x] Add visible labels to every input and a persistent success state after submission.
- [x] Add spam protection using the simplest production-ready option accepted by the project, such as Turnstile or reCAPTCHA.
- [x] Install GTM container `GTM-P9584HPC`, remove UA legacy, and send the click events listed above.
- [x] Add sitemap, robots, canonical metadata, OG metadata, Twitter cards, and structured data.
- [x] Add a deployment runbook covering environment variables, Vercel settings, domain cutover, redirect checks, sitemap submission, and first-week monitoring.

## Visual QA Requirements

- Use the generated concept as the visual north star, not as exact content truth.
- Compare implementation against:
  - generated concept path listed above.
  - live-site ChromeReview requirements.
  - current screenshots in `02_screenshots/`.
  - real image assets in `03_assets/images/`.
- Verify desktop and mobile layouts in Browser or Playwright.
- For the homepage, capture a browser screenshot and inspect it alongside the concept with `view_image`.
- Confirm no visible scaffold text, no wrong generated locations, no missing image assets, no overlapping text, and no card-in-card layouts.

## Acceptance Criteria

- `bash verify.sh` fails if any required gate is skipped.
- Homepage looks like a flagship restaurant site, not a scaffold or template.
- All four real locations and exact Toast links are preserved.
- All 82 menu items render from data.
- All forms validate client and server side and can submit through Resend in a configured environment.
- Axe reports zero serious or critical violations across all built pages.
- Lighthouse mobile reaches Perf >= 90, A11y >= 95, Best Practices >= 95, SEO = 100 on key pages, with all-page checks in the final pass.
- Google rich result structured data is present on every location page.
- All metadata image URLs resolve with 200 responses.
- No em dashes are present in tracked source or copy.

## Recommended Build Sequence

1. Fix verification and public assets first so the gate is trustworthy.
2. Build data contracts and the design system.
3. Build global shell, modal, header, footer.
4. Build homepage to flagship quality and visually QA it before adding more pages.
5. Build menu and location pages.
6. Build content pages and forms.
7. Add analytics, SEO, sitemap, robots, and deployment runbook.
8. Run full verification, browser visual QA, and cutover checklist.

## Cross-Repo Additions From NCAA And ProductCopy Sweep

### NCAA Motion Library Additions Ported

- [x] Found reusable source at `/Users/zsoskin/dev/NCAA/motion-library` and `/Users/zsoskin/dev/NCAA/nbb-site/src/motion`.
- [x] Ported the CSS-first reveal pattern so content stays visible if JavaScript never hydrates, then animates only after the client marks elements as pending.
- [x] Ported staggered child cascades for feature grids, promise panels, and location cards.
- [x] Ported the page scroll progress pattern with yum! colors and reduced-motion/mobile guards.
- [x] Ported animated counters without adding `framer-motion`.
- [x] Ported lightweight accent/glow card treatments retinted to yum! red and blue.

### ProductCopy Patterns To Add Next

- [x] Campaign-style content validation: add a `validate:content` script that checks menu item counts, location slugs, Toast URLs, required image files, required PDF files, and metadata images before build.
- [ ] Stakeholder preview modes: add printable one-page views for catering and wedding cake inquiries, similar to ProductCopy's `/one-page-summary` route pattern.
- [ ] Content refresh runbook: document the repeatable process for updating seasonal modules, press entries, menu PDFs, and location copy.
- [x] Route smoke tests: add browser smoke coverage for homepage order CTA, location modal order actions, and menu search.
- [ ] Exportable sales sheet: generate a PDF-ready catering overview from the same structured data used by the website.

### NCAA Model-Ops Patterns To Add Next

- [ ] Promotion-gate style preflight: fail deployment when verification thresholds, content checks, image checks, sitemap checks, or structured data checks regress.
- [ ] Daily-cycle style local runner: one command that runs content validation, build, browser smoke, axe, Lighthouse, and produces a concise Markdown QA report.
- [ ] Runtime dashboard: private local page for form delivery status, click events, broken assets, Lighthouse scores, and last content update.
- [ ] Provider fallback posture: make every third-party dependency explicit, including Toast, Resend, GTM, Maps, and PDF assets, with graceful local fallbacks.
- [ ] Audit trail: write verification summaries into `docs/qa/` for handoff and launch readiness.
