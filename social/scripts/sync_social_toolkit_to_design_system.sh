#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DESIGN_SYSTEM="/Users/zsoskin/Downloads/yum!  Patticake Design System"
DEST="$DESIGN_SYSTEM/toolkits/social_media_toolkit_2026-07-09"

mkdir -p "$DEST/toolkit" "$DEST/assets" "$DEST/source/scripts"

rsync -a "$ROOT/social/yum-social-toolkit-2026/" "$DEST/toolkit/"
rsync -a "$ROOT/social/yum-social-launch-batch-2026-07/" "$DEST/launch_batch_2026_07/"
rsync -a "$ROOT/social/yum-patticake-social-motion-pack/" "$DEST/assets/post_worthy_social_pack/"
rsync -a "$ROOT/social/yum-social-motion-template-2026/" "$DEST/assets/motion_template_2026/"
rsync -a "$ROOT/social/instagram/" "$DEST/assets/instagram_legacy_pack/"

cp "$ROOT/social/scripts/build_full_social_toolkit.py" "$DEST/source/scripts/"
cp "$ROOT/social/scripts/build_social_launch_batch.py" "$DEST/source/scripts/"
cp "$ROOT/social/scripts/build_social_motion_pack.py" "$DEST/source/scripts/"
cp "$ROOT/social/scripts/build_2026_social_motion_template.py" "$DEST/source/scripts/"

cp "$ROOT/social/yum-social-toolkit-2026/README.md" "$DEST/README.md"

printf '%s\n' "$DEST"
