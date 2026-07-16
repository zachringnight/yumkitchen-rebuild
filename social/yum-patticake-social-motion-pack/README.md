# yum! and patticake social motion pack

Built on 2026-07-10T01:11:37.003370+00:00 from the approved local website photography in `yumkitchen-web/public/images`.

## What is included

- 18 static PNG assets in `exports/`
- 7 MP4 motion assets in `motion/`
- Poster frames in `posters/`
- Captions in `captions.md` and `captions.csv`
- Creative Production review files in `review-board.html`, `contact-sheet.png`, and `moodboard-widget-payload.json`
- Editable Remotion source in `remotion/`

## Production rules

- Text panels are solid white, not tinted.
- Copy avoids prices, unsupported claims, and fake customer reviews.
- Motion uses slow editorial photo movement, simple panel entrances, and readable safe zones.
- Source imagery comes from the current Yum/Patticake website asset folder.

## Rebuild

```bash
cd /Users/zsoskin/dev/yumkitchen-rebuild
python3 social/scripts/build_social_motion_pack.py
```
