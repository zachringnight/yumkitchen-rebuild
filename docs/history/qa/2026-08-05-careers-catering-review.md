# Careers and catering review findings, August 5, 2026

Agent review, verified against the pages and archive photos. Not yet
executed; ranked by demo impact. Archive photos live in
`/Users/zsoskin/codex outputs/yum-audit/03_assets/images/`.

1. **Self-referential copy shipped to visitors.**
   `app/catering/page.tsx:108`: "Pickup restaurant, food photos, timing, and
   a simple next step help the planner feel ready" is a designer describing
   the page, not yum! talking to a customer. Same at
   `app/careers/page.tsx:90`: "a warm invitation to apply."
2. **Both pages are 100% homepage photo reruns.** Home → Catering → Careers
   shows zero new imagery. Fixes: `Yum_2175.jpg` (full branded packaging
   suite on the counter) into catering line 84; `Yum_1934-2.jpg` (steaming
   stockpot, cooks in whites) beside the careers "teams you could join" text
   list at lines 40-52, which currently has no photo at all.
3. **"platters and sweets" card shows neither** (`lib/site.ts:327`): promises
   cookies/bars/cupcakes, shows a steak-sandwich macro. Repo already has
   bakery photos (site.ts:338-342 cakeGallery). Renders twice via
   CateringProof and CateringPlanBuilder chips.
4. **Catering hero alt calls one sandwich a "platter"**
   (`app/catering/page.tsx:72`). Fix alt or use Yum_2175.
5. **Careers band photo repeats the About hero** (`app/careers/page.tsx:95`
   uses yum-dining-room.jpg; its CTA links to /about which opens on the same
   photo). Fix: `Yum_2846.jpg` (two cooks with embroidered names, Jacob and
   Doug, outside a snowy yum! entrance).
6. **Copy repetition:** the menu list appears 4x across the catering page;
   the 24-hour notice line appears 4x. Keep one hero mention + one FAQ.
7. **Do not use:** `Yum_2740.jpg` (near-duplicate of the current careers
   hero, same people and pose). `Yum_1371.jpg` is two bakers flanking a
   woman in a black dress (reads as the founder), hands stacked; usable but
   caption as team-plus-founder.

Also open after the Patticake pass: /patticake still shows 09_slices x2
(hero peek + birthday card), gift_box_vertical x2 (thank-you card +
parallax), and one 03_top_view inside the buy module component. Motion
re-render (v8) was running in background; if interrupted, resume with
`RENDER_ALL_MOTION_ONLY=1 npm run render` in the launch pack, then
`npm run review:motion`, `npm run validate:motion`, web
`npm run sync:creative-review`, then `npm run package` and re-verify SHAs.
