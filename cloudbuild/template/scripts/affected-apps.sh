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

export NODE_PATH="/opt/affected-nx/node_modules"
node /opt/affected-nx/node_modules/nx/bin/nx.js show projects --affected --base="$NX_BASE" --head="$NX_HEAD" --type app --exclude='linting,port-labeler,real-time-prototype,*-e2e,libs/*' --plain > affected-apps.txt
