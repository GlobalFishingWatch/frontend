# Integration Tests

Vitest browser-mode specs in `test/integration/`. They render the real app (TanStack Router + Redux

- Jotai) inside a Playwright-driven browser and hit the **live** GFW API, so results depend on the
  gateway in `.env` being up. For full-page flows (real login, SSR, navigation between pages) use
  `apps/platform-e2e` instead.

## Setup (once)

1. `apps/platform/.env` must exist (copy `.env.sample`). It provides `VITE_API_GATEWAY` and the test
   credentials:

   ```bash
   TEST_USER_EMAIL=...
   TEST_USER_PASSWORD=...
   ```

   Without credentials the run still works: authenticated specs run as a guest and fail.

2. Install the browsers: `pnpm exec playwright install chromium` (add `firefox webkit` for the
   full matrix).

No dev server is needed. Vitest starts its own Vite server for the specs.

## Running

Run everything from the workspace root, through Nx. `--` passes the rest to `vitest`.

| Task                        | Command                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| Whole suite, Chromium only  | `TEST_CHROME_ONLY=true pnpm nx test platform`                                  |
| Whole suite, all 3 browsers | `pnpm nx test platform`                                                        |
| One spec file               | `TEST_CHROME_ONLY=true pnpm nx test platform -- test/integration/App.spec.tsx` |
| One test by name            | `TEST_CHROME_ONLY=true pnpm nx test platform -- -t "layer toggle"`             |
| Interactive UI (Chromium)   | `pnpm nx test:ui platform`                                                     |
| Watch mode                  | `pnpm nx test:watch platform`                                                  |

- `TEST_CHROME_ONLY=true` is what CI uses. Without it every spec runs three times (Chromium,
  Firefox, WebKit), serially.
- `platform:test` is cached by Nx, but the specs depend on the live API. Add `--skip-nx-cache` when
  you want a real run against unchanged code.
- Every test target first runs `clean-test-artifacts`, so artifacts from the previous run are gone.

CI: `.github/workflows/integration-tests.yml` runs `nx affected -t test` with `TEST_CHROME_ONLY=true`
on every non-draft PR and posts the result as a sticky PR comment.

## What happens during a run

1. **Global setup** (`setup/vitest.setup-global.ts` → `setup/login/auth-setup.ts`) runs in Node
   before any spec. If `test/.auth/tokens.json` holds a token the API still accepts, it is reused.
   Otherwise it launches headless Chromium, starts a small callback server on port **3000**
   (`setup/login/proxy-server.ts`), logs in through the gateway with the `.env` credentials and
   writes `test/.auth/tokens.json` (gitignored). Every step is logged to `test/.auth/auth-setup.log`.
   A login failure is logged, not thrown, so unauthenticated specs still run.
2. **Per-file setup** (`setup/vitest.setup.ts`) runs in the browser: fixes the clock to
   `TEST_END_DATE` (`setup/config.ts`), initializes i18n, and pre-sets the localStorage keys that
   would otherwise open welcome / onboarding / update-video popups over the map.
3. **Specs** call `render()` from `test/appTestUtils.tsx` with a store built from
   `test/utils/store` (`defaultState` = a snapshot of the Redux state).

## Reading failures

| Path                                                        | Contents                                  |
| ----------------------------------------------------------- | ----------------------------------------- |
| `.vitest/attachments/failure-screenshots/<spec>/<test>.png` | Screenshot at the moment each test failed |
| `test/.auth/auth-setup.log`                                 | Login flow log, browser console included  |
| `test/integration/__traces__/`                              | Playwright traces, `test:ui` runs only    |

The screenshot is usually enough. A test that times out on `locator.click` with a popup or the
landing page in the screenshot is a setup problem (localStorage keys, `defaultState`), not a
problem in the feature under test.

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

To test features that require authentication, pass `authenticated: true` to the render method:

```typescript
import { render } from 'test/appTestUtils'

it('should display user-specific data', async () => {
  const { getByTestId } = await render({ store, authenticated: true })

  // Your assertions here - API calls will include auth tokens
  expect(getByTestId('user-profile')).toBeVisible()
})
```

**How it works:**

- `authenticated: true` fetches tokens from `/.auth/tokens.json` (created by global setup)
- Tokens are loaded into localStorage before rendering
- Each test decides independently whether to run authenticated or not
- Tests without the option run unauthenticated (guest user)

**Logout is mocked in authenticated tests:**

- The `GFWAPI.logout()` method is automatically mocked when `authenticated: true`
- Mock only clears localStorage, doesn't invalidate the server-side token
- This prevents tests from invalidating shared auth tokens for subsequent tests
- Tests can safely call logout without affecting other test runs

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
| **Test authenticated features** | Use pre-authentication (tokens injected via global setup)      |
| **Test full OAuth flow**        | Use Playwright E2E tests in [platform-e2e](../../platform-e2e) |

**Example:**

```typescript
// ✅ Good - verify login prompt exists (unauthenticated)
it('should show login prompt when not logged in', async () => {
  const { getByTestId, getByText } = await render({ store })
  await openLayerModal()

  expect(getByText('Register or login to upload datasets')).toBeVisible()
  expect(getByTestId('login-link')).toBeVisible() // Just verify it exists
})

// ✅ Good - test authenticated functionality
it('should show user datasets when logged in', async () => {
  // Pass authenticated: true to load tokens before rendering
  const { getByTestId } = await render({
    store,
    authenticated: true,
  })
})

// ❌ Bad - causes iframe disconnect
it('should log in when clicking login link', async () => {
  await userEvent.click(getByTestId('login-link')) // This navigates away!
  // Error: Cannot connect to iframe
})

// ✅ Good - test logout functionality
it('should clear user data when logging out', async () => {
  const { getByTestId } = await render({
    store,
    authenticated: true, // GFWAPI.logout() is automatically mocked
  })

  // User is logged in
  expect(getByTestId('user-profile')).toBeVisible()

  // Click logout - the mock prevents invalidating the real token
  await userEvent.click(getByTestId('logout-button'))

  // Verify logout behavior (e.g., UI changes, localStorage cleared)
  expect(getByTestId('login-prompt')).toBeVisible()
})
```
