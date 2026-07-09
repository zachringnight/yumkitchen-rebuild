# AI Web Dev Handoff - Yum Website Graphics, Motion, and Social Assets

> **Historical.** Written 2026-05-26 to hand off social/motion asset integration. All paths below use the pre-move absolute path `/Users/zsoskin/YumKitchen_Rebuild/07_codex/...`, which no longer exists; the repo now lives at the current checkout root and is git-tracked. The assets described here are already integrated (see `social/` and `yumkitchen-web/components/`). Superseded by `AGENTS.md` at the repo root. Kept for project-history reference only, do not follow as current instructions.

Prepared for an AI web-dev coder taking over the Yum website and JSON-driven asset integration work.

## Current Status

The web graphics, motion polish, and Instagram social templates have been built and verified locally.

Static social graphics are ready to add to a JSON-driven website as image assets.

Motion is currently implemented as React components plus CSS. It is not yet exported as MP4, WebM, GIF, Lottie, or Remotion JSON.

## Starter Prompt For The Next AI Web Dev Coder

Paste this into the receiving AI coder:

```text
Read /Users/zsoskin/YumKitchen_Rebuild/07_codex/AI_WEB_DEV_HANDOFF.md and /Users/zsoskin/YumKitchen_Rebuild/07_codex/AGENTS.md first.

The target app is /Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web.

Integrate the social graphics using /Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/yum-instagram-assets.manifest.json. Copy PNG assets from /Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/exports into the target website public assets folder, then reference them using /social/instagram/{filename}.

Keep owned graphics limited to the Yum brand palette in the handoff. Do not use raw black, raw white, generic gradients, or off-brand accent colors.

If motion is required in the target JSON website, port the React/CSS motion from HomeDesign.tsx, AnimatedYumLogo.tsx, LogoAnimation.tsx, Hero.tsx, LocationPickerModal.tsx, and app/globals.css. If the target cannot run React/CSS motion, ask for MP4/WebM/Lottie export before claiming motion is integrated.

Run npm run lint, npm run typecheck, npm run build, and inspect http://localhost:3000 plus http://localhost:3000/logo-animation before handoff.
```

## Working Directory

Use this as the project root for implementation:

```bash
cd /Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web
```

Local preview:

```bash
npm run dev -- --port 3000
```

Open:

```text
http://localhost:3000
```

Use `localhost`, not `127.0.0.1`, for local browser QA.

## Source Of Truth

Read these before changing code:

- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/AGENTS.md`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/app/globals.css`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/README.md`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/yum-instagram-assets.manifest.json`

Do not modify reference folders outside `07_codex/` unless explicitly asked.

## Brand Tokens

Use only these colors for owned graphics, overlays, panels, labels, motion elements, and social templates:

```json
{
  "red": "#dc3439",
  "redBright": "#e03a3e",
  "redDeep": "#b4212b",
  "cream": "#fff4f5",
  "lightBlue": "#cae4fd",
  "softBlue": "#aed2ef",
  "ink": "#2d2d2d",
  "bodyGray": "#736e6e",
  "pageGray": "#f3f3f3"
}
```

Fonts:

- Headline: `Trocchi`
- Body, nav, buttons, labels: `Archivo Narrow`

Do not use raw black, raw white, generic gradients, or off-brand accent colors for owned graphics. Food photography can keep its natural colors.

## Static Social Assets

Editable HTML template:

```text
/Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/yum-instagram-templates.html
```

Rendered PNG exports:

```text
/Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/exports
```

JSON-ready manifest:

```text
/Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/yum-instagram-assets.manifest.json
```

The manifest includes local paths, recommended public paths, dimensions, placement, topic, and alt text for all 10 graphics.

Recommended public asset directory in a JSON website:

```text
/public/social/instagram
```

Recommended JSON `src` values:

```text
/social/instagram/yum-feed-bakery-square.png
/social/instagram/yum-feed-seasonal-portrait.png
/social/instagram/yum-story-order-now.png
/social/instagram/yum-carousel-press-proof-square.png
/social/instagram/yum-reel-cover-made-scratch.png
/social/instagram/yum-feed-catering-portrait.png
/social/instagram/yum-feed-soup-sandwich-square.png
/social/instagram/yum-story-cake-inquiry.png
/social/instagram/yum-carousel-locations-square.png
/social/instagram/yum-feed-breakfast-portrait.png
```

Example JSON entry:

```json
{
  "id": "yum-feed-catering-portrait",
  "src": "/social/instagram/yum-feed-catering-portrait.png",
  "width": 1080,
  "height": 1350,
  "placement": "instagram_feed_portrait",
  "topic": "catering",
  "alt": "Yum catering Instagram portrait with sandwich photography, cream brand panel, and red plan catering button."
}
```

## Regenerate Social PNGs

After editing copy, images, colors, or layout in the HTML template:

```bash
cd /Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web
node scripts/render-instagram-templates.mjs
```

Verify dimensions:

```bash
sips -g pixelWidth -g pixelHeight /Users/zsoskin/YumKitchen_Rebuild/07_codex/social/instagram/exports/*.png
```

## Motion And Animation

Motion is code-native in the Next app.

Primary motion sources:

- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/components/HomeDesign.tsx`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/components/AnimatedYumLogo.tsx`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/components/LogoAnimation.tsx`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/components/Hero.tsx`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/components/LocationPickerModal.tsx`
- `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web/app/globals.css`

Preview routes:

```text
http://localhost:3000/
http://localhost:3000/logo-animation
```

Motion surfaces already built:

- Home hero image carousel with branded indicators.
- Hero image entrance and subtle scale motion.
- Animated Yum logo with halo, ring, shine, and sparks.
- Red brand band sheen and curve motion.
- Menu feature image transitions.
- Location modal entrance animation.
- Photo collage float and rail motion.
- Menu orbit graphic.
- Cake studio, order, and location graphic boards.

Respect `prefers-reduced-motion`. Existing CSS includes reduced-motion handling.

## How To Integrate Into A JSON Website

1. Copy the PNG exports into the target app public directory.
2. Copy or adapt `yum-instagram-assets.manifest.json` into the target app data layer.
3. Change each `publicPath` if the target app uses a CDN or different public asset root.
4. Render images from the manifest using the `width`, `height`, and `alt` fields.
5. For motion, either port the React components and relevant CSS, or request exported video/Lottie assets.
6. Keep button labels, location slugs, Toast URLs, and lowercase headline style consistent with `AGENTS.md`.

## Portable Motion Export Note

If the target JSON website cannot run React/CSS motion, export motion separately before handoff:

- MP4 or WebM for website hero/background loops.
- GIF only for quick previews.
- Lottie JSON only if rebuilt as vector motion.
- Remotion render if a social video package is needed.

No standalone motion files exist yet.

## Verification Commands

Run from `/Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web`:

```bash
npm run lint
npm run typecheck
npm run build
node scripts/render-instagram-templates.mjs
```

Optional visual QA:

```bash
npm run dev -- --port 3000
```

Then inspect:

```text
http://localhost:3000/
http://localhost:3000/logo-animation
```

## Last Verified

Validated on 2026-05-26:

- Social PNGs rendered successfully.
- All 10 PNGs match intended Instagram dimensions.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Puppeteer visual QA found no console warnings or errors.
- Mobile check found no horizontal overflow.

## Known Caveats

- This folder is not currently a git checkout at the `07_codex/` level.
- Static PNG assets are production-ready for a JSON website after copying to public storage.
- Motion is not production-portable until the receiving site either ports the React/CSS implementation or receives video/Lottie exports.
- The in-app Browser plugin was not exposed during QA, so rendered checks used local Puppeteer.
