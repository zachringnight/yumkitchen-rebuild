# Visual & Creative Design Audit — yum! Kitchen and Bakery + Patticake

Date: 2026-07-24
Scope: full-site visual, creative, UI/UX audit of both brand surfaces served from this codebase (yum! Kitchen and Bakery, the 4-location Twin Cities restaurant chain, and Patticake, its nationwide cake-delivery sister brand). Read-only — no code changes were made.

Scored visual summary with photo evidence: https://claude.ai/code/artifact/cb55483f-3b1e-479b-a722-4007db39bf84 (Zach's own claude.ai account). Faster to skim than this document; this document has the full per-page detail.

This is a fresh outside-eye creative/UX pass, not a technical QA re-run. The project's own history (`docs/history/qa/`, `docs/HANDOFF_CURRENT.md`) already shows extensive, repeated technical QA: Lighthouse 100/100/100/100, zero axe violations, motion-governance audits, brand-token audits. This report does not re-litigate that. It focuses on what that tooling cannot catch: first impression, hierarchy, content strategy, cross-page repetition, photo curation, and conversion clarity.

## Methodology

- Local dev server (`next dev`, port 3010), browsed through the site's own preview-password gate.
- Playwright (`browser_navigate` / `browser_resize` / `browser_take_screenshot`), desktop (1440px) and mobile (390px) viewports.
- **Capture technique note:** to reliably trigger this site's scroll-reveal (IntersectionObserver-gated) animations without relying on simulated wheel-scroll (which proved unreliable in this sandboxed environment — see caveat below), pages were captured by resizing the viewport to the page's full content height and taking a single non-full-page screenshot. This matches what a real user sees after normal scrolling; it does **not** match Playwright's own `fullPage: true` mode, which was tested first and produces misleading blank gaps on this site (reveal-on-scroll sections never trigger because the capture goes beyond the viewport without ever moving it) — a false positive, confirmed by cross-checking against manual scroll and against the resize technique, both of which render every section fully. **If this project's own screenshot-based QA scripts (`audit-visual-motion.mjs`, `smoke_ui.js`) use Playwright/Puppeteer `fullPage` screenshots, they may have this same blind spot** and silently under-capture reveal-gated sections. Worth a five-minute check.
- All screenshots saved to `screenshots/` alongside this report, named `<route>-<viewport>.png`. Full-page unless noted `-hero` (viewport-only, used where a page is very long and the hero needed higher effective resolution than a full-page capture at that height would give).

## Screenshot index

| Route | Brand | Files |
|---|---|---|
| `/` (Patticake home) | Patticake | `patticake-home-desktop.png`, `patticake-home-mobile.png` |
| `/patticake` (nationwide product/commerce) | Patticake | `patticake-product-desktop.png`, `patticake-product-mobile.png` |
| `/order-a-cake` (local pickup + message maker) | Patticake | `order-a-cake-desktop.png`, `order-a-cake-mobile.png`, `order-a-cake-mobile-hero.png` |
| `/patticake/checkout` (empty cart) | Patticake | `patticake-checkout-empty-desktop.png` |
| `/yum-kitchen` (Yum home) | Yum | `yum-kitchen-home-desktop.png`, `yum-kitchen-home-mobile-hero.png` |
| `/menu` | Yum | `menu-desktop.png`, `menu-mobile-hero.png` |
| `/order` | Yum | `order-desktop.png` |
| `/catering` | Yum | `catering-desktop.png`, `catering-mobile-hero.png` |
| `/about` | Yum | `about-desktop.png`, `about-mobile-hero.png` |
| `/contact` | Yum | `contact-desktop.png` |
| `/faq` | Yum | `faq-desktop.png` |
| `/careers` | Yum | `careers-desktop.png` |
| `/in-the-news` | Yum | `in-the-news-desktop.png` |
| `/accessibility-statement` | Yum | `accessibility-statement-desktop.png` |
| `/location/st-louis-park` (1 of 4, template sample) | Yum | `location-st-louis-park-desktop.png` |
| `/thank-you` | Yum | `thank-you-desktop.png` |
| 404 (not-found) | Shared | `not-found-404-desktop.png` |

Not visually audited (internal tooling, not customer-facing marketing surfaces): `/asset-gallery`, `/logo-animation`, `/preview`.

---

## Patticake

### `/` — Patticake home — **7.5/10**

**First impression:** immediately clear what this is and what to do — split hero (headline/CTAs left, appetizing photo collage right), "Ship a Cake" / "Pick Up Locally" both one click away. Strong.

**What works:**
- Real, warm, appetizing owned photography throughout — cake slices, buttercream macro, the gift box with ribbon. No stock-photo feel anywhere.
- "send cake, not a card" section is the creative high point of the page: real polka-dot backdrop, tied ribbon, the box sticker actually reads "yumkitchen.com" — this is the kind of unobstructed, giftable product photography their own design doctrine calls for, and it delivers.
- Footer is comprehensive and consistent: all 4 locations with live hours, phone, and direct order links.

**Issues:**
- **Visual monotony:** five sections in a row — hero, ticker, "send cake not a card," "a cake that gets a real person behind it," "a real scratch bakery cake, shipped to your door" — all sit on the same blue/light-blue background before the first white section ("the restaurant behind patticake") appears. Cream and white are both approved backgrounds per the brand system and used well elsewhere on this same site (see Yum home below); here they're saved for the very end, so the page reads as "one long blue scroll" for longer than it needs to.
- The two sections just described ("a cake that gets a real person behind it" and "a real scratch bakery cake, shipped to your door") are back-to-back, same background, same photo-grid-plus-text-block layout, and cover overlapping ground (process + product) — they blur into each other on a scan.
- The "send cake, not a card" block, and the "restaurant behind patticake" block below it, both reappear **near-verbatim** on `/patticake` and `/order-a-cake` — see cross-cutting finding below.

### `/patticake` (nationwide product / commerce) — **7/10**

**First impression:** this is the real commerce page — buy box (whole cake vs. by-the-slice, occasion picker, quantity, price) appears early and works. Good.

**What works:**
- The buy box itself is clean and functional: size choice, occasion dropdown, quantity stepper, live price.
- "make it sound like them" (the message-maker) is a genuinely distinctive interaction — word chips, a live preview card, "Send These Words" straight into the order. Matches the project's own read that this is its strongest interaction, and I agree.
- Press-logo strip and the reviews wall (4.5★, linked/dated sources) add real trust signal without resorting to fake review copy.

**Issues:**
- **Page length and internal repetition.** At 1440px this page runs to roughly 12,000px. Within that one page there are *two different* step-by-step "here's how it works" explainers: "choose how the cake travels" (3 cards) and "a clearer way to send it" (4 numbered steps: choose your cake / set the delivery / add the words / we bake and send) — different step counts, different wording, same underlying idea. A visitor who reads both will wonder if they're being told two different processes.
- "the restaurant behind patticake" block is reused essentially verbatim from the home page (same headline, same photos, same stat).
- "life's sweetest long-distance moments" (4-item occasion grid) sits fairly close to "what to have ready" and the FAQ — the page has a lot of "convince me" content stacked *before* the actual order form at the bottom, even though the buy box up top already lets people convert early. Fine for someone who scrolls to research; a bit much for someone re-visiting to just order.

### `/order-a-cake` (local pickup + message maker) — **7/10**

**First impression:** cream hero (a nice change of pace from the blue-heavy Patticake pages), clear pickup/shipping fork at the top.

**What works:**
- Same message-maker interaction as `/patticake`, here framed around "from message to table, clearly" — consistent, still delightful.
- "cakes for every kind of day" occasion photo grid (weddings, birthdays, celebrations, showers, gifting, anniversaries, office parties, just because) is genuinely nice browse-by-occasion real photography.

**Issues:**
- This page has its own **third** distinct process explainer: "from message to table, clearly" (start with the note / choose the day / we bake fresh / share the first slice) — combined with the two on `/patticake` and the one on the home page, that's **four different step-by-step frameworks for describing what is essentially one ordering process**, spread across three pages a single Patticake session is likely to visit in sequence.
- "send cake, not a card" and "the restaurant behind patticake" both reappear here too — same photos, same copy, third occurrence of each site-wide.
- "cakes for every kind of day" (8-photo grid) and "made for every celebration" (4-photo grid) sit close together and cover the same ground — two occasion galleries back to back.

### `/patticake/checkout` (empty cart) — **8/10**

Clean, friendly empty state — "your box is empty / Add a Patticake and it will show up here, ready to send" with a direct "Browse cakes" CTA. Does its job; not a dead end.

---

## yum! Kitchen and Bakery

### `/yum-kitchen` (Yum home) — **8.5/10**

**First impression:** appetizing full-bleed food photo, a light-blue order card up front with a working location picker — gets a hungry visitor to "order now" in one glance.

**What works:**
- Noticeably better section variety than the Patticake page trio above: order card → red promo band → dish carousel → editorial photo block → seasonal dish grid → "people behind yum" real-photography collage → stat row → reviews → press → Patticake cross-sell → catering → gift cards → locations. Each section earns its place; nothing repeats.
- The "people behind yum!" photo grid (pickup, morning regulars, bakery case, scratch cooking, team, cake day) is a real strength — matches the brand's stated aim of "real people, food, and neighborhood texture," and it's a better showcase of that than anything on the Patticake side.
- Red promo band ("serving great food for now or for later") is a plain rectangle — this is a known, already-logged backlog item (a scalloped/wave divider was flagged in the project's own prior QA as worth exploring); still true, still worth a look.

**Issues:** minor only. The mobile hero card has a thin red outline that reads as an intentional "selected/active" treatment once seen elsewhere on the site (the `/order` location-picker uses the same red-outline-for-active pattern) — consistent, not a bug, but flagging since it's easy to mistake for one on first glance.

### `/menu` — **9/10**

Comprehensive, well-organized, genuinely functional: category jump-nav, live search with suggested chips ("102 menu items across lunch, dinner, and bakery"), location switcher with live hours and a direct order button, then the full priced menu by category. This is a real menu-browsing tool, not a PDF-in-disguise. Best-executed page on the site.

### `/order` — **8.5/10**

Clean 3-panel ordering flow: location switcher, search + category-filtered favorites with an "Add" button per dish, and a persistent cart sidebar with running subtotal. The empty-cart state ("0 favorites selected... Add a favorite to plan ahead") is friendly, matching the Patticake checkout's empty state — good cross-brand consistency in how empty states are handled.

### `/catering` — **7.5/10**

Solid B2B lead-gen page: practical FAQ (notice period, pickup, allergies, parking), a full inquiry form with the fields an event planner actually needs, and all 4 locations with direct ordering. The hero is the one visual outlier on the site — it layers a photo background, a white card, *and* a separate red circular badge, which is a busier composition than the clean two-panel hero pattern used everywhere else (home pages, `/about`, `/order-a-cake`). Not broken, just inconsistent with the site's otherwise-disciplined hero language.

### `/about` — **6.5/10**

**What works:** the leader-card section (real photos of Hugo, Margaret, Mike with their roles and home locations) and the family-ownership framing are warm and on-brand.

**Confirmed issue — hero photo crop:** the hero background (`/images/yum-dining-room.jpg`) is a tall **portrait**-orientation photo — real, warm, genuinely good (two people laughing at a table, a yum!-branded box, red table-number markers, bright windows). The `<Hero>` component's `object-cover` (default center position) against a short/wide desktop container crops to the photo's vertical middle band. On the left side of that specific band sits a large, flat, evenly-lit architectural pillar — so the desktop hero's top-left renders as a dull, near-flat cream/tan patch instead of the much livelier human moment that's actually in the photo's lower two-thirds. The semi-transparent (90% opacity) text card compounds it: a background table-marker circle ghosts faintly behind the body copy. This reproduced identically across repeated loads and viewport resizes — it's the photo's real content at that crop, not a loading glitch. **On mobile the same photo reads fine** (the taller crop window captures more of the frame, including the light fixture and a hint of a person). This is a one-line fix: set an explicit `object-position` on this Hero instance (or pick a wider source crop) to shift the focal point toward the lower two-thirds of the photo. See the companion cross-check below for whether other pages share this risk.

---

## Secondary pages

_Reviewed via parallel sub-agent passes over the captured screenshots, then spot-verified directly for anything surprising. Two claims from the first pass ("dead space" at the bottom of `/faq`, a truncated `/in-the-news`) turned out to be artifacts of my own capture height on those two specific pages, not real site issues — `/faq`'s page is simply shorter than the viewport height I used (so the screenshot correctly shows its real, complete, short page plus inert background below a real user would never scroll to), and `/in-the-news` is longer than the height I used (so my screenshot just stopped before its real footer). Dropped both from the findings below rather than ship a false positive; everything else here was verified directly._

### `/contact` — **7/10**

Warm, direct hero ("we'd love to hear from you"), and the form is short and well-scoped: it explicitly tells online-ordering questions to call the location instead of using the form, which is genuinely helpful triage. The one real issue: the CTA repeats three ways (hero "Call Us," the full form, then a "quickest way to reach us" band pushing a phone call) — a visitor could finish filling out the form before learning calling was faster. No path exists for catering or press-specific inquiries, both of which the rest of the site clearly cares about.

### `/faq` — **7.5/10**

Clean, well-categorized accordion (ordering a cake / catering / visiting yum! / allergens and help) that answers real questions without clutter, and ends with two forward CTAs (Contact Us / Ship a Cake) instead of a dead end. Minor content-priority note: "ordering a cake" (Patticake shipping questions) leads the page, ahead of more likely first-visit questions like hours or location; "catering" has only 2 questions, thin given how heavily the rest of the site pushes catering as a business line.

### `/careers` — **6/10**

**Confirmed issue, verified directly:** the hero photo has a photo-credit watermark — the word **"Fabricio"** in light gray text — sitting right next to the "come join us" headline, inside the translucent text card. It's faint but legible at full resolution and immediately reads as an uncropped stock/freelance-photo credit, which directly undercuts the "real people, not stock" impression the photo is otherwise doing a good job of building (the two small red "yum!" pins on the chefs' uniforms, by contrast, are a nice authentic branded detail, not a bug). This is a clean, one-line fix: crop tighter, paint out the credit, or source a clean export. Separately, the application form is long (20+ fields including full address, resume upload, two essay questions) with no open-roles list or hiring locations shown above it — real friction for the hourly-service audience the page's own copy ("kind, committed, and happy people") is courting.

### `/in-the-news` — **6/10**

The curated "stories people remember" section (8 cards) does real trust-building work with specific, earned pull-quotes (Eater's "towering triple-layer chocolate cake," not generic praise) and credible outlet names (Star Tribune, Eater, Axios, KSTP). It drops off a cliff right after: a flat 22-item "more yum! media moments" archive grid follows with no pagination and no visible filtering, where a Star Tribune feature carries the same visual weight as a local YouTube mention — diluting the credibility the curated section just built. The category filter pills sit above the curated section only; it's not clear they apply to the archive below.

### `/accessibility-statement` — **5/10**

This is the most substantive finding in the secondary-page pass. The page is a contact form wearing the title "accessibility statement" — there is no actual statement anywhere on it: no conformance standard (WCAG level, etc.), no description of what's been done, no stated response time for access issues. For a page whose entire job is that content, that's a real trust and liability gap, not a style nitpick — especially notable given how much genuine a11y engineering rigor this codebase has (zero axe violations, dedicated audit script) that never surfaces to the visitor in words. Secondary issues: a large dead whitespace gap between the intro and the form, and the "hospitality includes access" band pairs the accessibility message with a food glamour shot, an odd pairing. The form itself is clean, on-brand, and marks required fields clearly.

### `/location/st-louis-park` — **6.5/10**

Strong hero (a real storefront photo answers "is this a real neighborhood spot" immediately) and an efficient hero-to-hours flow. But: the same address/phone/hours/order-button repeats three times on one page (hero card, hours section, the four-location grid at the bottom). The "see what's coming out of the kitchen right now" banner promises fresh content but only links out to Instagram/TikTok — no photos, an unfulfilled promise. More notably, under "loved in st. louis park," two of the three press-mention proof points are actually about Patticake, the sister cake brand, not this restaurant — odd, weaker proof on a page built around feeling hyper-local. As a shared template this should hold up fine functionally across all four locations, but it runs long: hours and directions resolve the visitor's likely question early, then reviews, a social teaser, and gift cards keep the scroll going well past that point.

### `/thank-you` — **7/10**

Warm, on-brand, and it doesn't dead-end the visitor — two clearly weighted exits ("Back to yum!", "Browse Menu"). But the message is generic regardless of what was actually submitted, with no response-time estimate (which would reassure more if the submission was, say, an accessibility complaint), and "Browse Menu" as the suggested next step is a mild non sequitur immediately after submitting feedback.

### 404 (not-found) — **8/10**

The strongest of the utility pages, and calm rather than alarming. Three prioritized buttons (Order Online, Browse Menu, Find a Restaurant) cover the likely intents, with quieter text fallbacks (homepage, contact) underneath that don't compete for attention — it actually recovers the visitor instead of dead-ending them. Only minor gap: purely textual, no small illustration or brand moment, which stands out next to the more playful treatment used on `/thank-you`.

## Hero-crop sitewide cross-check

Confirmed as a **sitewide pattern, not a one-off** — dispatched a second pass specifically to check this. The shared `<Hero>` component (`components/Hero.tsx`) is used on 8 routes: `/about`, `/contact`, `/careers`, `/catering`, and all 4 `/location/[slug]` pages (`/order-a-cake` and `/patticake` use a smaller, different `<HeroNote>` component; `/yum-kitchen` has its own `HomeHero`; `/faq`, `/in-the-news`, and `/accessibility-statement` use no hero image at all, so they're not part of this pattern). Critically, **`Hero.tsx` has no `objectPosition` prop** — only a text-alignment `align` prop — so there is currently no per-page way to override the default center crop.

Of the 8 usages, 4 pass a portrait-orientation source photo, and working through the actual `object-cover` crop math (not just eyeballing the photo) shows **2 of those 4 hit the same dull-crop failure**:
- `/about` → `yum-dining-room.jpg` (confirmed above).
- `/location/st-louis-park` → `yum-location-slp.jpg` (1600×2400) — the rendered crop band lands on dark glass storefront windows and door framing, cutting off a lively moment (two people holding a lit cake, pumpkins, flowers) except for the very tops of their heads.

The other 2 portrait photos land acceptably (lower priority, not urgent): `/location/woodbury` (roofline + legible signage, brand-forward) and `/location/shady-oak` (windows, signage, a red awning — has color and reads fine). The 4 landscape-source instances (`/careers`, `/contact`, `/catering`, `/location/saint-paul`) are all fine, confirmed against their screenshots.

**Recommendation, upgraded from the `/about`-only finding above:** add an optional `objectPosition` prop to `Hero.tsx` (defaulting to today's `center` behavior, so nothing else changes), then set it explicitly on the 2 confirmed instances. This is a single small component change that fixes both known cases and gives future pages an escape hatch, rather than two separate one-off patches.

---

## Cross-cutting findings

1. **Content repetition across the Patticake page trio.** The "send cake, not a card" gift-box block and "the restaurant behind patticake" block each appear near-verbatim on `/`, `/patticake`, and `/order-a-cake` — three pages a single Patticake browsing session is very likely to visit back to back. Individually each page reads fine; in sequence it's déjà vu, and it also means any future copy edit has to be made in three places.
2. **Process-explainer proliferation.** Across just those same three pages there are **four different step-by-step frameworks** describing what is essentially one send-a-cake process (home's 3-step "find the sweetest route / shape the message / add the love note," `/patticake`'s 3-card "choose how the cake travels," `/patticake`'s separate 4-step "a clearer way to send it," and `/order-a-cake`'s 4-step "from message to table, clearly"). Overlapping-but-different framing dilutes rather than reinforces.
3. **Hero photo crop/focal point** — confirmed on `/about`, cross-checked elsewhere above. Worth a five-minute art-direction pass across every page using the shared `<Hero>` component: does the actual rendered crop (not just the source photo) still show the best part of the image, at both desktop and mobile widths.
4. **Patticake home's five-in-a-row blue sections** vs. Yum home's much more active red/cream/blue/white alternation — the same brand palette, used with noticeably more rhythm on one side of the site than the other.
5. **What's genuinely strong, sitewide:** real owned photography with no stock-photo feel anywhere *except one confirmed spot* (see next point); a disciplined two-color brand system that still reads as two distinct sub-brands; the message-maker interaction (Patticake's most distinctive feature); `/menu` and `/order` are both more functional than a typical restaurant marketing site; empty states (cart, checkout) are friendly rather than dead ends; the footer is complete and consistent on every single page.
6. **Uncropped photo credit on `/careers`.** The hero photo has the watermark text "Fabricio" visible in light gray next to the headline — verified directly at full resolution, not a screenshot artifact. Directly undercuts the "real people, not stock" impression the site otherwise earns consistently. One-line fix (recrop or paint out), but worth checking whether the same source photo is used anywhere else on the site before calling it fixed everywhere.

## Prioritized upgrade plan

**P0 — cheap, high-confidence fixes**
1. Recrop or paint out the "Fabricio" photo-credit watermark on the `/careers` hero — verified directly, visible at full resolution next to the headline. Highest-embarrassment-per-effort item on this list: five-minute fix, undercuts a brand claim (real photography, not stock) the rest of the site earns consistently.
2. Write an actual accessibility statement on `/accessibility-statement` (conformance standard, what's been done, how to report an issue, response time) — right now the page has no statement at all under that title, a real trust/liability gap, not a style note.
3. Add an `objectPosition` prop to the shared `Hero.tsx` (defaulting to today's `center`, so no other page changes) and set it explicitly on the 2 confirmed bad instances: `/about` and `/location/st-louis-park`. One small component change, fixes both confirmed cases, gives every future Hero page an escape hatch.
4. Pick one canonical home for "send cake, not a card" and "the restaurant behind patticake" (recommend: keep on home only); on `/patticake` and `/order-a-cake`, either drop the repeat or give it page-specific photo/copy so it doesn't read as copy-pasted.
5. Consolidate the four overlapping process explainers into one step framework (same step count, same wording) reused consistently across home, `/patticake`, and `/order-a-cake`.

**P1 — moderate effort, real payoff**
6. Break up Patticake home's five-section blue run with a white/cream section partway down, matching the rhythm Yum home already gets right.
7. Merge or clearly differentiate `/order-a-cake`'s two back-to-back occasion photo grids.
8. On the location pages: cut the address/phone/hours/order-button repetition (shows 3x on one page), either populate "see what's coming out of the kitchen right now" with real content or remove the banner, and fix the press-mention mismatch — two of three "loved in st. louis park" proof points are actually about Patticake, not the restaurant.
9. Give the `/thank-you` confirmation a response-time line and, where feasible, tailor it (or at least the suggested next step) to which form was actually submitted — "Browse Menu" right after a feedback/complaint form is a mild non sequitur.
10. On `/in-the-news`, either paginate/filter the 22-item archive or visually de-emphasize it relative to the curated "stories people remember" section, so the credibility built up top doesn't get diluted immediately below.
11. On `/contact`, resolve the 3-way call/form/call-again redundancy, and add a path for catering or press inquiries specifically.

**P2 — polish**
12. Message-ideas marquee ticker can rest at a mid-loop/truncated position on load — worth a look at its resting/reduced-motion state.
13. `/catering`'s layered hero (photo + card + badge) is busier than the site's otherwise-clean two-panel hero pattern — consider simplifying for consistency.
14. `/location/woodbury` and `/location/shady-oak` heroes are portrait-sourced too and lower-priority than the two confirmed cases above, but worth the same one-line check once the `objectPosition` prop exists.
15. `/careers` application form is long (20+ fields) with no open-roles list above it — consider showing current openings/locations before the full form.

## Overall scores

| Surface | Score |
|---|---|
| Patticake (`/`, `/patticake`, `/order-a-cake`, checkout) | **7.3/10** |
| yum! Kitchen and Bakery core (`/yum-kitchen`, `/menu`, `/order`, `/catering`, `/about`) | **8.0/10** |
| Secondary/utility pages (`/contact` 7, `/faq` 7.5, `/careers` 6, `/in-the-news` 6, `/accessibility-statement` 5, location template 6.5, `/thank-you` 7, 404 8) | **6.6/10** |
| **Combined site** | **7.3/10** |

Reads as a mature, technically excellent build (this project's own QA history backs that up) held back less by execution quality and more by a handful of concrete, fixable things: an uncropped photo credit, a missing accessibility statement, a photo-crop bug, some copy-pasted blocks, and four competing explanations of the same process. None of the findings above are foundational — this is a punch list, not a rebuild.
