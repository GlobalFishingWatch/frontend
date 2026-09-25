#!/usr/bin/env bash
# A/B benchmark of react-redux versions/implementations on the platform map.
# Drives src/tests/ReduxPerf.e2e.spec.ts; see apps/platform/.claude/memory/react-redux-signals-alpha.md.
#
# Usage (from anywhere in the repo):
#   apps/platform-e2e/scripts/redux-perf.sh dev-toggle     # nx start: signals off vs on, same package
#   apps/platform-e2e/scripts/redux-perf.sh dev-versions   # nx start: BASELINE_VERSION vs the checked-out one
#   apps/platform-e2e/scripts/redux-perf.sh prod-versions  # SSR build: BASE_REF worktree vs this checkout
#   apps/platform-e2e/scripts/redux-perf.sh summary <file.jsonl>
#
# Env knobs:
#   ITERATIONS=4          page loads per variant per round (2 rounds, ABAB)
#   DEV_PORT=3000         dev server port (passed to `nx start platform --port`)
#   BASELINE_VERSION=9.3.0  react-redux version for dev-versions
#   BASE_REF=develop      git ref built as baseline for prod-versions (served on BASE_PORT)
#   BASE_PORT=3001 CANDIDATE_PORT=3000
#
# Every run needs its ports free: the script refuses to start rather than kill a server you own.
# Results: apps/platform-e2e/test-results/redux-perf/<mode>-<timestamp>.jsonl (+ logs).
set -euo pipefail

ROOT=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
cd "$ROOT"
MODE=${1:-}
ITERATIONS=${ITERATIONS:-4}
DEV_PORT=${DEV_PORT:-3000}
BASELINE_VERSION=${BASELINE_VERSION:-9.3.0}
BASE_REF=${BASE_REF:-develop}
BASE_PORT=${BASE_PORT:-3001}
CANDIDATE_PORT=${CANDIDATE_PORT:-3000}
OUT_DIR=$ROOT/apps/platform-e2e/test-results/redux-perf
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT=$OUT_DIR/$MODE-$STAMP.jsonl
LOG=$OUT_DIR/$MODE-$STAMP
PIDS=()

summary() {
  node -e '
    const rows = require("fs").readFileSync(process.argv[1], "utf8").trim().split("\n").map(JSON.parse)
    const labels = [...new Set(rows.map((r) => r.label))]
    const keys = Object.keys(rows[0]).filter((k) => !["label", "iteration"].includes(k))
    const med = (a) => { a = [...a].sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2 }
    console.log(["metric", ...labels.map((l) => `${l} (n=${rows.filter((r) => r.label === l).length})`), "change"].join(" | "))
    for (const k of keys) {
      const [a, b] = labels.map((l) => med(rows.filter((r) => r.label === l).map((r) => r[k])))
      console.log([k, a, b, `${b >= a ? "+" : ""}${((b / a - 1) * 100).toFixed(0)}%`].join(" | "))
    }' "$1"
}

kill_tree() {
  local child
  for child in $(pgrep -P "$1" || true); do kill_tree "$child"; done
  kill "$1" 2>/dev/null || true
}

stop_servers() {
  local pid
  for pid in "${PIDS[@]+"${PIDS[@]}"}"; do kill_tree "$pid"; done
  PIDS=()
  sleep 3
}

require_free_port() {
  if lsof -iTCP:"$1" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
    echo "port $1 is in use — stop that server first" >&2
    exit 1
  fi
}

wait_for() {
  until curl -s -o /dev/null "http://localhost:$1/platform/map"; do sleep 1; done
}

# bench <label> <port>
bench() {
  echo "  bench $1 on :$2 $(date +%T)"
  PERF_BENCH=1 PERF_ITERATIONS=$ITERATIONS PERF_LABEL=$1 PERF_OUT=$OUT \
    PLAYWRIGHT_BASE_URL=http://localhost:$2 \
    pnpm nx test platform-e2e --grep Perf --reporter=line >"$LOG-$1.log" 2>&1 ||
    echo "  bench $1 failed, see $LOG-$1.log" >&2
}

# start_dev <REACT_REDUX_SIGNALS value>
start_dev() {
  REACT_REDUX_SIGNALS=$1 pnpm nx start platform --port="$DEV_PORT" >>"$LOG-server.log" 2>&1 &
  PIDS+=($!)
  wait_for "$DEV_PORT"
}

# set_version <react-redux version> — rewrites the root manifest and installs it
set_version() {
  sed -i.bak -E "s/\"react-redux\": \"[^\"]+\"/\"react-redux\": \"$1\"/" package.json && rm package.json.bak
  pnpm install >>"$LOG-install.log" 2>&1
  echo "  react-redux $(node -p 'require("react-redux/package.json").version')"
}

trap 'stop_servers' EXIT

case "$MODE" in
  dev-toggle)
    require_free_port "$DEV_PORT"
    for round in 1 2; do
      for variant in stock signals; do
        echo "round $round $variant"
        [ "$variant" = stock ] && flag=false || flag=true
        start_dev "$flag"
        bench "$variant" "$DEV_PORT"
        stop_servers
      done
    done
    ;;

  dev-versions)
    require_free_port "$DEV_PORT"
    CANDIDATE_VERSION=$(node -p 'require("./package.json").dependencies["react-redux"]')
    cp package.json "$LOG-package.json" && cp pnpm-lock.yaml "$LOG-pnpm-lock.yaml"
    # Put the manifest and lockfile back exactly as they were, even on Ctrl+C.
    trap 'stop_servers; cp "$LOG-package.json" package.json; cp "$LOG-pnpm-lock.yaml" pnpm-lock.yaml; pnpm install >>"$LOG-install.log" 2>&1' EXIT
    for round in 1 2; do
      for variant in "$BASELINE_VERSION" "$CANDIDATE_VERSION"; do
        echo "round $round $variant"
        set_version "$variant"
        # The baseline predates `react-redux/signals`; keep the plugin off for it.
        [ "$variant" = "$BASELINE_VERSION" ] && flag=false || flag=true
        start_dev "$flag"
        bench "$variant" "$DEV_PORT"
        stop_servers
      done
    done
    ;;

  prod-versions)
    require_free_port "$BASE_PORT"
    require_free_port "$CANDIDATE_PORT"
    WT=$(mktemp -d)/baseline
    trap 'stop_servers; git -C "$ROOT" worktree remove --force "$WT" 2>/dev/null || true' EXIT
    echo "building baseline $BASE_REF in $WT"
    git worktree add --detach "$WT" "$BASE_REF" >/dev/null
    cp apps/platform/.env "$WT/apps/platform/.env"
    # An inherited NX_WORKSPACE_ROOT_PATH makes nx in the worktree run against this checkout.
    (cd "$WT" && pnpm install --frozen-lockfile >>"$LOG-install.log" 2>&1 &&
      env -u NX_WORKSPACE_ROOT_PATH NX_DAEMON=false pnpm nx build platform >>"$LOG-build-baseline.log" 2>&1)
    echo "building candidate (this checkout)"
    # --skip-nx-cache: REACT_REDUX_SIGNALS is not an nx input, so a cached stock build could be reused.
    pnpm nx build platform --skip-nx-cache >>"$LOG-build-candidate.log" 2>&1
    # Not scripts/serve-ssr.mjs: it pkills every .output/server/index.mjs, including the other one.
    (cd "$WT/apps/platform" && PORT=$BASE_PORT exec node .output/server/index.mjs) >>"$LOG-server.log" 2>&1 &
    PIDS+=($!)
    (cd apps/platform && PORT=$CANDIDATE_PORT exec node .output/server/index.mjs) >>"$LOG-server.log" 2>&1 &
    PIDS+=($!)
    wait_for "$BASE_PORT"
    wait_for "$CANDIDATE_PORT"
    for round in 1 2; do
      echo "round $round"
      bench baseline "$BASE_PORT"
      bench candidate "$CANDIDATE_PORT"
    done
    ;;

  summary)
    summary "${2:?usage: summary <file.jsonl>}"
    exit 0
    ;;

  *)
    sed -n '2,20p' "$0"
    exit 1
    ;;
esac

echo "results: $OUT"
summary "$OUT"
