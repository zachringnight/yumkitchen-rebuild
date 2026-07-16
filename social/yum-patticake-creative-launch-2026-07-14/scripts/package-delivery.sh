#!/bin/zsh

set -euo pipefail

ROOT="${0:A:h:h}"
OUT="$ROOT/delivery-zips"
STAGING_ROOT="$ROOT/delivery-motion"
PACK_NAME="yum-patticake-creative-launch-motion-2026-07-15"
STAGE="$STAGING_ROOT/$PACK_NAME"
PATTICAKE_PACK_NAME="patticake-com-launch-rollout-2026-07-15"
PATTICAKE_STAGE="$STAGING_ROOT/$PATTICAKE_PACK_NAME"

mkdir -p "$OUT"
rm -f \
  "$OUT/yum-pick-your-kitchen-carousel.zip" \
  "$OUT/yum-feed-the-room-carousel.zip" \
  "$OUT/patticake-send-cake-carousel.zip" \
  "$OUT/yum-patticake-motion-10s.zip" \
  "$OUT/yum-patticake-motion-8s.zip" \
  "$OUT/yum-people-behind-the-plate-social.zip" \
  "$OUT/$PACK_NAME.zip" \
  "$OUT/$PATTICAKE_PACK_NAME.zip"

cd "$ROOT/exports/carousel-4x5/pick-your-kitchen"
zip -q -X "$OUT/yum-pick-your-kitchen-carousel.zip" ./*.png

cd "$ROOT/exports/carousel-4x5/feed-the-room"
zip -q -X "$OUT/yum-feed-the-room-carousel.zip" ./*.png

cd "$ROOT/exports/carousel-4x5/send-cake"
zip -q -X "$OUT/patticake-send-cake-carousel.zip" ./*.png

cd "$ROOT/exports/motion-9x16-10s"
zip -q -X "$OUT/yum-patticake-motion-10s.zip" ./*.mp4

cd "$ROOT/exports/motion-9x16"
zip -q -X "$OUT/yum-patticake-motion-8s.zip" ./*.mp4

cd "$ROOT"
zip -q -X "$OUT/yum-people-behind-the-plate-social.zip" \
  exports/motion-9x16/yum-people-behind-the-plate.mp4 \
  exports/motion-9x16-10s/yum-people-behind-the-plate.mp4 \
  exports/story-9x16/yum-people-behind-the-plate.png \
  exports/feed-4x5/yum-people-behind-the-plate.png \
  exports/square-1x1/yum-people-behind-the-plate.png \
  exports/wide-16x9/yum-people-behind-the-plate.png

rm -rf "$STAGE"
mkdir -p \
  "$STAGE/01-primary-10s-9x16" \
  "$STAGE/02-cutdowns-8s-9x16" \
  "$STAGE/03-feed-motion-8s-4x5" \
  "$STAGE/04-square-motion-8s-1x1" \
  "$STAGE/05-wide-motion-8s-16x9" \
  "$STAGE/06-carousel-motion-9x16" \
  "$STAGE/07-carousel-motion-4x5" \
  "$STAGE/08-brand-motion" \
  "$STAGE/09-posters" \
  "$STAGE/docs"

cp "$ROOT"/exports/motion-9x16-10s/*.mp4 "$STAGE/01-primary-10s-9x16/"
cp "$ROOT"/exports/motion-9x16/*.mp4 "$STAGE/02-cutdowns-8s-9x16/"
cp "$ROOT"/exports/motion-4x5/*.mp4 "$STAGE/03-feed-motion-8s-4x5/"
cp "$ROOT"/exports/motion-1x1/*.mp4 "$STAGE/04-square-motion-8s-1x1/"
cp "$ROOT"/exports/motion-16x9/*.mp4 "$STAGE/05-wide-motion-8s-16x9/"
cp "$ROOT"/exports/carousel-motion-9x16/*.mp4 "$STAGE/06-carousel-motion-9x16/"
cp "$ROOT"/exports/carousel-motion-4x5/*.mp4 "$STAGE/07-carousel-motion-4x5/"
cp "$ROOT"/exports/brand-motion/* "$STAGE/08-brand-motion/"
cp "$ROOT"/motion-review/posters/* "$STAGE/09-posters/"
cp \
  "$ROOT/README.md" \
  "$ROOT/START-HERE.md" \
  "$ROOT/manifest.json" \
  "$ROOT/platform-publishing.md" \
  "$ROOT/social-copy-and-alt-text.md" \
  "$ROOT/provenance.md" \
  "$ROOT/motion-production.md" \
  "$ROOT/motion-qa-report.json" \
  "$ROOT/PATTICAKE-LAUNCH-ROLLOUT.md" \
  "$STAGE/docs/"

(
  cd "$STAGE"
  find . -type f ! -name SHA256SUMS.txt -print | LC_ALL=C sort | while IFS= read -r file; do
    shasum -a 256 "$file"
  done
) > "$STAGE/SHA256SUMS.txt"

cd "$STAGING_ROOT"
zip -q -X -r "$OUT/$PACK_NAME.zip" "$PACK_NAME"

rm -rf "$PATTICAKE_STAGE"
mkdir -p \
  "$PATTICAKE_STAGE/01-primary-10s-9x16" \
  "$PATTICAKE_STAGE/02-cutdowns-8s-9x16" \
  "$PATTICAKE_STAGE/03-feed-motion-8s-4x5" \
  "$PATTICAKE_STAGE/04-square-motion-8s-1x1" \
  "$PATTICAKE_STAGE/05-wide-motion-8s-16x9" \
  "$PATTICAKE_STAGE/06-story-stills-9x16" \
  "$PATTICAKE_STAGE/07-feed-stills-4x5" \
  "$PATTICAKE_STAGE/08-square-stills-1x1" \
  "$PATTICAKE_STAGE/09-wide-stills-16x9" \
  "$PATTICAKE_STAGE/10-link-stills-1.91x1" \
  "$PATTICAKE_STAGE/11-pin-stills-2x3" \
  "$PATTICAKE_STAGE/12-carousel-cards-4x5" \
  "$PATTICAKE_STAGE/13-carousel-motion-9x16" \
  "$PATTICAKE_STAGE/14-carousel-motion-4x5" \
  "$PATTICAKE_STAGE/15-brand-motion" \
  "$PATTICAKE_STAGE/16-posters" \
  "$PATTICAKE_STAGE/docs"

cp "$ROOT"/exports/motion-9x16-10s/patticake-*.mp4 "$PATTICAKE_STAGE/01-primary-10s-9x16/"
cp "$ROOT"/exports/motion-9x16/patticake-*.mp4 "$PATTICAKE_STAGE/02-cutdowns-8s-9x16/"
cp "$ROOT"/exports/motion-4x5/patticake-*.mp4 "$PATTICAKE_STAGE/03-feed-motion-8s-4x5/"
cp "$ROOT"/exports/motion-1x1/patticake-*.mp4 "$PATTICAKE_STAGE/04-square-motion-8s-1x1/"
cp "$ROOT"/exports/motion-16x9/patticake-*.mp4 "$PATTICAKE_STAGE/05-wide-motion-8s-16x9/"
cp "$ROOT"/exports/story-9x16/patticake-*.png "$PATTICAKE_STAGE/06-story-stills-9x16/"
cp "$ROOT"/exports/feed-4x5/patticake-*.png "$PATTICAKE_STAGE/07-feed-stills-4x5/"
cp "$ROOT"/exports/square-1x1/patticake-*.png "$PATTICAKE_STAGE/08-square-stills-1x1/"
cp "$ROOT"/exports/wide-16x9/patticake-*.png "$PATTICAKE_STAGE/09-wide-stills-16x9/"
cp "$ROOT"/exports/link-1.91x1/patticake-*.png "$PATTICAKE_STAGE/10-link-stills-1.91x1/"
cp "$ROOT"/exports/pin-2x3/patticake-*.png "$PATTICAKE_STAGE/11-pin-stills-2x3/"

for set_id in send-cake meet-patticake how-to-patticake patticake-occasions; do
  cp -R "$ROOT/exports/carousel-4x5/$set_id" "$PATTICAKE_STAGE/12-carousel-cards-4x5/"
  cp "$ROOT/exports/carousel-motion-9x16/$set_id.mp4" "$PATTICAKE_STAGE/13-carousel-motion-9x16/"
  cp "$ROOT/exports/carousel-motion-4x5/$set_id.mp4" "$PATTICAKE_STAGE/14-carousel-motion-4x5/"
done

cp "$ROOT"/exports/brand-motion/* "$PATTICAKE_STAGE/15-brand-motion/"
find "$ROOT/motion-review/posters" -type f \( -name '*patticake*' -o -name '*send-cake*' \) -exec cp {} "$PATTICAKE_STAGE/16-posters/" \;
cp \
  "$ROOT/README.md" \
  "$ROOT/START-HERE.md" \
  "$ROOT/PATTICAKE-LAUNCH-ROLLOUT.md" \
  "$ROOT/manifest.json" \
  "$ROOT/platform-publishing.md" \
  "$ROOT/social-copy-and-alt-text.md" \
  "$ROOT/carousel-publishing.md" \
  "$ROOT/provenance.md" \
  "$ROOT/motion-production.md" \
  "$ROOT/motion-qa-report.json" \
  "$PATTICAKE_STAGE/docs/"

(
  cd "$PATTICAKE_STAGE"
  find . -type f ! -name SHA256SUMS.txt -print | LC_ALL=C sort | while IFS= read -r file; do
    shasum -a 256 "$file"
  done
) > "$PATTICAKE_STAGE/SHA256SUMS.txt"

cd "$STAGING_ROOT"
zip -q -X -r "$OUT/$PATTICAKE_PACK_NAME.zip" "$PATTICAKE_PACK_NAME"

echo "Packaged delivery files in $OUT"
echo "Canonical motion bundle: $OUT/$PACK_NAME.zip"
echo "Patticake.com launch rollout: $OUT/$PATTICAKE_PACK_NAME.zip"
