---
name: split-e2e-directives
description: How platform-e2e specs run as split Nx tasks on Nx Cloud workers, and why no spec carries @nx-depends-on / @nx-ignore-server-inputs
---

# Split e2e: per-spec tasks on workers, no scoping directives (as of 2026-10-24)

`.github/workflows/e2e-tests.yml` runs `nx affected -t test-ci` on Nx Cloud workers
(`.nx/ci-config.yaml`, launch template in `.nx/workflows/agents.yaml`). The Playwright plugin splits
the suite into one `test-ci--src/tests/<file>` task per spec. Ultracache and dynamic task packing are
on in the Nx Cloud workspace settings.

Wiring that makes this work, all load-bearing:

- `webServer.command` is the bare `pnpm nx run platform:start`. The plugin only turns a `webServer`
  into a task dependency (`dependsOn platform:start`, `waitFor: "ready"`) for that exact shape, with
  `reuseExistingServer: true` and no `env`/`wait`. Readiness comes from `nxReadySignal()`.
- The smoke target `test` sets `"dependsOn": []` so the run against the Docker image never boots a
  dev server; `reuseExistingServer` finds the image already listening.
- `testDir` is `src/tests`, or `src/screenshots` when `PLAYWRIGHT_SCREENSHOTS=true`. Only the
  `screenshots` target sets that, so pixel comparisons (local baselines) never become `test-ci--*`
  tasks. This replaced the duplicated `grep: "^(?!.*Screenshot comparison).*"` options.

**Why no spec has a directive:**

- `@nx-depends-on` keeps only the listed projects in the hash and drops the app. Every spec exercises
  code in `apps/platform`, so an app change that breaks a spec would replay a cached pass.
- `@nx-ignore-server-inputs` needs the spec to bare-import the feature it tests. Tried on
  2026-10-24 and it fails: Playwright transpiles specs itself, so a component's `.module.css` import
  throws `SyntaxError` even with a Node ESM loader stub, and libs resolve to `dist`, not the
  `development` condition the dev server uses. Importing only a feature's `.ts` helpers loads, but
  Ultracache then hashes those files and not the components or CSS — an edit to them would replay a
  stale pass.

So each split task hashes its own recorded reads (spec + e2e helpers) **plus** the dev server's
declared inputs. An e2e-only edit reruns only the specs that read it; any app edit reruns all. Correct,
not maximal.

**How to apply:**

- New spec → nothing to configure; it becomes a `test-ci--*` task automatically.
- Revisit `@nx-ignore-server-inputs` only for a spec whose feature is plain TS a spec can import
  without CSS or Vite-only imports (`?react` SVGs).
- A spec file with no tests (`src/tests/Pipe5.e2e.spec.ts`, a draft) would fail its split task
  with `No tests found`. `nx.json` `targetDefaults["test-ci--**/**"]` passes
  `--pass-with-no-tests` to every split task for this reason (2026-10-26).
- An env var a spec reads must be listed in **both** the `e2e-tests.yml` job `env` and
  `.nx/ci-config.yaml` `workers.with-env-vars`. The job env alone never reaches the Nx Cloud
  workers. On 2026-10-26 `TEST_USER_NAME` was missing from both, which failed every spec using
  `LoginPage` (LoginFlow, Report, Workspace) with `Missing required env var`.
- The deploy smoke run (`nx test platform-e2e -c smoke`, `cache: false`) is a different task
  from `test-ci--*`, so it never reuses their cache. That is intended: it checks the production
  image and the live API at deploy time.
- Verify a spec's inputs with `nx show target inputs 'platform-e2e:test-ci--src/tests/<file>'`.
- The specs hit the live dev/staging API, so a replayed pass can hide an API-side break; smoke runs
  uncached against the deployed image.

## The platform vitest suite is split too, as `integration-ci` (since 2026-10-28)

A second `@nx/vitest` entry in `nx.json`, scoped to `apps/platform/**`, sets
`ciTargetName: "integration-ci"`. The bare `@nx/vitest` entry excludes `apps/platform/**`, so
libs keep a plain `test`. `.github/workflows/integration-tests.yml` distributes it to the same
`linux-large-pnpm` workers.

- **Not `test-ci`:** `e2e-tests.yml` runs `nx affected -t test-ci` across the workspace and
  would pick up the vitest specs.
- **Its own `ci-config`, swapped in:** `start-workers` reads only `.nx/ci-config.yaml` and takes
  no flags. That file is e2e's, with `stop-after: test-ci`. `start-ci-run` exits 1 while that file
  exists ("A CI configuration file was detected, but `start-ci-run` does not load it", seen
  2026-10-28). So the integration job runs `cp .nx/ci-config.integration.yaml .nx/ci-config.yaml`
  before `start-workers`. Listing both targets in one shared file was avoided because
  stop-after waits for every listed target.
- **Two commands:** libs `-t test --exclude='*-e2e,platform'`, then `-t integration-ci`. Running
  `-t test integration-ci` together would also run the unsplit `platform:test`.
- **Workers, browsers and login only when `integration-ci` is affected.** A `Detect affected
tests` step runs `nx show projects -t <target> --affected --json`. When platform is not
  affected, lib tests run on the GitHub runner. They use jsdom/node, never vitest browser mode,
  and finish faster than workers boot. A PR that only edits the workflow or
  `.nx/ci-config.integration.yaml` affects nothing, so it runs no tests. To exercise a CI change,
  touch an input as well.
- **Each workflow sets its own `NX_CI_EXECUTION_ENV`** (`e2e`, `integration`). Both are Nx Cloud
  main jobs on the same commit and PR branch. Without it, E2E failed on every push from
  2026-10-28 on with `CI pipeline execution <run>-1 cancelled. Reason: One or more workflows were
cancelled`. The last E2E pass was the commit where Integration Tests was still disabled. Nx
  documents this variable for multiple main jobs. Do not change `NX_BRANCH` instead: it must stay
  the PR number for the GitHub integration.
- Split tasks do not inherit `test`'s `dependsOn`. `targetDefaults["integration-ci--**/**"]`
  adds `prepare-loaders`. `clean-test-artifacts` is left out on purpose: it would delete
  `__traces__` while sibling specs are writing to them.
- **One login per CI run.** The API keeps one token per user, and a new login invalidates the
  previous one, so parallel workers must never log in separately. The main job runs
  `platform:test:login` (jiti, because lib `dist` uses extensionless imports that plain Node ESM
  rejects) and forwards `tokens.json` as `TEST_AUTH_TOKENS`. `auth-setup.ts` writes that value and
  never logs in when it is set. The test user's credentials are not forwarded to workers. Login
  runs before `start-workers`, which captures the forwarded env values when it starts.
- Locally, split tasks run `globalSetup` in parallel processes. An `mkdir` lock in
  `auth-setup.ts` lets one log in while the others reuse its tokens. The login proxy uses fixed
  port 3000, so concurrent logins would also collide there.
- **Browser profile (`persistentContext`).** On CI there is one profile per worker, and
  `integration-ci` runs with `--parallel=1`. A worker's specs share the tile cache, as in the old
  serial run. Locally there is one profile per Nx task, because Chromium refuses a profile that
  another process holds.

**Why the cache does not persist across CI runs:** checked 2026-10-28 against the dev gateway.
4wings tiles send `cache-control: private, max-age=86400`, and dataset/dataview JSON sends
`no-cache`. A restored profile therefore only helps tiles less than 24h old. PR runs use the
read-only Nx Cloud token, so they cannot write a workflow cache.

**Also known (2026-10-28):** `e2e-tests.yml` (`LoginPage`) uses the same `TEST_USER_EMAIL`. Its
logins can invalidate the integration run's token when both workflows run on the same push.

See [[browser-testing-uses-platform-e2e]] and [[task-based-affected]].
