# Integration Tests

Vitest browser-mode specs in `test/integration/`. They render the real app (TanStack Router + Redux +
Jotai) inside a Playwright-driven browser, **without the GFW API**: a stub on `fetch` answers every
API request from handlers or from responses recorded once from the dev API
(`test/fixtures/api/recorded/`). A run needs no credentials and no gateway. For anything whose value
is the real backend (real login, permissions, private data, writes) use `apps/platform-e2e`.

## Setup (once)

1. Install the browsers: `pnpm exec playwright install chromium` (add `firefox webkit` for the full
   matrix).
2. Use Node ≥ 24 (`.nvmrc`). Under an older Node the Nx project graph fails to load.

No dev server, no `.env` credentials. Vitest starts its own Vite server for the specs. Credentials
are only needed to [re-record](#re-recording-the-api-responses).

## Running

Run everything from the workspace root, through Nx. `--` passes the rest to `vitest`.

| Task                        | Command                                                  |
| --------------------------- | -------------------------------------------------------- |
| Whole suite (Chromium)      | `pnpm nx test platform`                                  |
| Whole suite, all 3 browsers | `TEST_ALL_BROWSERS=true pnpm nx test platform`           |
| One spec file               | `pnpm nx test platform -- test/integration/App.spec.tsx` |
| One test by name            | `pnpm nx test platform -- -t "layer toggle"`             |
| Interactive UI (Chromium)   | `pnpm nx test:ui platform`                               |
| Watch mode                  | `pnpm nx test:watch platform`                            |

- Runs use Chromium only, like CI. `TEST_ALL_BROWSERS=true` adds Firefox and WebKit (serially,
  three times as long). They are not run in CI, so expect failures there; install them first with
  `pnpm exec playwright install firefox webkit`.
- Specs listed in `LEGACY_SPECS` (`vitest.config.ts`) are excluded from every run, CI included.
  `INTEGRATION_INCLUDE_LEGACY=true` runs them anyway, e.g. to see what one still needs.
- `VITEST_NETWORK_DEBUG=true` logs every external request, how it was answered and how it settled.
- Every test target first runs `clean-test-artifacts`, so artifacts from the previous run are gone.
- **Don't edit `vitest.config.ts` or a spec while a run is going.** Vite restarts or hot-reloads,
  the browser session is lost, and vitest waits on it for a long time before failing.

CI: `.github/workflows/integration-tests.yml` runs `nx affected -t integration-ci --parallel=1`
(one Nx task per spec file) on Chromium, offline and without logging in, and
writes the result to the job summary.

## What happens during a run

1. **Per-file setup** (`setup/vitest.setup.ts`) runs in the browser:
   - installs the network stub (`utils/network/mock-network.ts`) before any app module loads;
   - starts the clock at `TEST_END_DATE` (`setup/config.ts`). The clock **moves**: a frozen
     `Date.now()` stopped `use-debounce` (the vessel search box) from ever firing;
   - initializes i18n and pre-sets the localStorage keys that would otherwise open welcome,
     onboarding or update-video popups over the map.
2. **Specs** call `render()` from `test/appTestUtils.tsx` with a store built from
   `test/utils/store` (`defaultState` = a snapshot of the Redux state). `render()` returns the
   Redux `store`, the `router` and the `jotaiStore` it used.
3. **After each test** the stub fails the test if any API request was left unanswered.

The app runs with three values pinned in `vitest.config.ts`, whatever your `.env` says:
`VITE_PLATFORM_MODE=false` (production's legacy nav), `VITE_PIPE_DATASET_VERSION=5` (every
recorded URL carries it) and `VITE_WORKSPACE_ENV=development` (the recordings come from the dev
API, and `production` would request i18n labels at `@stable` instead of `@latest`).

## The network stub

Every request to the API gateway or to jsDelivr (i18n labels) is answered, in this order, by:

1. a **handler**: `mockApi.use(...)` in the spec, then the defaults in `utils/network/handlers`;
2. a **recorded response** in `test/fixtures/api/recorded/` (GET only);
3. nothing: the request is reported and the test fails with
   `Unmocked network requests (record them with VITEST_RECORD=true, or add a handler)`.

Same-origin requests (Vite modules, locales, sprites) and the static map tiles on Google Cloud
Storage (basemap, area polygons) go to the network.

Details that explain most surprises:

- **Unanswered requests stay pending** instead of failing on the spot. The app cancels many requests
  it no longer needs (a search replaced by the next keystroke, the cells a hover passes over), and a
  live recording never saves those. Only a request still pending when the test ends is a failure.
- **Unrecorded map tiles** (`…/{z}/{x}/{y}` under `context-layers`, `user-context-layers` and
  `4wings/tile/*`) are answered with an empty tile and a warning, not a failure: tiles requested
  while the camera animates depend on timing. Everything else stays strict.
- **4wings heatmap tiles are synthetic** (`utils/network/tiles.ts`): every cell holds a value on one
  day, `DATA_DAY` (30 days before `TEST_END_DATE`). The grid is the API's own, recorded per tile in
  `test/fixtures/api/heatmap-grid/`, because a click sends the cell's column and row to the API.
  Use `getDataDayTimebarX()` (`utils/timebar.ts`) to hover or drag the timebar where there is data,
  and `heatmapTile({ value })` in a spec when a test needs values that vary with the request.
- **Recordings are keyed** by path and sorted query (host ignored), plus `[user]` for logged-in
  requests and a hash of the workspace password header. Track requests also get an alias without
  the simplification parameters, used only when the exact level was never recorded.
- **When the exact key is missing**, a few fallbacks apply, each logged as a warning:
  - a logged-in request reuses the **guest** recording of the same URL, if that was a 200 (public
    data is the same for both; a guest 401/403 is never reused, and `/auth/` is excluded);
  - a 4wings **interaction** gets the recording for another cell with the same datasets and query,
    and a context **feature** (`…/context-layers/<id>`) another feature of the same dataset. Which
    cell a click lands in, or which area a hover crosses, depends on where the camera settles;
  - `/dataviews?ids=…` and `/datasets?ids=…` are rebuilt from every recorded batch, by id. The app batches
    the ids it is missing differently run to run. An id never recorded is left out.

  The fallbacks need the list of recordings, which the browser cannot read itself: the
  `listRecordings` command (`test/utils/vitest/commands.ts`) lists them from Node.

## Re-recording the API responses

A daily workflow (`.github/workflows/record-integration-fixtures.yml`, or a manual dispatch) re-records every spec from `develop`. It replays them offline, then opens or updates one draft PR from `chore/integration-fixtures` when the
recordings changed. Review that PR's diff for
private data before merging; Integration Tests does not run on it, so its body carries the job's
recording and replay results.

Record locally when you write a new spec or change which requests one makes, so its PR can pass
before the daily job runs:

```bash
VITEST_RECORD=true pnpm nx test platform --skip-nx-cache -- test/integration/<Spec>.spec.tsx
```

Then check the recordings before committing. Integration Tests runs the same script on every PR and
fails it when a recording mentions a private dataset, a token or the test user's email:

```bash
TEST_USER_EMAIL=<test user email> apps/platform/scripts/check-recordings.sh
```

Record mode needs `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` in `apps/platform/.env`: global setup
logs in once (`setup/login/auth-setup.ts`, log in `test/.auth/auth-setup.log`) and the stub
forwards every GET it has no handler for to the dev API, saving the response. It never forwards a
POST/PATCH/DELETE, so recording cannot write to the backend.

What never reaches a file:

- responses for private datasets (any URL containing `private-`);
- auth token requests (`/auth/tokens…`), forwarded so a long run can renew its session;
- a 401 on a logged-in request (the recording session lost its login);
- personal fields and private-dataset grants in `/auth/me`, which is anonymised.

Delete the old recordings of the specs you re-record first, or stale files pile up. Then run the spec
again **without** `VITEST_RECORD` to check it passes offline. Before committing, check the diff for
anything that should not be public.

## Reading failures

| Path                                                        | Contents                                  |
| ----------------------------------------------------------- | ----------------------------------------- |
| `.vitest/attachments/failure-screenshots/<spec>/<test>.png` | Screenshot at the moment each test failed |
| `test/.auth/auth-setup.log`                                 | Record-mode login log                     |
| `test/integration/__traces__/`                              | Playwright traces, `test:ui` runs only    |

The screenshot is usually enough. A test that times out on `locator.click` with a popup or the
landing page in the screenshot is a setup problem (localStorage keys, `defaultState`), not a
problem in the feature under test. An `Unmocked network requests` failure names the requests: record
them or add a handler.

Headless runs do not record traces: the config only traces on retry, and `retry` is 0. Run the spec
with `pnpm nx test:ui platform` to get one, then open it:

```bash
pnpm exec playwright show-trace "apps/platform/test/integration/__traces__/<spec>/<trace-file>.trace.zip"
```

### When `defaultState` drifts from the app

`test/utils/store/state.ts` is a hand-kept snapshot, not derived from the slices. When a slice gains
a field, the snapshot does not, and selectors read `undefined`. Example: the `modals` snapshot lacked
`updateVideo`, so `state.modals.updateVideo !== false` read as "open" and the video modal covered
every spec. Add new slice fields to the snapshot when you add them to the slice.

## Authentication in tests

### Writing authenticated tests

Pass `authenticated: true` to `render()`:

```typescript
import { render } from 'test/appTestUtils'

it('should display user-specific data', async () => {
  const { getByTestId } = await render({ store, authenticated: true })
  await expect.element(getByTestId('user-profile')).toBeVisible()
})
```

**How it works:**

- Outside record mode no login happens: `render()` stores a fake token, and `/auth/me` is answered
  from the anonymised recording. A token renewal is answered with the same fake token.
- Logged-in requests are recorded and replayed under their own `[user]` keys.
- In record mode, `render()` loads the real tokens from `/.auth/tokens.json` (written by global setup).
- `GFWAPI.logout()` is mocked: it only clears localStorage.

Anything that depends on the test user's real grants (private workspaces, private datasets) cannot be
replayed, since private data is never recorded. Test it in `apps/platform-e2e`.

### Testing Login Flows

**❌ Don't test actual login navigation in Vitest browser mode**

The iframe architecture prevents external navigation. Clicking login links causes errors:

- `"Cannot connect to iframe"` when navigating to external auth gateway
- OAuth callback redirects break the test runner connection
- This is inherent to iframe-based testing, not a bug

**✅ Do this instead:**

| Scenario                        | Approach                                                       |
| ------------------------------- | -------------------------------------------------------------- |
| **Verify login UI**             | Test that login buttons/links exist and are visible            |
| **Test authenticated features** | `render({ authenticated: true })`                              |
| **Test full OAuth flow**        | Use Playwright E2E tests in [platform-e2e](../../platform-e2e) |

```typescript
// ✅ Good - verify login prompt exists (unauthenticated)
it('should show login prompt when not logged in', async () => {
  const { getByTestId, getByText } = await render({ store })
  await openLayerModal()

  await expect.element(getByText('Register or login to upload datasets')).toBeVisible()
  await expect.element(getByTestId('login-link')).toBeVisible()
})

// ❌ Bad - causes iframe disconnect
it('should log in when clicking login link', async () => {
  await userEvent.click(getByTestId('login-link')) // This navigates away!
  // Error: Cannot connect to iframe
})
```
