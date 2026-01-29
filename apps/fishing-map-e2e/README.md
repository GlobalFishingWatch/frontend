# Fishing Map E2E Tests

This project contains end-to-end tests for the Fishing Map application using [Playwright](https://playwright.dev/) and [Nx](https://nx.dev/).

## Prerequisites

- Node.js and Yarn installed
- Playwright browsers installed: `npx playwright install`

## Running Tests

### Available Targets

#### `e2e` - Standard E2E Run

Runs all tests with caching enabled. Best for CI/CD and regular test runs.

```bash
nx e2e fishing-map-e2e
```

#### `e2e:local` - Local Development

Runs all tests without caching and automatically starts the `fishing-map` server. Useful for local development when you want fresh runs.

```bash
nx e2e:local fishing-map-e2e
```

#### `e2e:local` with configurations

Opens Playwright's interactive UI for debugging and watching tests run.

```bash
nx e2e:local fishing-map-e2e -c ui
```

Runs tests with visible browser windows. Useful for debugging visual issues.

```bash
nx e2e:local fishing-map-e2e -c headed
```

### Browser Selection

**Run tests in specific browser:**

```bash
nx e2e fishing-map-e2e --browser="chromium"
nx e2e fishing-map-e2e --browser="firefox"
nx e2e fishing-map-e2e --browser="webkit"
nx e2e fishing-map-e2e --browser="all"  # Run in all browsers
```

### Debugging Options

**Debug mode (opens Playwright Inspector):**

```bash
nx e2e fishing-map-e2e --debug
```

**Run only failed tests from last run:**

```bash
nx e2e fishing-map-e2e --lastFailed
```

**Stop after N failures:**

```bash
nx e2e fishing-map-e2e --maxFailures=3
```

### Performance & Parallelization

**Control number of workers:**

```bash
nx e2e fishing-map-e2e --workers=2
nx e2e fishing-map-e2e --workers="50%"  # Use 50% of CPU cores
```

**Run tests sequentially:**

```bash
nx e2e fishing-map-e2e --workers=1
```

**Shard tests (for CI parallelization):**

```bash
nx e2e fishing-map-e2e --shard="1/3"  # Run shard 1 of 3
nx e2e fishing-map-e2e --shard="2/3"  # Run shard 2 of 3
nx e2e fishing-map-e2e --shard="3/3"  # Run shard 3 of 3
```

### Timeouts & Retries

**Set test timeout:**

```bash
nx e2e fishing-map-e2e --timeout=60000  # 60 seconds
```

**Set global timeout (max time for entire test suite):**

```bash
nx e2e fishing-map-e2e --globalTimeout=3600000  # 1 hour
```

**Set retry count:**

```bash
nx e2e fishing-map-e2e --retries=2
```

### Other Useful Options

**List tests without running:**

```bash
nx e2e fishing-map-e2e --list
```

**Quiet mode (suppress output):**

```bash
nx e2e fishing-map-e2e --quiet
```

**Update snapshots:**

```bash
nx e2e fishing-map-e2e --updateSnapshots
```

**Ignore snapshot failures:**

```bash
nx e2e fishing-map-e2e --ignoreSnapshots
```

**Run each test N times:**

```bash
nx e2e fishing-map-e2e --repeatEach=3
```

## Configuration

- **Playwright Config**: `playwright.config.mts`
- **Test Directory**: `src/e2e/`
- **Test Pattern**: `*.e2e.spec.{ts,tsx}`
- **Base URL**: `http://localhost:3003` (configurable via `PLAYWRIGHT_BASE_URL` env var)

## Dependencies

The `e2e:local` target automatically starts the `fishing-map` app server using Nx's `dependsOn` feature. Nx will start the server before running tests. The server runs in the background and tests will connect to it once it's ready.

For the `e2e` target, ensure the `fishing-map` server is already running before executing tests.

## CI/CD

For CI environments:

- Tests run in headless mode by default
- Only Chromium browser is recommended to save time: `npx playwright install chromium --with-deps`
- Consider using `--shard` for parallel test execution

## See Also

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Nx Playwright Plugin](https://nx.dev/technologies/test-tools/playwright)
