---
name: split-e2e-directives
description: Why platform-e2e specs carry no @nx-depends-on / @nx-ignore-server-inputs directives, and what adopting them needs
---

# Split e2e specs are not scoped with Nx directives (as of 2026-10-24)

Nx 24 can skip an unaffected split e2e spec (`test-ci--<file>`) through a directive at the top of
the spec: `// @nx-depends-on: <projects>` or `// @nx-ignore-server-inputs`. None of the
`platform-e2e` specs use one, on purpose.

**Why:**

- `@nx-depends-on` scopes a spec to the projects it names and drops the app from the hash. The
  features these specs exercise (reports, vessel search, workspaces) live in `apps/platform`,
  not in libs, so the app edit that breaks a spec would replay a cached pass.
- `@nx-ignore-server-inputs` is the right tool for one big app, but it only narrows the hash with
  **Ultracache** on in Nx Cloud, and only when Playwright's `webServer.command` is
  `nx run platform:start` (with `reuseExistingServer: true`, no `env`/`wait`). Ours is a no-op
  idler, because the smoke run targets a Docker image.
- No CI job runs `test-ci` today. Smoke runs `nx test platform-e2e -c smoke` (uncached) against
  the built image.
- The specs hit the live dev/staging API, so a cached pass can hide an API-side break.

**How to apply:** adopting this means, in order: turn on Ultracache in the Nx Cloud workspace
settings; add a PR job running `nx affected -t test-ci` against `platform:start`; switch
`webServer.command` for that job to `nx run platform:start`; then add
`@nx-ignore-server-inputs` plus bare imports of each spec's own feature module. Check first that
those modules load in Node: most import `.module.css`, which can fail the whole spec file.

`test-ci` comes from the first `@nx/playwright/plugin` entry only. The `test:local` and
`screenshots` entries set `ciTargetName: false`; before 2026-10-24 all three inferred `test-ci`
and the last one won, so `test-ci` pointed at `screenshots`.

See [[browser-testing-uses-platform-e2e]].
