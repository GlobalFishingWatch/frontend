---
name: ci-nx-cache-server
description: Deploy builds run on the runner and reach a GitHub Actions-cached Nx cache through a local self-hosted remote-cache server, because Nx rejects copied local cache dirs
---

# Deploy builds cache through a local Nx remote-cache server (since 2026-11-18)

`.github/actions/build-image` runs `nx run <app>:build` on the runner and the root `Dockerfile` only
copies the output (`.dockerignore` admits nothing else). Before the build, the action restores a
directory with `actions/cache` and serves it on `127.0.0.1:4911` with `nx-cache-server.mjs`.
That script implements Nx's self-hosted remote cache API. Nx reaches it through
`NX_SELF_HOSTED_REMOTE_CACHE_SERVER`.

**Why not just cache Nx's cache directory:** tried first. Nx 24 keeps cache metadata in a DB
named after the machine id (`.nx/workspace-data/<machine-id>-v6.db`). On a fresh runner it reports
`Unrecognized Cache Artifacts` and gets 0/24 hits. This is Nx's guard against poisoned shared
local caches (CVE-2025-36852). `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` is ignored with the DB cache.
Artifacts served through the remote-cache protocol are accepted. Nx Cloud is off (free plan
exceeded), and the `@nx/gcs-cache` plugins are deprecated or licensed.

Measured locally on 2026-11-18 by building `platform` on a simulated fresh runner:

| Change          | Time  | Cache hits |
| --------------- | ----- | ---------- |
| Cold build      | 34.2s | 0/24       |
| No change       | 5.4s  | 24/24      |
| App-only change | 23.0s | 18/24      |
| Lib change      | 28.9s | 16/24      |

The cache directory was 55 MB. The image build itself took 5.7s with `--no-cache`.

**How to apply:**

- Only `develop` and `main` write: the server runs read-only elsewhere (PR previews, release
  tags), and only those refs prune and save. Keep it that way: a writable cache from an
  untrusted ref is the poisoning vector.
- Pruning keeps only the artifacts this run read or wrote. The server bumps their mtime, and
  the action deletes everything older than a marker file, so each entry holds one build's
  worth.
- Flag environments (`platform-mode`, `realtime`) pass their own `cache-scope`. Otherwise they
  race to save the same key. Restore falls back to any entry for the same app, so libs and
  typecheck still hit.
- `COMMIT_SHA` and `SENTRY_AUTH_TOKEN` are not hash inputs. When `build:app` is a cache hit,
  the Sentry plugin does not run, so no Sentry release named after the new commit is created.
  Source maps still resolve by debug ID from the build that produced the artifact.
- A file the build reads must be in the target's `inputs`, or a cache hit replays a stale
  build into a deploy ([[task-based-affected]]).
- If the team later hosts a shared cache (Cloud Run + GCS), point
  `NX_SELF_HOSTED_REMOTE_CACHE_SERVER` at it and drop the restore, save and server steps. The
  protocol is the same.
