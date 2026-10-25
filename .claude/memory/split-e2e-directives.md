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
- `src/tests/Pipe5.e2e.spec.ts` ("pipe5 first draft") has no tests; its split task fails with
  `No tests found` until tests are added or the file is removed.
- Verify a spec's inputs with `nx show target inputs 'platform-e2e:test-ci--src/tests/<file>'`.
- The specs hit the live dev/staging API, so a replayed pass can hide an API-side break; smoke runs
  uncached against the deployed image.

See [[browser-testing-uses-platform-e2e]] and [[task-based-affected]].
