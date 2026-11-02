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
- The Nx cache lives in `~/.nx/<workspace-hash>/cache` since Nx 23.2, not `.nx/cache`. CI does
  not cache it with `actions/cache` (removed 2026-10-28): the Nx Cloud remote cache covers it, and
  a per-SHA Actions cache entry competed with the Docker layer cache for the 10 GB repo quota.

## Dependency bumps select only the projects that use the package (since 2026-10-25)

`nx.json` sets `pluginsConfig["@nx/js"].projectsAffectedByDependencyUpdates: "auto"`, and
`sharedGlobals` no longer lists `pnpm-lock.yaml` or the root `dependencies` /
`devDependencies`. Measured on 2026-10-25 against real commits: the `@reduxjs/toolkit` bump
(`15e44937e9`) went from all 22 projects to the 11 build tasks that use it.

All three parts are required. With the lockfile or the full `package.json` in `sharedGlobals`, every
task reads the changed file and `auto` changes nothing.

**`nx:run-commands` tasks hash every npm package unless their inputs name the tool.** `--explain`
reports this as `external-dependencies` (for example, `api-portal:build` on the redux bump). So
each such task in a deploy path carries `{ "externalDependencies": [...] }` for the binary it runs:
the `build` target default (`vite`), `dist:workers` (`esbuild`), and platform's `build:app`,
`prepare-loaders`, `check-load-boundaries` and `i18nSources` / `i18n:types`. Packages the project
imports, including those in its config files, are hashed through the project graph anyway.

**How to apply:** when adding a run-commands target that feeds `build`, declare its tool in
`externalDependencies`. Without it, every lockfile change redeploys the app. Confirm with
`nx show projects --affected -t build --base=<sha>~1 --head=<sha> --explain=stdout` on a past bump
commit. Every reason should be `npm-package:<name>`.

## The deploy base is the last successful run, not `HEAD~1`

`_build-and-deploy.yml` resolves the range with `nrwl/nx-set-shas@v5`
(`main-branch-name: ${{ github.ref_name }}`, full-history checkout). The callers grant
`actions: read` so the action can list past runs. `concurrency.cancel-in-progress` cancels a push
that a newer push overtakes. With the old `origin/<branch>~1` base, the cancelled push's apps
were never deployed. The same happened to the apps of a failed run. Now the next run that succeeds covers them.

See [[lib-build-target-name]] for the `build` target naming these commands rely on.
