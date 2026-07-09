# yum! Pitch-Grade Live Site Comparison

Date: 2026-05-22

## Benchmark

Compared current `https://yumkitchen.com/` against the local Next.js draft at `http://localhost:3000`.

## Live Site Advantages Found

- Strong food-gallery appetite appeal on the homepage.
- Seasonal item names are visible and specific.
- Catering page clearly states 24 hour notice, pickup, and parking confidence.
- Cake page lists the primary cake paths: patticake, baker's man, and coconut cake.
- About page foregrounds Patti, Robbie, and location leaders.

## Draft Advantages After Upgrade Pass

- Cleaner first viewport with persistent order CTA and responsive mobile header.
- Richer seasonal showcase with direct menu links, real item photography, and hover motion.
- Better location chooser: each order card includes address, hours, Toast order action, directions, and call action.
- Stronger catering page with package types, proof points, imagery, PDF menu, call, and inquiry flow.
- Stronger cake page with gallery, cake options, clear inquiry posture, and validation.
- Stronger about page with family story, community language, and location leader cards.
- Stronger press page with real source links instead of dead-end placeholder cards.
- Automated content validation now protects real slugs, Toast links, menu count, PDFs, OG images, and asset references.
- Verification gate now includes typecheck, lint, content validation, build, axe, Lighthouse, and em dash scan.

## Remaining Upgrade Targets

- Add route-level Playwright smoke tests for order modal, menu search, and form success states.
- Add PDF-ready catering one-sheet generated from the same structured data.
- Add private QA dashboard showing last verification scores, content check status, and form delivery config.
- Add launch-week analytics review page for order clicks, call clicks, gift card clicks, and form submissions.
