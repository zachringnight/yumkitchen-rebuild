# yum! Kitchen and Patticake design toolkit for AI coders

## Purpose

This is the current visual handoff for implementation work in this repository. Use it for new pages, component changes, creative refreshes, and visual QA after reading `AGENTS.md`.

This document does not override `AGENTS.md`, product data, route contracts, or `yumkitchen-web/app/globals.css`. The CSS theme is the token source of truth. Historical design and motion plans are context only. Do not restore a visual treatment from an older plan when it conflicts with this toolkit.

## The design decision

The site is photo-led, editorial, warm, and packaging-led.

- Bright baby blue and yum! red are the visual lead. They should be unmistakable before cream or ink.
- Real yum! food, bakery, cake-box, restaurant, and Patticake photography is the hero material. Never replace it with stock-looking illustration or generic food imagery.
- Typography, generous white space, and clear conversion paths supply the hierarchy. The image does not need a label pasted on top to work.
- Patticake is a nationwide cake experience. Do not describe it as a new home, relocation, or a local-only offering.
- The visual ambition is premium hospitality and bakery commerce, not scrapbook craft or generic restaurant SaaS.

## Non-negotiable photo rule

Do not place decorative copy, label cards, sticker chips, fake tape, ticket stubs, badges, shadows, or rotated boxes on top of photography.

Specifically, do not reintroduce:

- `one cake / three ways to share it` as a centered photo overlay
- floating occasion tags such as `happy birthday`, `thank you`, or `just because` over an image
- top-left product labels on a hero image
- caption cards that cover a food or cake photo
- tilted Polaroid, collage, ticket, tape, or scrapbooking treatments
- artificial glow or blur behind photo text to make an overlay readable

Move meaningful information into one of these places instead:

1. The adjacent section copy.
2. A figcaption directly below the image.
3. A normal card or fact row outside the photograph.
4. A page heading or conversion module.

The only functional exception is a visitor's own message rendered on the cake in the Patticake message maker. That is the product interaction, not a decorative label. Keep it clean, centered, and readable.

The site-level `RestaurantTaskDock` is a separate transactional control, not part of a photo composition. Keep it as a full-width baby-blue utility bar, not a floating white card. Do not anchor it to, layer it within, or style it like a card on a particular image.

## Brand tokens

Use the values from `yumkitchen-web/app/globals.css`:

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Primary red | `--color-brand-primary` | `#b4212b` | Heading accents, rules, accessible red text |
| Bright red | `--color-brand-primary-bright` | `#e03a3e` | High-energy actions and graphic accents |
| Brand red | `--color-brand-red` | `#dc3439` | Filled primary buttons |
| Baby blue | `--color-blue-tint` | `#cae4fd` | Main creative fields and photography frames |
| Soft blue | `--color-blue-soft` | `#aed2ef` | Supporting blue surfaces |
| Cream | `--color-cream` | `#fffdf7` | Warm support background only |
| Ink | `--color-ink` | `#2d2d2d` | Primary text and outlines |
| Body | `--color-body` | `#736e6e` | Supporting body copy |

Use Trocchi for headings and Archivo Narrow for body, navigation, labels, and buttons. Keep the existing lowercase headline style where source copy is lowercase. Do not introduce a new font, palette, gradient, border radius system, or icon style.

`--color-page` is reserved for small functional UI fills. It is not a section or page background.

## Layout system

### Editorial image grids

When a section needs more than one image, use a quiet grid with a small, even gap and square edges. The frame can be baby blue, cream, or white. Image captions sit below the photo, never on it.

- Let one photo lead through scale or grid span, not rotation or overlap.
- Use thin ink borders only where they clarify an edge.
- Keep shadows minimal and structural. Do not use floating drop shadows as decoration.
- Crop with `object-fit: cover` and the existing `crop-*` classes. Preserve recognizable cake, food, packaging, and people.
- Use full-bleed image within a card only when the adjacent information is outside the image.

### Content and conversion

- Use existing `.btn-primary` and `.btn-secondary` styles. Never make a CTA look like a sticker.
- Keep a section to one clear conversion action plus an optional secondary route.
- For facts, use border-top rows, grid columns, or a clean card below an image.
- Give primary imagery enough empty space to breathe. Do not solve a sparse section by adding decorative text fragments.

### Route character

| Surface | Visual role | Preferred image treatment |
| --- | --- | --- |
| `/yum-kitchen` | Neighbourhood restaurant warmth and appetite appeal | Editorial food grids, location photography, practical menu cards |
| `/menu` and `/order` | Functional meal discovery and pickup | Clear product images and separated item details |
| `/patticake` and `/order-a-cake` | Premium nationwide cake gifting | Clean cake imagery, blue and red fields, explicit delivery or pickup paths |
| `/asset-gallery` | Creative review only | Use the gallery controls and real exports, not new decorative site motifs |

## Motion

Rewritten 2026-07-26 at Zach's direction. The previous version allowed only fades and short vertical reveals and banned anything that floated, rotated, or bobbed. That was too narrow: it ruled out the ambient and choreographed motion this brand wants, and it is why `motion-role-ambient` sat defined and unused in `globals.css` for weeks.

Motion should feel alive and deliberate. Busy is still a failure, but so is inert.

**The vocabulary is open.** Ambient drift, parallax layering, scale and rotation, path and marquee motion, staggered entrances, springy press feedback, and multi-step choreography are all permitted. Use the shared primitives (`MotionProvider`, `Reveal`, `Stagger`, `PressButton`, `ParallaxImage`) and the spring tokens so timing stays coherent, rather than hand-rolling durations per component.

**Use the motion roles.** Every animation should carry a role class so its timing comes from one place: `motion-role-entrance` for arrivals, `motion-role-ambient` for continuous or looping motion, `motion-role-feedback` for direct response to input, `motion-role-modal` for overlays. A role also means reduced-motion behavior is handled for you.

**What still applies:**

- Motion serves the content. A photo that reads better still is still allowed to sit still.
- Keep the site-header brand mark legible and settled. Full logo animation stays on the home hero and `/logo-animation`; smaller brand-mark motion elsewhere is fine if the mark stays readable.
- Anything that loops indefinitely needs a way to stop it. `MotionPauseButton` exists for this and is a WCAG 2.2.2 requirement for content that moves for more than five seconds, not a stylistic choice.
- Keep reduced-motion and no-JavaScript behavior working. See the note below; this is not a limit on how much motion you write.
- Run `npm run audit:motion` and `npm run audit:visual-motion` after changes.

**Reduced motion is not a restriction on your design.** `prefers-reduced-motion: reduce` only applies to visitors who have asked their operating system for less motion, often because motion makes them physically ill. It has no effect on anyone else, so honoring it costs the default experience nothing. Two rules make it painless:

1. Reduced motion should **still** things, never **hide** them. Dropping an element to `opacity: 0` there is a bug: it was doing that to `.red-band-curve`, which would have left a hard seam where the wave should be. Set `animation: none` and let the element render.
2. Test both states explicitly. Headless Chrome and some in-app browser panes report `reduce` by default, so an animation can look broken when it is fine. Emulate `no-preference` and `reduce` separately before concluding anything, and check the OS setting on the machine you are reviewing from (`defaults read com.apple.universalaccess reduceMotion` on macOS) before assuming the site is at fault.

## Implementation map

Treat the following as active visual cleanup targets. A coder should simplify the existing compositions, not rebuild unrelated routes.

| Area | Files | Required outcome |
| --- | --- | --- |
| Patticake home hero | `components/PatticakeHome.tsx`, `app/globals.css` | Use a clean three-photo grid. Remove floating message tags, the centered title card, over-image captions, rotations, and fake collage treatment. |
| Patticake delivery and pickup heroes | `app/patticake/page.tsx`, `app/order-a-cake/page.tsx`, `components/PatticakeHeroPeek.tsx` | Keep cake photography unobstructed. Put captions under mobile images. Remove hero image labels, occasion tags, and copy cards. |
| Patticake concierge and message maker | `components/PatticakeConciergeBand.tsx`, `components/PatticakeMessagePreview.tsx` | Present photos and process steps in separate grids. Remove decorative ticket and floating-card treatments. Keep the functional cake-message preview. |
| Yum real-moment and bakery sections | `components/PhotoMotionStory.tsx`, `components/CakeStudioBand.tsx` | Use editorial image grids with captions below. Remove center notes, floating text, rotation, and overlap. |
| Yum location photography | `components/LocationExperienceBand.tsx` | Use a clean three-photo grid. Do not overlap, float, rotate, or animate the supporting restaurant photos. |
| Yum menu and order photography | `components/MenuMotionIntro.tsx`, `app/order/OrderClient.tsx` | Use simple photo grids. Remove center count cards, pickup tickets over food, rotated image chips, and label strips over images. |
| Inquiry photography | `components/InquiryMomentumBand.tsx` | Keep the photo unobstructed. Remove branding badges over the image. |
| Asset gallery review hero | `app/asset-gallery/AssetGallery.module.css` | Present the preview as a straight, bordered media frame. Keep the review action below the video, not pinned on top of it. |

Search before editing to make sure no old treatment survives:

```sh
rg -n 'TapeTag|tape-tag|floating-messages|cake-message-tags|remotion-title|menu-orbit|ticket|photo-chip|message-preview-card|inquiry-momentum-badge' yumkitchen-web/app yumkitchen-web/components
```

Remove unused imports, classes, animation keyframes, and pause-state selectors as part of the same change. Do not leave dead CSS as a hidden route back to the old visual language.

**Carve-out for motion primitives (added 2026-07-26).** Shared, governed pieces are not dead code just because nothing currently uses them: the motion role classes, the spring and duration tokens, and reusable edge or shape treatments. Applied strictly, the rule above would have deleted `.red-band-curve` and `motion-role-ambient`, which are exactly what made the red-band wave cheap to build and consistent with the rest of the system. Delete a one-off component style that lost its component; keep a primitive that any component could use.

## Asset rules

- Reuse the checked-in real assets under `yumkitchen-web/public/images/` and the Patticake product photography under `yumkitchen-web/public/images/patticake/`.
- Use the existing logo assets and transparent Patticake mark. Do not redraw the logo in CSS, SVG, emoji, or text.
- Keep logos and product packaging recognizable. Do not edit product claims, prices, or labels into an image.
- New source assets must be reviewed for crop, aspect ratio, color balance, licensing, and whether they read as Yum or Patticake at a glance.

## Copy and voice

Keep the voice warm, direct, lowercase where the source is lowercase, and hospitality-forward.

- Prefer a useful sentence over three tiny decorative phrases.
- Let product proof speak plainly: scratch cake, vanilla buttercream, real people, four restaurants, nationwide delivery.
- Do not invent menu items, prices, hours, certifications, reviews, or shipping claims.
- No em dashes in code, comments, or copy.

## Review and acceptance checklist

Before opening a PR, verify each changed route at desktop and mobile sizes.

1. The first visible photography is unobstructed by decorative text or cards.
2. Baby blue and red lead the composition. Cream and ink support it.
3. Captions appear outside the image and remain readable without glow or blur.
4. No rotated, shadow-heavy, scrapbook, ticket, tape, sticker, or Polaroid treatment remains.
5. Primary CTA, navigation, and form or order paths remain functional.
6. The image crop preserves the cake, food, packaging, or person that gives the photo its point.
7. Desktop and mobile have no clipped text, overlap, horizontal overflow, or unintended layout shift.
8. Reduced-motion behavior remains calm and complete.
9. `bash verify.sh` passes before review.

## Required delivery note

In the PR description, state which routes were visually reviewed, the decorative treatments removed, the real-photo assets retained, and the verification run. Include before and after screenshots for the Patticake home hero and at least one Yum photo grid.

## Reference order for future coders

1. `AGENTS.md`
2. `yumkitchen-web/app/globals.css`
3. This toolkit
4. The live component and route being changed
5. The newest report under `docs/history/plans/`

If an older historical document recommends taped labels, floating photo cards, or a centered photo overlay, this toolkit is newer and wins.
