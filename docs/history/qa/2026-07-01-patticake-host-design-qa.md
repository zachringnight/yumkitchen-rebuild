# Patticake Deployed Host Design QA

Date: 2026-07-01

final result: passed

## comparison target

- source visual truth path: `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_live_vs_local`
- implementation screenshot path: `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_host_simulation_after_patch`
- implementation URL: `http://www.patticake.com:3001` mapped to localhost with Puppeteer host resolver
- deployed source URL: `https://www.patticake.com`
- viewports: `1440x1000` desktop, `390x844` mobile
- states: page load, scrolled restaurant route, pickup selector modal, Woodbury selected state

## full-view comparison evidence

- live baseline: `home-desktop-compare.png`, `order-a-cake-desktop-compare.png`, `yum-kitchen-desktop-compare.png`, `menu-mobile-compare.png`, `location-st-louis-park-mobile-compare.png`
- patched host simulation: `home-mobile.png`, `order-a-cake-mobile.png`, `yum-kitchen-desktop.png`, `menu-mobile.png`, `location-st-louis-park-mobile.png`

The live deployment and local implementation were compared at the same route, viewport, and initial state. Full-page browser capture repeated sticky header bands, so viewport screenshots were used for the final visual evidence.

## focused region comparison evidence

- header and mobile bar routing: `menu-mobile.png`, `location-st-louis-park-mobile.png`
- restaurant quick-action dock: `yum-kitchen-desktop-scrolled-dock.png`
- pickup selector modal: `location-select-modal-host.png`
- selected Woodbury state: `yum-kitchen-desktop-woodbury-selected.png`

Focused regions were needed because the main issue was route shell selection under the deployed host, plus sticky order controls after scroll.

## findings

- [P1 fixed] Restaurant routes used the Patticake shell on the deployed Patticake host.
  - Evidence: `https://www.patticake.com/menu`, `/yum-kitchen`, and `/location/st-louis-park` showed Patticake navigation and `Ship a Cake` controls because `usePatticakeSurface` returned true for the entire `patticake.com` host.
  - Impact: restaurant pages lost restaurant navigation, ordering context, and the new restaurant task layer on the actual deployed domain.
  - Fix: `lib/usePatticakeSurface.ts` now scopes Patticake shell behavior to `/`, `/patticake`, nested `/patticake/*`, and `/order-a-cake`.

## required fidelity surfaces

- fonts and typography: no font drift introduced. Trocchi display and Archivo Narrow body/control treatment remain intact on Patticake and restaurant routes.
- spacing and layout rhythm: mobile and desktop headers fit. Restaurant desktop dock appears only after scroll. Mobile sticky bar has reserved body padding.
- colors and visual tokens: brand red, blue header tint, cream/page surfaces, and ink text remain token-aligned.
- image quality and asset fidelity: existing product, food, and location imagery remains unchanged. No CSS art or placeholder image substitution was introduced.
- copy and content: CTA routing copy now matches the route. Patticake routes keep `Ship a Cake` or `Pick Up Locally`; restaurant routes show `Order Now`, `Menu`, and location-specific order text. Location selection copy now uses restaurant, not kitchen, while the proper brand name remains `yum! Kitchen and Bakery`.

## patches made since previous QA pass

- `lib/usePatticakeSurface.ts`: removed host-wide Patticake override.
- existing local work retained: restaurant task dock, location select mode, header pickup selector, mobile menu/order bar, metadata title cleanup, and above-fold image priority fixes.
- `app/menu/MenuClient.tsx`: added a menu ordering panel that shows the current pickup restaurant, open status, direct Toast handoff, and a favorites link that preserves the active menu search in `/order`.
- `components/PatticakeHeroPeek.tsx`, `components/PatticakeHome.tsx`, `app/patticake/page.tsx`, `app/order-a-cake/page.tsx`: added mobile-first Patticake product photography directly under the H1 on the home, shipping, and local pickup entry routes.
- `lib/site.ts` and `app/patticake/page.tsx`: changed the default Ship a Cake path to land on `/patticake#national-order`, then route the in-section action to the shipping note form at `#delivery-support`.
- `components/forms/InquiryForm.tsx` and `app/patticake/page.tsx`: streamlined the Patticake delivery note form by hiding the internal request type field and optional nearest-location selector, then shortening the shipping-note section copy.
- `components/MobileOrderBar.tsx`: made the Patticake mobile sticky CTA hash-aware, so the shipping overview advances to the shipping note form and the form state stays focused on finishing the note.
- `components/SiteHeader.tsx`: made the Patticake header CTA hash-aware, so desktop/mobile header actions also advance shipping-overview users into the note form and stay form-focused at `#delivery-support`.
- `components/forms/InquiryForm.tsx` and `app/order-a-cake/page.tsx`: aligned the local Patticake pickup form to `Pickup restaurant`, made pickup restaurant and pickup date required, and kept the internal subject hidden as `Patticake pickup note`.
- `components/PatticakeHome.tsx`, `components/PatticakeOriginBand.tsx`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `app/order/OrderClient.tsx`, `app/menu/MenuClient.tsx`, `components/LocationPickerModal.tsx`, `components/RestaurantTaskDock.tsx`, `components/HomeDesign.tsx`, `lib/site.ts`, and `lib/locations.ts`: changed customer-facing location language from kitchens to restaurants while preserving the `yum! Kitchen and Bakery` restaurant name.
- `app/yum-kitchen/page.tsx`: changed the page metadata title input to `restaurants` so the restaurant overview title is clean and not repetitive.
- `components/SiteHeader.tsx`: loosened the Patticake desktop wordmark line-height so `yum! Kitchen and Bakery` fits cleanly in the navigation at smaller desktop widths.
- `components/PatticakePathGuide.tsx`, `app/patticake/page.tsx`, and `app/order-a-cake/page.tsx`: added a compact path guide that helps guests choose between Twin Cities pickup and long-distance gifting before they reach the longer Patticake details.
- `components/HashAnchorScroll.tsx`, `components/SiteShell.tsx`, `app/patticake/page.tsx`, and `app/order-a-cake/page.tsx`: added stable hash-anchor restoration and sticky-header scroll offsets so cross-page links land on the intended guide, pickup form, or shipping form.
- `components/LocationPreferenceSync.tsx`, `app/location/[slug]/page.tsx`, `components/RestaurantTaskDock.tsx`, `components/MobileOrderBar.tsx`, and `../scripts/smoke_ui.js`: location detail pages now sync the active restaurant into the shared pickup preference, and desktop/mobile sticky order controls use the effective route restaurant.
- `app/menu/MenuClient.tsx` and `../scripts/smoke_ui.js`: added `Change Restaurant` inside the menu ordering panel, so guests can switch pickup restaurants while reading the menu and immediately update the Toast handoff.
- `components/LocationPickerModal.tsx` and `app/globals.css`: softened the restaurant picker overlay from a full red wash to an ink backdrop with a subtle red glow, widened the panel, added a red ticket edge, and tightened mobile button spacing while preserving focus and selection behavior.

## verification

- `npm run build`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `BASE_URL=http://localhost:3001 npm run a11y`: pass, 0 serious and 0 critical across scripted routes
- `BASE_URL=http://localhost:3001 npm run audit:links`: pass, 55 internal routes and anchors
- `BASE_URL=http://localhost:3001 npm run smoke:ui`: pass
- `npm run validate:content`: pass
- `npm run audit:motion`: pass
- no em dashes found in `app`, `components`, or `lib`
- deployed `https://www.patticake.com`: a11y pass, link audit pass, UI smoke pass before local patch
- Vercel production deployment confirmed: project `yumkitchen-web`, aliases include `patticake.com` and `www.patticake.com`
- menu-to-order flow verified under simulated `www.patticake.com`: selecting `soup` on `/menu` updates the ordering panel link to `/order?q=soup#favorites`, and `/order` opens with `soup` prefilled in favorites search.
- Patticake mobile hero upgrade verified under simulated `www.patticake.com`: screenshots in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_mobile_hero_upgrade`; product photography is visible in the first viewport on `/`, `/patticake`, and `/order-a-cake`, with no horizontal overflow or console errors.
- Patticake mobile CTA flow verified under simulated `www.patticake.com`: visible header Ship a Cake routes from `/` and `/patticake` to `/patticake#national-order`; the section Ship a Cake action routes to `/patticake#delivery-support`; `/order-a-cake` header Pick Up Locally routes to `#cake-inquiry`.
- Patticake shipping note form streamline verified under simulated `www.patticake.com`: screenshots in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_shipping_form_streamline`; visible fields no longer include nearest location or Type of Event, hidden subject remains registered, empty-submit validation creates no `/api/inquiry` request, and only visible required fields report errors.
- Patticake mobile sticky CTA verified under simulated `www.patticake.com`: screenshots in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_sticky_cta_final`; at `/patticake#national-order`, sticky Start Note moves to `#delivery-support`; at `/patticake#delivery-support`, sticky Start Note remains on the form; `/order-a-cake#cake-inquiry` keeps Pick Up Locally.
- Patticake header CTA verified under simulated `www.patticake.com`: screenshots in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_header_cta_context`; desktop and mobile header Start Note moves from `/patticake#national-order` to `#delivery-support` and stays there at the form.
- Patticake pickup form and restaurant-language alignment verified under simulated `www.patticake.com`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_restaurant_language_alignment`; rendered sweep found no old location-as-kitchen labels across `/`, `/order-a-cake`, `/patticake`, `/order`, `/menu`, `/yum-kitchen`, and `/location/st-louis-park`; empty pickup form submit created no `/api/inquiry` request; full `yum! Kitchen and Bakery` desktop nav label fit at 1024, 1200, and 1440 with no header overlap or horizontal overflow.
- Final layout integrity sweep after restaurant-language changes verified under simulated `www.patticake.com`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_layout_integrity_after_restaurant_language`; 32 route and viewport combinations passed with no horizontal overflow, clipped visible controls, header overlaps, or old location-as-kitchen labels. Focus screenshots include `home-desktop-sm.png` and `yum-kitchen-desktop-sm.png`.
- Patticake path guide verified locally at `http://localhost:3001`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_patticake_path_guide`; desktop `/patticake#patticake-path-guide` and mobile `/order-a-cake#patticake-path-guide` had no horizontal overflow or console errors, the active mobile CTA stayed above the sticky bar, and tapping `Start Shipping Note` landed on the clean URL `/patticake#delivery-support` with the shipping form visible.
- Restaurant location handoff verified locally at `http://localhost:3001`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_location_preference_handoff`; forced stored pickup from St. Louis Park, then visiting `/location/woodbury` changed the stored pickup to Woodbury, desktop header/dock and mobile sticky bar showed Woodbury order actions, and `/menu` plus `/order` inherited Woodbury.
- Menu restaurant switch verified locally at `http://localhost:3001`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_menu_restaurant_switch`; menu began with Woodbury selected, `Change Restaurant` opened the location picker, selecting St. Paul updated the panel, header, stored pickup, and menu Toast URL to St. Paul, with no horizontal overflow or console errors.
- Location picker modal polish verified locally at `http://localhost:3001`: screenshots and manifest in `/Users/zsoskin/YumKitchen_Rebuild/06_handoff/qa_screenshots/2026-07-01_location_picker_modal_polish`; desktop and mobile `/menu` picker states showed the calmer backdrop and shorter mobile panel, Woodbury focused as current pickup, selecting St. Paul updated `yum_preferred_location` plus the visible ordering context, and both viewports had no horizontal overflow or console errors.
- Live `https://www.patticake.com/order-a-cake` still serves the older pickup-form copy until this repo is deployed.

## residual risk

- Real form email delivery and GA4/GTM debug events were not verified in this local pass.
