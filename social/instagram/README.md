# yum! Instagram Asset Kit

Editable source:

- `yum-instagram-templates.html`
- `yum-instagram-assets.manifest.json`

Rendered exports:

- `exports/yum-feed-bakery-square.png` - 1080x1080 feed post
- `exports/yum-feed-seasonal-portrait.png` - 1080x1350 feed portrait
- `exports/yum-story-order-now.png` - 1080x1920 story
- `exports/yum-carousel-press-proof-square.png` - 1080x1080 carousel proof slide
- `exports/yum-reel-cover-made-scratch.png` - 1080x1920 reel cover
- `exports/yum-feed-catering-portrait.png` - 1080x1350 feed portrait
- `exports/yum-feed-soup-sandwich-square.png` - 1080x1080 feed post
- `exports/yum-story-cake-inquiry.png` - 1080x1920 story
- `exports/yum-carousel-locations-square.png` - 1080x1080 carousel/location slide
- `exports/yum-feed-breakfast-portrait.png` - 1080x1350 feed portrait

The templates use the same core website system: Yum red `#dc3439`, bright red `#e03a3e`, deep red `#b4212b`, cream `#fff4f5`, light blue `#cae4fd`, soft blue `#aed2ef`, ink `#2d2d2d`, body gray `#736e6e`, Archivo Narrow, Trocchi, the circular Yum mark, and live site food photography from `yumkitchen-web/public/images`.

Story and Reel templates keep primary copy and CTA content above the lower Instagram UI-safe zone. Feed and carousel templates keep editable text as HTML, not flattened into source imagery.

To re-export after copy or image edits:

```bash
cd /Users/zsoskin/YumKitchen_Rebuild/07_codex/yumkitchen-web
node scripts/render-instagram-templates.mjs
```
