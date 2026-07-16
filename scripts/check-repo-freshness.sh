#!/usr/bin/env bash

set -euo pipefail

REMOTE="${FRESHNESS_REMOTE:-origin}"
BASE_BRANCH="${FRESHNESS_BASE_BRANCH:-main}"
CANONICAL_REMOTE="https://github.com/zachringnight/yumkitchen-rebuild.git"
CANONICAL_ZACH_ROOT="/Users/zsoskin/dev/yumkitchen-rebuild"

fail() {
  echo "REPO FRESHNESS FAILED: $1" >&2
  exit 1
}

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || fail "not inside a Git checkout"
ROOT="$(cd "$ROOT" && pwd -P)"
cd "$ROOT"

if [ "$(id -un)" = "zsoskin" ] && [ -d "$CANONICAL_ZACH_ROOT/.git" ]; then
  EXPECTED_ROOT="$(cd "$CANONICAL_ZACH_ROOT" && pwd -P)"
  if [ "$ROOT" != "$EXPECTED_ROOT" ]; then
    fail "wrong checkout: $ROOT. Use $EXPECTED_ROOT"
  fi
fi

ORIGIN_URL="$(git remote get-url "$REMOTE" 2>/dev/null)" || fail "missing $REMOTE remote"
case "$ORIGIN_URL" in
  "$CANONICAL_REMOTE"|git@github.com:zachringnight/yumkitchen-rebuild.git)
    ;;
  *)
    fail "unexpected $REMOTE remote: $ORIGIN_URL"
    ;;
esac

BRANCH="$(git branch --show-current)"
[ -n "$BRANCH" ] || fail "detached HEAD. Check out the intended task branch"

echo "Repository: $ROOT"
echo "Branch: $BRANCH"
echo "Refreshing $REMOTE/$BASE_BRANCH"
git fetch --quiet "$REMOTE" "$BASE_BRANCH" --prune || fail "could not refresh $REMOTE/$BASE_BRANCH"

REMOTE_BASE="$REMOTE/$BASE_BRANCH"
git rev-parse --verify "$REMOTE_BASE" >/dev/null 2>&1 || fail "missing $REMOTE_BASE after fetch"

COUNTS="$(git rev-list --left-right --count "$REMOTE_BASE...HEAD")"
BEHIND="${COUNTS%%[[:space:]]*}"
AHEAD="${COUNTS##*[[:space:]]}"

echo "Relative to $REMOTE_BASE: behind $BEHIND, ahead $AHEAD"

if [ "$BEHIND" -gt 0 ]; then
  fail "$BRANCH is $BEHIND commit(s) behind $REMOTE_BASE. Merge or rebase current main before editing or handoff"
fi

echo "Active worktrees:"
git worktree list
echo "REPO FRESHNESS PASSED"
