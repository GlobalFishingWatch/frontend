---
name: nx-ci-cache-server
description: CI shares the Nx cache through a local remote-cache server in the nx-cache action, which restores on start and saves in its post step, also when the job fails
---

# CI shares the Nx cache through `.github/actions/nx-cache`

Nx rejects a cache directory copied in by `actions/cache`, so CI serves the restored folder to Nx as
a self-hosted remote cache (`NX_SELF_HOSTED_REMOTE_CACHE_SERVER`, `nx-cache-server.mjs` on
`127.0.0.1:4911`). One `uses: ./.github/actions/nx-cache` with a `key` restores, starts the server
and exports the URL. Its post step saves at the end of the job; there is no second call (as of
2026-11-25).

**Why it is a node action calling `@actions/cache`, not a composite around `actions/cache`:** a
failed job must still save. The integration specs are flaky, and a run where one spec fails would
otherwise throw away every spec that passed. `actions/cache` hard-codes `post-if: success()`, and
its `save-always` input is deprecated as broken. Our own `post` runs with `post-if: always()`.
Saving after a failure is safe because Nx never writes a failed task to the cache, locally or
remotely — verified on Nx 24.0.4 with an always-failing cacheable target.

**How to apply:**

- The action imports `@actions/cache` and `@actions/core` from the root `node_modules` (root
  devDependencies), so it must run **after** `pnpm install`. That avoids committing a bundle.
- `pnpm-workspace.yaml` pins `@actions/glob>minimatch` to 10: the global override to 11 removes
  `matchOne`, and `saveCache` then fails with `this.minimatch.matchOne is not a function`.
- The server bumps the mtime of every entry it serves. The post step deletes everything older than
  the job start, so each saved cache holds what one run used. It skips the save when nothing was
  added or dropped.
- The key is `<key>-<sha>-<run attempt>`. Without the attempt, a re-run of a failed job would find
  its own key taken and could not save what it added. Restore falls back to the newest `<key>-`.
- PR runs can read their own PR's caches and the base branch's, never another PR's.
- Users (as of 2026-11-25): `build-image` (app builds), `integration-tests.yml` and `e2e-tests.yml`.
  Not the daily e2e or recording runs. The e2e specs hit the live API, so a cached pass can hide
  an API-side break within a PR; deploy smoke runs stay uncached. `test:local` has `cache: false`,
  which is why the PR workflow runs the split `test-ci` tasks.

See [[task-based-affected]] for which build tasks this cache serves.
