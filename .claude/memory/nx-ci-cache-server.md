---
name: nx-ci-cache-server
description: CI shares the Nx cache through a local remote-cache server in the nx-cache action, which restores on start and saves in its post step
---

# CI shares the Nx cache through `.github/actions/nx-cache`

Nx rejects a cache directory copied in by `actions/cache`, so CI serves the restored folder to Nx as a
self-hosted remote cache (`NX_SELF_HOSTED_REMOTE_CACHE_SERVER`, `server/nx-cache-server.mjs` on
`127.0.0.1:4911`). One `uses: ./.github/actions/nx-cache` with a `key` restores, starts the server and
exports the URL; saving happens at the end of the job with no second call (as of 2026-11-25).

**Why it is shaped this way:** composite actions cannot declare a `post` step, but the post steps of
actions they `use` do run, in reverse order. So the action is a composite of `actions/cache@v6` (main
restores, post saves) followed by the local node action `server/` (main starts the server, post stops
it and deletes every entry older than the start). The reverse order makes the prune run before the
save. Swapping the two steps would save the unpruned cache.

**How to apply:**

- The server bumps the mtime of every entry it serves; the prune keeps only entries read or written
  during this job, so each saved cache holds what one run used, not an ever-growing pile.
- `actions/cache` saves with `post-if: success()`. A failed job saves nothing, including the results
  of tasks that passed in it.
- The key gets `-${{ github.sha }}` appended. A rerun of the same commit is an exact hit, so its
  post skips the save.
- PR runs can read their own PR's caches and the base branch's, never another PR's.

See [[task-based-affected]] for which build tasks this cache serves.
