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

echo "==> Setup complete. Run \`bash verify.sh\` to validate before each PR."
