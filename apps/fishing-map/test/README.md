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

## Authentication in Tests

Tests use **pre-authentication** to avoid navigating to external OAuth pages during test execution.

### How it works

1. **Global Setup** ([auth-setup.ts](./auth-setup.ts)):
   - Runs once before all tests in a real Playwright browser (no iframe)
   - Checks if dev server is running; starts it automatically if not
   - Navigates to the auth gateway and logs in with test credentials
   - Extracts auth tokens from localStorage
   - Saves tokens to `.auth/tokens.json` in the workspace root
   - Cleanup: Stops dev server after tests if it was started by the setup
   - Vite plugin serves `.auth/tokens.json` at the `/.auth/tokens.json` endpoint
   - This allows browser tests to fetch the tokens file created by global setup

2. **Test Setup** ([vitest.setup.ts](./vitest.setup.ts)):
   - Initializes i18n and mocks browser dialogs
   - Authentication tokens are loaded per-test via render options (see below)

3. **Render Method** ([appTestUtils.tsx](./appTestUtils.tsx)):
   - Accepts `authenticated: true` option to load tokens before rendering
   - Fetches tokens from the `/.auth/tokens.json` endpoint
   - Loads tokens into localStorage for that specific test

### Running Authenticated Tests

**Prerequisites:**

- Environment variables configured (see below)
- Dev server will be started automatically if not already running

**Enable global setup:**

In [vitest.config.mts](../vitest.config.mts), uncomment the `globalSetup` line:

```typescript
globalSetup: './test/auth-setup.ts',
```

**Run tests:**

```bash
# This will authenticate and run tests
# Dev server starts automatically if needed
nx test fishing-map

# Or with UI
nx test:ui fishing-map
```

**How it works:**

- Global setup checks if dev server is running at `http://localhost:3003`
- If not running, it starts the dev server automatically using `nx start fishing-map`
- Waits for server to be ready (up to 2 minutes)
- Authenticates and saves tokens to `.auth/tokens.json` (ignored by git)
- Tests run with authentication
- Dev server is stopped after tests complete (only if it was started by the setup)
- All setup steps are logged to `.auth/auth-setup.log` for debugging

**First run:** Global setup starts server, logs in, saves tokens
**Subsequent runs:** Tests reuse existing tokens unless they expire

**Debugging authentication issues:**

If authentication fails, check `.auth/auth-setup.log` for detailed logs including:

- Dev server startup output
- Browser console messages
- Authentication flow steps
- Error messages and stack traces

### Environment Variables

Required in `.env` or environment:

```bash
# Test credentials
TEST_USER_EMAIL=your-test-user@email.com
TEST_USER_PASSWORD=your-test-password

# API gateway
NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
```

### Writing Authenticated Tests

To test features that require authentication, pass `authenticated: true` to the render method:

```typescript
import { render } from 'test/appTestUtils'

it('should display user-specific data', async () => {
  const { getByTestId } = await render(<App />, {
    store,
    authenticated: true // Loads auth tokens from /.auth/tokens.json
  })

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

| Scenario                        | Approach                                                             |
| ------------------------------- | -------------------------------------------------------------------- |
| **Verify login UI**             | Test that login buttons/links exist and are visible                  |
| **Test authenticated features** | Use pre-authentication (tokens injected via global setup)            |
| **Test full OAuth flow**        | Use Playwright E2E tests in [fishing-map-e2e](../../fishing-map-e2e) |

**Example:**

```typescript
// ✅ Good - verify login prompt exists (unauthenticated)
it('should show login prompt when not logged in', async () => {
  const { getByTestId, getByText } = await render(<App />, { store })
  await openLayerModal()

  expect(getByText('Register or login to upload datasets')).toBeVisible()
  expect(getByTestId('login-link')).toBeVisible() // Just verify it exists
})

// ✅ Good - test authenticated functionality
it('should show user datasets when logged in', async () => {
  // Pass authenticated: true to load tokens before rendering
  const { getByTestId } = await render(<App />, {
    store,
    authenticated: true // Loads tokens from /.auth/tokens.json
  })
})

// ❌ Bad - causes iframe disconnect
it('should log in when clicking login link', async () => {
  await userEvent.click(getByTestId('login-link')) // This navigates away!
  // Error: Cannot connect to iframe
})

// ✅ Good - test logout functionality
it('should clear user data when logging out', async () => {
  const { getByTestId } = await render(<App />, {
    store,
    authenticated: true // GFWAPI.logout() is automatically mocked
  })

  // User is logged in
  expect(getByTestId('user-profile')).toBeVisible()

  // Click logout - the mock prevents invalidating the real token
  await userEvent.click(getByTestId('logout-button'))

  // Verify logout behavior (e.g., UI changes, localStorage cleared)
  expect(getByTestId('login-prompt')).toBeVisible()
})
```
