# yum! social motion template 2026

This is the new reusable 2026 social motion template system. It is intentionally separate from the older Instagram and post-worthy packs.

## Output

- `exports/video`: 1080x1920 MP4 masters at 30 fps
- `exports/covers`: 1080x1920 cover frames
- `exports/posters-4x5`: 1080x1350 feed posters
- `exports/profile-grid-3x4`: 1080x1440 profile grid crops
- `exports/square-safe`: 1080x1080 square center crops
- `guides`: safe-zone reference overlays
- `remotion`: editable Remotion source
- `review-board.html` and `contact-sheet.png`: Creative Production review surfaces

## Rebuild

```bash
cd /Users/zsoskin/dev/yumkitchen-rebuild
python3 social/scripts/build_2026_social_motion_template.py
```
