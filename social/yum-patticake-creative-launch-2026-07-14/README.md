# yum! and Patticake full social creative system

Fourteen social-first campaign lanes, including a human-first Yum team story, a complete Patticake.com rollout, six swipe-native stories rebuilt as real motion, and a multi-format system built from current high-resolution Yum photography and the newest consolidated Patticake design system.

## creative direction

The system turns the website's strongest interaction idea into campaign language: personalize, then hand off. Each asset gives the real photography the frame, presents one scene message at a time, resolves into a single edge-to-edge editorial field, and uses the Yum logo as the motion player's active marker. The carousel system translates that same behavior into a swipe sequence: cover, useful detail, then one conversion close.

The color hierarchy follows the cake boxes and logo: bright Yum baby blue is the base material, logo red is the stamp, ribbon, headline, and action color, and the photography appears like a product window. Cream is not a core composition color.

Every motion format reserves a solid baby-blue field beside or below the photography from the first frame. One red scene message lives in that field, then resolves into the final hook and action. The Yum logo travels along a red packaging-ribbon playback rail without recoloring or stretching. No copy box, persistent corner lockup, or type glow covers the image.

Carousel counters are plain red type inside the baby-blue field. Static carousel marks and motion playback rails stay off the photography.

The pack does not introduce the unapproved scallop or wave motif from the July 14 handoff.

## outputs

- 14 vertical 1080x1920 MP4 masters at 30 fps and 8 seconds
- 14 vertical 1080x1920 MP4 Shorts-ready cuts at 30 fps and 10 seconds
- 14 feed 1080x1350 MP4 masters at 30 fps and 8 seconds
- 14 square 1080x1080 MP4 masters at 30 fps and 8 seconds
- 14 true-HD wide 1280x720 MP4 masters at 30 fps and 8 seconds
- 6 set-driven carousel stories in both 9:16 and 4:5 motion
- 3 baby-blue Patticake slice-logo MP4s plus transparent WebM and ProRes 4444 masters
- 14 Story stills at 1080x1920
- 14 feed stills at 1080x1350
- 14 square stills at 1080x1080
- 14 wide stills at 1200x675
- 14 link-card stills at 1200x630
- 14 Pinterest stills at 1000x1500
- 6 native 1080x1350 carousel sequences, 31 cards total
- editable Remotion source
- exact campaign and carousel copy, manifest, provenance, and review surfaces
- current Reels, TikTok, and YouTube Shorts publishing guidance

## primary folders

- `exports/motion-9x16/` - 8-second Reels and TikTok masters
- `exports/motion-9x16-10s/` - 10-second Shorts-ready masters
- `exports/motion-4x5/`, `motion-1x1/`, and `motion-16x9/` - native feed, square, and wide motion
- `exports/carousel-motion-9x16/` and `carousel-motion-4x5/` - motion translations of the six swipe stories
- `motion-review/` - poster-led review board for every motion master
- `exports/carousel-4x5/` - six ordered carousel sets
- `carousel-review/` - shared Creative Production review surface for all 31 carousel cards
- `delivery-zips/yum-patticake-creative-launch-motion-2026-07-17.zip` - canonical, checksummed motion launch bundle
- `delivery-zips/patticake-com-launch-rollout-2026-07-17.zip` - complete Patticake.com motion, still, carousel, logo, and publishing bundle
- `delivery-zips/` - upload-ready bundles for each carousel and motion duration
- `delivery-zips/yum-people-behind-the-plate-social.zip` - the human-first 8s, 10s, Story, feed, square, and wide masters

## build

```bash
npm install
npm run render
```

Run from this folder.

Focused renders are also available:

```bash
RENDER_CAROUSELS_ONLY=1 npm run render
RENDER_SHORTS_ONLY=1 npm run render
RENDER_FORMAT_MOTION_ONLY=1 npm run render
RENDER_CAROUSEL_MOTION_ONLY=1 npm run render
RENDER_ALL_MOTION_ONLY=1 npm run render
RENDER_METADATA_ONLY=1 npm run render
npm run render:patticake-logo
npm run package
```
