#!/bin/bash
set -euo pipefail

NX_BASE="${NX_BASE:-origin/develop~1}"
NX_HEAD="${NX_HEAD:-HEAD}"
BASE_REF="${NX_BASE%%~*}"

# Ensure Nx can resolve the configured base ref without fetching every branch.
if [[ "$BASE_REF" == origin/* ]] && ! git rev-parse --verify --quiet "$BASE_REF" >/dev/null; then
  BASE_BRANCH="${BASE_REF#origin/}"
  git fetch --no-tags --depth=2 origin "${BASE_BRANCH}:refs/remotes/origin/${BASE_BRANCH}"
fi

pnpm exec nx show projects --affected --base="$NX_BASE" --head="$NX_HEAD" --type app --exclude='linting,port-labeler,*-e2e,libs/*' --plain 2>/dev/null | grep -E '^[a-zA-Z][a-zA-Z0-9_-]*$' > affected-apps.txt
