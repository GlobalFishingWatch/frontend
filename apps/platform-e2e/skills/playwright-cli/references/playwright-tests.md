# Running Playwright Tests

This repo runs Playwright through Nx, not the bare `npx playwright test` CLI — use `pnpm nx test platform-e2e` (server already running, e.g. in CI) or `pnpm nx test:local platform-e2e` (Nx also boots the `platform` dev server for you via `dependsOn`). Extra Playwright CLI flags pass straight through. To avoid opening the interactive html report, use the `PLAYWRIGHT_HTML_OPEN=never` environment variable. See `apps/platform-e2e/README.md` and `[[browser-testing-uses-platform-e2e]]` for the full target/tag matrix (`-c smoke|extended|regression`, `--grep`, etc).

```bash
# Run all tests (server already running)
PLAYWRIGHT_HTML_OPEN=never pnpm nx test platform-e2e

# Run all tests, auto-starting the platform dev server
PLAYWRIGHT_HTML_OPEN=never pnpm nx test:local platform-e2e

# Run a single spec
PLAYWRIGHT_HTML_OPEN=never pnpm nx test:local platform-e2e --grep "<test name>"
```

# Debugging Playwright Tests

To debug a failing Playwright test, run it with the `--debug=cli` option. This command will pause the test at the start and print the debugging instructions.

**IMPORTANT**: run the command in the background and check the output until "Debugging Instructions" is printed. Make sure to stop the command after you have finished.

Once instructions containing a session name are printed, use `playwright-cli` to attach the session and explore the page.

```bash
# Run the test
PLAYWRIGHT_HTML_OPEN=never pnpm nx test:local platform-e2e --grep "<test name>" --debug=cli
# ...
# ... debugging instructions for "tw-abcdef" session ...
# ...

# Attach to the test
playwright-cli attach tw-abcdef
```

Keep the test running in the background while you explore and look for a fix.
The test is paused at the start, so you should step over or pause at a particular location
where the problem is most likely to be.

Every action you perform with `playwright-cli` generates corresponding Playwright TypeScript code.
This code appears in the output and can be copied directly into the test. Most of the time, a specific locator or an expectation should be updated, but it could also be a bug in the app. Use your judgement.

After fixing the test, stop the background test run. Rerun to check that test passes.
