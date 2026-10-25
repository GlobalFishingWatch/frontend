---
name: task-based-affected
description: Nx 24 task-based affected is on; CI picks apps to deploy and libs to release by their build task, so build inputs must be complete
---

# `nx affected` selects tasks, not projects (since Nx 24, 2026-10)

Nx 24 made affected task-based: a change selects only the tasks whose inputs it touches. A
test-only edit in a lib selects that lib's `test`, not its `build` or any dependent's `build`.
The migration wrote `affected.legacy: true` to keep the old behaviour; it was removed on
2026-10-24, so the workspace runs task-based.

CI leans on this in two places:

- `.github/actions/detect-affected` → `nx show projects --affected -t build --type app` decides
  which apps get a Docker image and a deploy.
- `libs-release.yml` → `nx show projects --affected -t build --projects='libs/*'` decides which
  libs get published.

**Why:** without `-t`, `show projects --affected` stays project-based, so a spec-only change
redeployed every dependent app and republished libs with no runtime change.

**How to apply:**

- A file a build reads but its `inputs` do not list is now a missed deploy, not just a stale
  cache hit. That is why `{workspaceRoot}/Dockerfile` moved from `sharedGlobals` into the `build`
  target default (and `@nx/js:tsc` builds gained `production` inputs). Add new build-time files
  to `build` inputs, not to `sharedGlobals`.
- Check a selection with `nx show projects --affected -t build --files=<path>` or
  `nx affected -t build --explain`.
- Inside an AI agent session Nx prints `--plain` output as a JSON array. CI gets one name per
  line, which is what the `grep` in `detect-affected` expects. Unset `CLAUDECODE` / `AI_AGENT`
  to reproduce CI output locally.
- The Nx cache lives in `~/.nx/<workspace-hash>/cache` since Nx 23.2, not `.nx/cache`. The
  `integration-tests.yml` cache step points at `~/.nx`.

See [[lib-build-target-name]] for the `build` target naming these commands rely on.
