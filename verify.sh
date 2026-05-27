#!/usr/bin/env bash
# Full verification suite. Run before every PR.
# Exits non-zero if any check fails.

set +e

ERRS=0
GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

run() {
  local label="$1"
  shift
  echo ""
  echo "==> $label"
  if "$@"; then
    echo -e "  ${GREEN}PASS${RESET}: $label"
  else
    echo -e "  ${RED}FAIL${RESET}: $label"
    ERRS=$((ERRS+1))
  fi
}

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$ROOT_DIR/yumkitchen-web"
PORT="${PORT:-3000}"
BASE_URL="http://localhost:${PORT}"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" > /dev/null 2>&1
  fi
}
trap cleanup EXIT

cd "$APP_DIR"

run "TypeScript typecheck" npm run typecheck
run "ESLint" npm run lint
run "Motion governance audit" npm run audit:motion
run "Content validation" npm run validate:content
run "Production build" npm run build

# Em dash check on git diff for current branch.
# Use the UTF-8 byte sequence for U+2014 (em dash) explicitly so the script
# is safe from accidental sed-strip during template setup.
cd "$ROOT_DIR"
echo ""
echo "==> Em dash check (git diff against main)"
EMDASH=$(printf '\xe2\x80\x94')
if git diff main --unified=0 2>/dev/null | grep -E "^\+" | grep -F "$EMDASH" > /dev/null; then
  echo -e "  ${RED}FAIL${RESET}: em dashes found in diff. Replace with hyphens, commas, or sentence breaks."
  ERRS=$((ERRS+1))
else
  echo -e "  ${GREEN}PASS${RESET}: no em dashes in diff"
fi

if ! curl -sf "$BASE_URL" > /dev/null 2>&1; then
  echo ""
  echo "==> Starting production server for browser checks"
  cd "$APP_DIR"
  npm run start -- --hostname 127.0.0.1 --port "$PORT" > /tmp/yum-next-start.log 2>&1 &
  SERVER_PID=$!
  cd "$ROOT_DIR"
  for i in $(seq 1 40); do
    if curl -sf "$BASE_URL" > /dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

if ! curl -sf "$BASE_URL" > /dev/null 2>&1; then
  echo -e "  ${RED}FAIL${RESET}: production server did not start"
  cat /tmp/yum-next-start.log 2>/dev/null
  ERRS=$((ERRS+1))
else
  echo -e "  ${GREEN}PASS${RESET}: production server responding at $BASE_URL"

	  echo ""
	  echo "==> UI smoke test"
	  cd "$APP_DIR"
	  if BASE_URL="$BASE_URL" PORT="$PORT" npm run smoke:ui; then
	    echo -e "  ${GREEN}PASS${RESET}: critical UI flows work"
	  else
	    echo -e "  ${RED}FAIL${RESET}: UI smoke flow failed"
	    ERRS=$((ERRS+1))
	  fi

	  echo ""
	  echo "==> Internal link and anchor audit"
	  if BASE_URL="$BASE_URL" PORT="$PORT" npm run audit:links; then
	    echo -e "  ${GREEN}PASS${RESET}: internal links and anchors resolve"
	  else
	    echo -e "  ${RED}FAIL${RESET}: internal link or anchor failure"
	    ERRS=$((ERRS+1))
	  fi

	  echo ""
	  echo "==> axe-core a11y audit"
	  if BASE_URL="$BASE_URL" PORT="$PORT" npm run a11y; then
    echo -e "  ${GREEN}PASS${RESET}: zero serious/critical violations"
  else
    echo -e "  ${RED}FAIL${RESET}: a11y violations detected"
    ERRS=$((ERRS+1))
  fi

	  echo ""
	  echo "==> Lighthouse mobile (homepage)"
	  if BASE_URL="$BASE_URL" PORT="$PORT" npm run lh > /tmp/yum-lh-out.txt 2>&1; then
    PERF=$(node -e "console.log(Math.round(require('/tmp/yum-lh.json').categories.performance.score*100))")
    A11Y=$(node -e "console.log(Math.round(require('/tmp/yum-lh.json').categories.accessibility.score*100))")
    BP=$(node -e "console.log(Math.round(require('/tmp/yum-lh.json').categories['best-practices'].score*100))")
    SEO=$(node -e "console.log(Math.round(require('/tmp/yum-lh.json').categories.seo.score*100))")
    echo "  Scores: Perf=$PERF A11y=$A11Y BP=$BP SEO=$SEO"
    if [ "$PERF" -lt 90 ] || [ "$A11Y" -lt 95 ] || [ "$BP" -lt 95 ] || [ "$SEO" -lt 100 ]; then
      echo -e "  ${RED}FAIL${RESET}: Lighthouse thresholds not met (P>=90 A>=95 BP>=95 SEO=100)"
      ERRS=$((ERRS+1))
    else
      echo -e "  ${GREEN}PASS${RESET}: Lighthouse thresholds met"
    fi
  else
    echo -e "  ${RED}FAIL${RESET}: Lighthouse failed to run"
    cat /tmp/yum-lh-out.txt
    ERRS=$((ERRS+1))
  fi
  cd "$ROOT_DIR"
fi

echo ""
echo "================================"
if [ $ERRS -eq 0 ]; then
  echo -e "${GREEN}VERIFY PASSED${RESET} - bundle is PR-ready"
  exit 0
else
  echo -e "${RED}VERIFY FAILED${RESET} - $ERRS error(s). Fix before PR."
  exit 1
fi
