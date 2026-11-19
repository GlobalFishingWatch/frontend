---
name: integration-network-stub
description: The integration specs stub globalThis.fetch and replay recorded API responses — why that seam, the replay/record rules, and the traps that cost time while building it
---

# Integration specs replay the API through a `fetch` stub

`test/utils/network/mock-network.ts` replaces `globalThis.fetch` in `test/setup/vitest.setup.ts`,
before any app module loads. Each request to the API gateway or jsDelivr is answered by a handler,
then by a recorded response in `test/fixtures/api/recorded/` (GET only). If neither matches, the
request stays pending and fails the test when it ends. `VITEST_RECORD=true` forwards GETs to the
dev API and saves them. Built 2026-11; the full usage is in `apps/platform/test/README.md`.

**Why the `fetch` seam, not `GFWAPI.fetch` or MSW:** `GFWAPI` calls the global `fetch`, so its auth
headers, status handling and protobuf decoding stay real. loaders.gl, pmtiles, i18next and TanStack
RPC also call the global `fetch` when the request is made, so one stub covers them all. MSW would add
a service worker to a vitest browser page that already routes module requests through Playwright.

**How to apply:**

- **Never record private data.** The recorder skips URLs containing `private-`, never saves
  `/auth/tokens*` or a 401 on a logged-in request, anonymises `/auth/me` and strips grants on
  private datasets from it. Tests that need real grants go to `platform-e2e`
  ([[browser-testing-uses-platform-e2e]]). Check the fixture diff before committing.
- **Keys:** path plus sorted query (host ignored), `[user]` for logged-in requests, a hash of
  `x-workspace-password`. Guest and logged-in responses differ (vessel tracks and events need a
  login: `vesselTracksAndEventsAllowed: !guestUser`), so without `[user]` one overwrote the other.
  Track requests also get an alias without the thinning params, used only when the exact key is
  missing. Dropping thinning from the key outright broke track clicks.
- **Pending, not failing, on a miss.** The app cancels requests it no longer needs (a search
  replaced by the next keystroke, the cells a hover passes over). A live recording never saves
  those, so failing on the spot reported false leaks.
- **Unrecorded map tiles** (`context-layers`, `user-context-layers`, `4wings/tile/*` z/x/y) get an
  empty 204 with a warning: which tiles load while the camera animates depends on timing.
- **4wings heatmap tiles are synthetic** (`tiles.ts`) with data on one day, `DATA_DAY` (30 days
  before `TEST_END_DATE`). Filling every day crashed the page with an OOM. The grid has to be the
  API's own (recorded in `test/fixtures/api/heatmap-grid/`), because a click sends the cell's column
  and row back to the API. An invented 32×32 grid queried cells that do not exist.
- **The clock moves:** `vi.useFakeTimers({ toFake: ['Date'], shouldAdvanceTime: true })`. A frozen
  `Date.now` stopped `use-debounce` from ever firing, so the vessel search never searched.
- **`vitest.config.ts` pins `VITE_PLATFORM_MODE=false` and `VITE_PIPE_DATASET_VERSION=5`** via
  `process.env`, because every recorded URL carries the pipe version. A Vite `define` did not reach
  the app. `vi.mock` of `PLATFORM_MODE` in a spec closed the browser page and hung the run.
- **Waits, never sleeps:** `waitForLayersLoaded` requires the loaded state to hold for a settle
  window, because right after an action the next load may not have started. It ignores the basemap.
- Static map tiles on Google Cloud Storage (basemap, area PMTiles) still go to the network as of
  2026-11-19. Removing that would need an empty basemap fixture and Range headers in the key.
- **Don't edit `vitest.config.ts` or a spec mid-run:** Vite restarts, the browser session is lost,
  and vitest waits a long time before failing. It looks like a hang in the code under test.

See [[platform-testing]] for how this fits with the other checks.
