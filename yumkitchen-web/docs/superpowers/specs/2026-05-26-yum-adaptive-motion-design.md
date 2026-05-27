# Yum adaptive motion and conversion design

Date: 2026-05-26
Status: design approved in chat, pending written spec review

## Objective

Improve the Yum Kitchen rebuild through an adaptive motion and conversion system that makes the site feel more appetizing, polished, and easier to order from than the current `yumkitchen.com`.

The next round should preserve the current Next.js App Router architecture and improve existing surfaces instead of creating a parallel redesign.

## Approved direction

Use an adaptive system:

- Expressive motion on brand and food discovery surfaces.
- Restrained motion on ordering, navigation, search, pickup selection, and Toast checkout handoff.
- Motion should make food feel fresh and the brand feel alive without delaying tasks.
- Functional state changes must be clear through text, layout, and accessibility semantics, not motion alone.

## Scope

In scope:

- Motion governance across current CSS animations and interactive components.
- Homepage and menu first-viewport polish for first-time visitors.
- Ordering UX improvements around pickup selection, search/filtering, cart state, quantity controls, empty states, and checkout handoff.
- Mobile and desktop design QA against the current live site.
- Accessibility, reduced-motion, performance, and smoke verification.

Out of scope for this round:

- Replacing Toast checkout.
- Adding a database, CMS, or account system.
- Introducing a new animation library unless a concrete gap appears during planning.
- Producing new video, Lottie, or GIF assets.
- Launch cutover or DNS changes.

## Current motion inventory

Today's new source-level motion treatments are part of the design scope:

- Homepage hero carousel with active image transition, Ken Burns treatment, progress meter, animated Yum logo, and hero panel entrance.
- Red brand band with sheen and curve drift.
- Menu feature photo swap and menu intro orbit cards.
- Ordering page board with floating food chips, local cart state, add-another behavior, and live pickup context.
- Header dropdown transitions and mobile menu icon morph.
- Modal entrance treatment for order/call location picker.
- Location page floating photo treatments.
- Global reveal and stagger system through `data-reveal`, `MotionEnhancer`, and CSS keyframes.
- Reduced-motion fallbacks for ambient and infinite animations.

The broader inventory also includes kinetic menu rail, photo motion story, cake studio floats, logo animation page, scroll progress, animated counters, and shared hover/feedback transitions.

## Motion principles

Classify every animation into one role:

- Entrance: one-time reveal that helps hierarchy.
- Ambient: background visual energy that never blocks interaction.
- Feedback: direct response to a user action.
- Modal: focus-setting transitions for overlays and picker dialogs.

Rules:

- Ambient motion is allowed on brand, food, story, cake, location, and menu discovery sections.
- Ordering, navigation, search, filters, quantity controls, and checkout should use short feedback motion only.
- No animation should hide primary content on first paint.
- No animation should cause layout shift or scrolling jank.
- Infinite motion must pause or disappear under `prefers-reduced-motion`.
- Hover motion cannot be the only signal for state or affordance.

## Architecture

Keep the current source of truth and component boundaries:

- `app/globals.css`: owns named keyframes, animation classes, reduced-motion rules, and shared hover/feedback transitions.
- `components/MotionEnhancer.tsx`: owns scroll reveal activation for `[data-reveal]`.
- `components/HomeDesign.tsx`: owns homepage hero, food carousel, red band, menu feature, and first-visitor conversion path.
- `components/MenuMotionIntro.tsx` and `app/menu/MenuClient.tsx`: own appetite-led menu browsing, search, category shortcuts, and empty/search states.
- `app/order/OrderClient.tsx`: owns pickup selection, local demo cart, search suggestions, quantity controls, subtotal, and Toast checkout link.
- `components/SiteHeader.tsx` and `components/LocationPickerModal.tsx`: own navigation, dropdowns, mobile menu, order/call modal flow, focus, and scroll locking.
- `lib/site.ts` and `lib/locations.ts`: remain the data source for navigation, external URLs, demo order items, and location details.

Data flow stays static and local:

- Static data drives the UI.
- React state handles current hero image, active menu feature, pickup kitchen, query, cart, and modal state.
- External checkout continues through verified Toast URLs.

## Experience details

Homepage:

- Keep food as the first visual hook.
- Make the first viewport communicate scratch food, trusted local brand, locations, and order path.
- Tune hero image rhythm, progress meter, and CTAs so the page feels alive but not busy.

Menu:

- Keep the menu intro appetite-led and immediately useful.
- Preserve quick search and category jumping.
- Make empty states and result counts clear.
- Keep animated food cards supportive, not dominant.

Order:

- Prioritize pickup kitchen, favorite browsing, cart clarity, and checkout confidence.
- Make item additions, quantity changes, and clear-order behavior visible through text and state.
- Keep checkout handoff explicit that final availability, timing, tax, and payment happen in Toast.

Navigation and modal:

- Keep desktop dropdowns and mobile navigation predictable.
- Preserve keyboard and focus behavior.
- Keep location picker motion short and focus-oriented.

## Error handling and accessibility

- Reduced-motion users must receive the same visible content and the same task completion path.
- Cart and search changes need accessible text updates where useful.
- Modal focus must be trapped while open and restored when closed.
- Interactive controls need labels, active states, and keyboard access.
- External links should keep clear destinations and safe `rel` behavior.

## Verification

Required local checks:

- `npm run lint`
- `npm run typecheck`
- `npm run validate:content`
- `npm run build`
- `npm run smoke:ui`
- `npm run a11y`
- Lighthouse checks for homepage, menu, and order where practical.

Required visual checks:

- Desktop and mobile screenshots for homepage, menu, order, modal, and header.
- Reduced-motion browser pass.
- Comparison screenshots against current `yumkitchen.com`.
- Confirm primary CTA access is immediate on mobile and desktop.
- Confirm no content overlap, clipped button text, hidden first-paint content, scroll jank, or animation-caused layout shift.

## Acceptance criteria

- The local rebuild is materially better than the current live site for first-time visitor clarity, ordering confidence, mobile usability, accessibility, and perceived polish.
- Motion inventory is classified and governed by clear roles.
- Reduced-motion behavior is complete and verified.
- Ordering and checkout flows remain faster and clearer than before.
- No new dependency or abstraction is added without a concrete need.
- All required verification commands pass, or any remaining failure is documented with a root cause and follow-up.

## Risks and mitigations

- Risk: too many ambient animations make the site feel noisy.
  Mitigation: classify, prune, and reserve expressive motion for food and brand surfaces.

- Risk: reveal animations hide content or hurt first paint.
  Mitigation: verify first viewport and reduced-motion behavior before completion.

- Risk: ordering polish distracts from conversion.
  Mitigation: use only short, functional feedback motion in order and navigation paths.

- Risk: live-site comparison becomes subjective.
  Mitigation: use screenshots, Lighthouse, accessibility results, and concrete task-flow checks.
