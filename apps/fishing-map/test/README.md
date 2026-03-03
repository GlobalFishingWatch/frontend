# Integration Tests

## Running tests locally

```bash
nx test fishing-map
```

With Vitest UI (interactive browser):

```bash
nx test:ui fishing-map
```

## Replicating the CI environment locally

Tests run in CI inside `mcr.microsoft.com/playwright:v1.57.0-noble` (Linux/Noble) with only Chromium and no auth credentials. To reproduce a CI failure locally:

```bash
nx test:ci fishing-map
```

This runs the exact same Docker image and flags as CI (`--browser=chromium`). Requires Docker to be running.

> The Docker image is ~1.5 GB and will be cached after the first pull.

## Reading test artifacts

After a run (local or CI), artifacts are written to `test/integration/`:

| Path               | Contents                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `__screenshots__/` | PNG screenshot taken at the moment of each failure                       |
| `__traces__/`      | Playwright `.trace.zip` files with full timeline, network, DOM snapshots |

### Viewing a trace

```bash
npx playwright show-trace "apps/fishing-map/test/integration/__traces__/<spec>/<trace-file>.trace.zip"
```

The Playwright Trace Viewer shows:

- **Timeline** — every action, click, navigation with timestamps
- **Snapshots** — DOM state before/after each action (use the scrubber to replay)
- **Network** — all requests and responses
- **Console** — browser logs and errors

Example for the vessel popup test:

```bash
npx playwright show-trace "apps/fishing-map/test/integration/__traces__/Vessels.spec.tsx/fishing-map-chromium-Vessel-map-popup-should-open-vessel-popup-on-vessel-click-and-be-able-to-navigate-to-vessel-viewer-0-0.trace.zip"
```

### Downloading CI traces

CI uploads all traces to GCS after each run. The direct download link is printed at the end of the Cloud Build log:

```
📊 Integration Tests Traces: https://storage.googleapis.com/gfw-playwright-traces-ttl30/frontend/integration-tests/<BUILD_ID>/traces.tar.gz
```

Download and extract, then open any `.trace.zip` with the command above.
