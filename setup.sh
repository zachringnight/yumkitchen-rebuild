#!/usr/bin/env bash
# Bootstrap script for Codex (or any fresh container).
# Idempotent - safe to re-run.

set -e

echo "==> Verifying Node 20+"
if ! command -v node > /dev/null; then
  echo "ERROR: Node.js not found. Install Node 20+ first." >&2
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node 20+ required (found $NODE_MAJOR)" >&2
  exit 1
fi

echo "==> Installing npm dependencies in yumkitchen-web/"
cd yumkitchen-web
npm install --no-audit --no-fund
cd ..

echo "==> Installing global tools for verify.sh"
npm install -g --no-audit --no-fund lighthouse @axe-core/cli 2>/dev/null || true

echo "==> Verifying reference docs are present"
REQUIRED_REFS=(
  "../05_docs/YumKitchen_RebuildSpec_v1.md"
  "../05_docs/YumKitchen_ChromeReview_v1.md"
  "../05_docs/YumKitchen_Improvements_v1.md"
  "../06_handoff/data/locations.json"
  "../06_handoff/data/menu_seed.json"
)

for f in "${REQUIRED_REFS[@]}"; do
  if [ ! -f "$f" ]; then
    echo "WARN: missing reference $f"
  fi
done

echo "==> Seeding lib/locations.ts and lib/menu.ts from JSON sources"
if [ -f "../06_handoff/data/locations.json" ] && [ ! -f "yumkitchen-web/lib/locations-seed.json" ]; then
  cp ../06_handoff/data/locations.json yumkitchen-web/lib/locations-seed.json
fi

if [ -f "../06_handoff/data/menu_seed.json" ] && [ ! -f "yumkitchen-web/lib/menu-seed.json" ]; then
  cp ../06_handoff/data/menu_seed.json yumkitchen-web/lib/menu-seed.json
fi

echo "==> Setup complete. Run \`bash verify.sh\` to validate before each PR."
