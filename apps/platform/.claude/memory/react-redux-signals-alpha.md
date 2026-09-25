---
name: react-redux-signals-alpha
description: react-redux 9.4.0-alpha.0 signals freezes UI with shared reselect selectors and benchmarked slower on the map; why and how it is wired
---

# react-redux signals (9.4.0-alpha.0): stale selectors with reselect, and slower on the map

Tried 2026-09-24. `apps/platform/vite.config.ts` swaps app `react-redux` imports for
`react-redux/signals` with a `resolveId` plugin (`react-redux-signals`); `REACT_REDUX_SIGNALS=false`
turns it off.

**Why:**

- **Correctness bug.** Signals hands every hook the same tracking proxy for a given state
  (cached per target in the Provider-wide registry). reselect 5's default `argsMemoize`
  (`weakMapMemoize`, keyed on that state) makes the 2nd+ component sharing a `createSelector` hit
  the cache without reading state. Signals records zero dependencies for that hook, so it never
  updates again. On `/map` this left `selectIsWorkspaceReady` stuck at `false` in `MapMainLayout`,
  so the map and timebar never mounted — no error, and the store said `workspace.status: finished`.
  Reproduced with plain RTK: two components, one `createSelector`, alternate dispatches.
- **Workaround:** `store/reselect-signals-shim.ts` replaces `reselect` for every importer (RTK and
  RTK Query included) with a pass-through `argsMemoize`. Dev also needs `@reduxjs/toolkit` and
  `reselect` excluded from `optimizeDeps`, because dep pre-bundling skips resolve plugins.
- **Not a `resolve.alias`:** recharts has its own nested `react-redux@9.3` with no `./signals`
  export, and a global alias breaks the build.

**Measured** (`apps/platform-e2e/src/tests/ReduxPerf.e2e.spec.ts`, ABAB, n=8 per variant,
headless Chromium with SwiftShader, medians, signals vs stock):

| build            | time to map | load TBT | interaction long-task ms | toggle latency |
| ---------------- | ----------- | -------- | ------------------------ | -------------- |
| prod (SSR build) | −4%         | +67%     | +71% (2× long tasks)     | +32%           |
| dev (`nx start`) | +203%       | +819%    | +222%                    | +287%          |
| dev, vs `9.3.0`  | +179%       | +819%    | +142%                    | +217%          |
| prod, vs `9.3.0` | +5%         | +101%    | +55% (+83% long tasks)   | +12%           |

The first two rows compare against the alpha package with stock hooks (`REACT_REDUX_SIGNALS=false`).
The `vs 9.3.0` rows compare against a real `9.3.0` install. For the prod one, `9.3.0` was built in
a git worktree and served on another port so both servers ran side by side. Two traps from that
setup: an inherited `NX_WORKSPACE_ROOT_PATH` makes `nx` inside a worktree run against the main
checkout, and `scripts/serve-ssr.mjs` does `pkill -f '.output/server/index.mjs'`, which kills
every other SSR server — start the second one with `PORT=… node .output/server/index.mjs`.

With stock hooks plus only the shim, prod moved by +2% TBT, +2% toggle latency and +12% long-task
time. So the shim is not the main cost; the signals engine is.

**How to apply:** do not make signals the default until react-redux fixes the shared-selector
bug and the benchmark shows a gain. Re-run with `apps/platform-e2e/scripts/redux-perf.sh`:

| mode            | compares                                                       | ~time  |
| --------------- | -------------------------------------------------------------- | ------ |
| `dev-toggle`    | `nx start platform`, signals off vs on, same installed package | 20 min |
| `dev-versions`  | `nx start platform`, `BASELINE_VERSION` (9.3.0) vs checked-out | 20 min |
| `prod-versions` | SSR build of `BASE_REF` (develop) in a worktree vs this branch | 15 min |

To try a newer alpha: bump `react-redux` in the root `package.json`, `pnpm install`, then run
`dev-versions` and `prod-versions`. Compare medians of the same mode only — dev inflates every
number, so a dev-vs-prod comparison is meaningless. Keep Playwright
`video: 'off'` in that spec: screencast recording hung the production build's main thread
mid-load. See [[browser-testing-uses-platform-e2e]].
