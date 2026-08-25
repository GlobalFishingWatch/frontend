# Platform E2E Tests

This project contains end-to-end tests for the Platform application using [Playwright](https://playwright.dev/) and [Nx](https://nx.dev/).

## Prerequisites

- Node.js and Yarn installed
- Playwright browsers installed: `npx playwright install`

## Running Tests

### Available Targets

#### `test` - Standard E2E Run

Runs all tests with caching enabled. Best for CI/CD and regular test runs.

```bash
nx test platform-e2e
```

#### `test:local` - Local Development

Runs all tests without caching and automatically starts the `platform` server. Useful for local development when you want fresh runs.

```bash
nx test:local platform-e2e
```

#### `test:local` with configurations

Opens Playwright's interactive UI for debugging and watching tests run.

```bash
nx test:local platform-e2e -c ui
```

Runs tests with visible browser windows. Useful for debugging visual issues.

```bash
nx test:local platform-e2e -c headed
```

### Running by Tag

Tests are tagged (see `src/tags.ts`). Screenshot comparison specs are excluded from `test` / `test:local` (including these configurations). Untagged specs (Map, Report, Vessel, Workspace) only run in the default and `regression` suites.

Use `-c smoke|extended|regression` on `test` (CI / already-running server) or `test:local` (starts the platform server). The colon form is equivalent: `nx run platform-e2e:test:smoke` is `project:target:configuration`. Infix `nx test:smoke platform-e2e` is not valid — that looks for a target named `test:smoke`.

#### Smoke (`-c smoke`)

Runs `@smoke`-tagged tests on Chromium only. Fastest signal, meant for quick sanity checks.

```bash
pnpm nx test platform-e2e -c smoke
pnpm nx run platform-e2e:test:smoke
pnpm nx test:local platform-e2e -c smoke
pnpm nx run platform-e2e:test:local:smoke
```

#### Extended (`-c extended`)

Runs `@smoke` and `@extended`-tagged tests across Chromium, Firefox, and WebKit (`PLAYWRIGHT_BROWSER=all`, ignoring `.env`).

```bash
pnpm nx test platform-e2e -c extended
pnpm nx run platform-e2e:test:extended
pnpm nx test:local platform-e2e -c extended
pnpm nx run platform-e2e:test:local:extended
```

#### Regression (`-c regression`)

Runs all tests (regardless of tag) across Chromium, Firefox, and WebKit.

```bash
pnpm nx test platform-e2e -c regression
pnpm nx run platform-e2e:test:regression
pnpm nx test:local platform-e2e -c regression
pnpm nx run platform-e2e:test:local:regression
```

### Browser Selection

By default (and in CI), tests run in Chromium, Firefox, and WebKit.

For local runs, set `PLAYWRIGHT_BROWSER=chromium` in `apps/platform-e2e/.env` (see `.env.sample`) to only use Chromium:

```bash
PLAYWRIGHT_BROWSER=chromium nx test platform-e2e
```

Other values: `firefox`, `webkit`, `all`, or a comma-separated list (`chromium,firefox`).

You can also pass Playwright’s project flag:

```bash
nx test platform-e2e -- --project=chromium
```

### Debugging Options

**Debug mode (opens Playwright Inspector):**

```bash
nx test platform-e2e --debug
```

**Run only failed tests from last run:**

```bash
nx test platform-e2e --lastFailed
```

**Stop after N failures:**

```bash
nx test platform-e2e --maxFailures=3
```

### Performance & Parallelization

**Control number of workers:**

```bash
nx test platform-e2e --workers=2
nx test platform-e2e --workers="50%"  # Use 50% of CPU cores
```

**Run tests sequentially:**

```bash
nx test platform-e2e --workers=1
```

**Shard tests (for CI parallelization):**

```bash
nx test platform-e2e --shard="1/3"  # Run shard 1 of 3
nx test platform-e2e --shard="2/3"  # Run shard 2 of 3
nx test platform-e2e --shard="3/3"  # Run shard 3 of 3
```

### Timeouts & Retries

**Set test timeout:**

```bash
nx test platform-e2e --timeout=60000  # 60 seconds
```

**Set global timeout (max time for entire test suite):**

```bash
nx test platform-e2e --globalTimeout=3600000  # 1 hour
```

**Set retry count:**

```bash
nx test platform-e2e --retries=2
```

### Other Useful Options

**List tests without running:**

```bash
nx test platform-e2e --list
```

**Quiet mode (suppress output):**

```bash
nx test platform-e2e --quiet
```

**Update snapshots:**

```bash
nx test platform-e2e --updateSnapshots
```

**Ignore snapshot failures:**

```bash
nx test platform-e2e --ignoreSnapshots
```

**Run each test N times:**

```bash
nx test platform-e2e --repeatEach=3
```

## Configuration

- **Playwright Config**: `playwright.config.mts`
- **Test Directory**: `src/`
- **Test Pattern**: `*.e2e.spec.{ts,tsx}`
- **Base URL**: `http://localhost:3003` (via `PLAYWRIGHT_BASE_URL`); app paths use `/platform` basename (`PLAYWRIGHT_PATH_BASENAME`), e.g. `/platform/map`

## Dependencies

The `test:local` target automatically starts the `platform` app server using Nx's `dependsOn` feature. Nx will start the server before running tests. The server runs in the background and tests will connect to it once it's ready.

For the `test` target, ensure the `platform` server is already running before executing tests.

## CI/CD

For CI environments:

- Tests run in headless mode by default
- Only Chromium browser is recommended to save time: `npx playwright install chromium --with-deps`
- Consider using `--shard` for parallel test execution

## See Also

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Nx Playwright Plugin](https://nx.dev/technologies/test-tools/playwright)
