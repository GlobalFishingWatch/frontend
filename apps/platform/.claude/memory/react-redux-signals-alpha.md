---
name: react-redux-signals-alpha
description: react-redux 9.4 signals alpha on the platform map — how it is wired, why the reselect shim is gone, and what the benchmark shows (as of 2026-11-04, alpha.2)
---

# react-redux signals alpha: wiring and benchmark (as of 2026-11-04, 9.4.0-alpha.2)

`apps/platform/vite.config.ts` swaps app `react-redux` imports for `react-redux/signals` with a
`resolveId` plugin (`react-redux-signals`). `REACT_REDUX_SIGNALS=false` turns it off.

**Why a plugin and not app code:** `useSignalSelector` throws outside a `<SignalProvider>`, and ~335
files import `useSelector` straight from `react-redux`. The plugin is the whole opt-in in one place,
and it keeps the A/B switch. If signals goes GA, codemod `Provider` → `SignalProvider` and
`useSelector` → `useSignalSelector` (both exported from the main entry since alpha.2), then delete
the plugin.

- **Not a `resolve.alias`:** recharts has its own nested `react-redux@9.3` with no `./signals`
  export, and a global alias breaks the build.
- `node_modules` importers are skipped, so RTK Query hooks keep stock `useSelector`. It works under
  `SignalProvider`. The alpha.2 notes show `buildCreateApi` with `useSignalSelector` for RTKQ; not
  adopted (extra code, unmeasured).

## The reselect shim is gone (deleted 2026-11-04)

alpha.0 handed every hook the same tracking proxy per state, so reselect's `argsMemoize` hit its
cache on the 2nd+ component sharing a `createSelector`, recorded zero deps, and froze that hook (on
`/map`, `selectIsWorkspaceReady` stuck `false`, map never mounted). We worked around it with
`store/reselect-signals-shim.ts` (pass-through `argsMemoize` for every `reselect` importer) plus an
`optimizeDeps.exclude` for `@reduxjs/toolkit` / `reselect`.

alpha.1 fixed it upstream ("every tracked evaluation now gets a fresh root proxy"). Without the
shim, alpha.2 mounted the map on 30/30 cold loads. The shim was also the main cost — see below.

## Measured (2026-11-04)

`ReduxPerf.e2e.spec.ts`, SSR prod builds side by side, headless Chromium + SwiftShader, medians,
pooled from two ABAB runs. Stock = `develop` with `react-redux@9.3.1`.

| metric (ms)              | stock n=16 | signals + shim n=8 | signals, no shim n=12 |
| ------------------------ | ---------- | ------------------ | --------------------- |
| time to map              | 1755       | 2157 (+23%)        | 1860 (+6%)            |
| load TBT                 | 688        | 1151 (+67%)        | 630 (−8%)             |
| interaction long-task ms | 3320       | 5444 (+64%)        | 3247 (−2%)            |
| interaction TBT          | 2353       | 3419 (+45%)        | 2076 (−12%)           |
| long-task count          | 20         | 40 (+98%)          | 26 (+27%)             |
| max event duration       | 644        | 712 (+11%)         | 552 (−14%)            |
| toggle latency           | 349        | 493 (+41%)         | 358 (+2%)             |

Run-to-run noise is large: stock load TBT was 901 in one run and 442 in the next. Read the no-shim
column as **parity with stock**, not a win. The two individual runs disagreed in sign on most rows.
One no-shim warm-up load failed to mount in one run and did not reproduce in 30 cold loads; stock
showed the same transient once. Watch for it.

alpha.0 numbers (2026-09-24, with shim): prod +67% load TBT, +71% interaction long-task ms, +32%
toggle latency. alpha.2 without the shim closes that gap; it does not open a lead.

**How to apply:** signals is not a perf win on `/map` yet, only no longer a loss. Don't make it the
default on perf grounds. Re-run on each new alpha.

## Re-running the benchmark

`apps/platform-e2e/scripts/redux-perf.sh`:

| mode            | compares                                                       | ~time  |
| --------------- | -------------------------------------------------------------- | ------ |
| `dev-toggle`    | `nx start platform`, signals off vs on, same installed package | 20 min |
| `dev-versions`  | `nx start platform`, `BASELINE_VERSION` (9.3.0) vs checked-out | 20 min |
| `prod-versions` | SSR build of `BASE_REF` (develop) in a worktree vs this branch | 15 min |

Compare medians of the same mode only — dev inflates every number. n=8 per variant is not enough
to call a ±20% difference; pool two runs.

Traps:

- **Tracing and video must stay off in that spec.** Both record a screencast; under SwiftShader
  each frame forces a WebGL `ReadPixels` ("GPU stall due to ReadPixels") and starves the page's
  main thread. With the config default `trace: 'retain-on-failure'` the first `page.evaluate`
  after load took 227–1240 s and every run timed out, stock included (fixed 2026-11-04).
- An inherited `NX_WORKSPACE_ROOT_PATH` makes `nx` inside a worktree run against the main checkout.
- `scripts/serve-ssr.mjs` does `pkill -f '.output/server/index.mjs'`, killing every other SSR
  server. Start extra ones with `PORT=… node .output/server/index.mjs`.
- Rebuilding a checkout whose `.output` is being served breaks that server; build the other
  variant in a worktree instead.

See [[browser-testing-uses-platform-e2e]].
