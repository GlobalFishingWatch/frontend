---
name: platform-dist-workspace-link
description: platform's dist-based lib resolution + pnpm workspace links — the motivation is performance, not just correctness
---

# platform consumes libs via dist, on purpose

`apps/platform` consumes `libs/*` through their built `dist/` output rather than tsconfig `src` path overrides. The app tsconfig no longer overrides `@globalfishingwatch/*` paths — it inherits the base tsconfig's dist mapping. Real pnpm workspace symlinks back it: `libs/*` is a member in `pnpm-workspace.yaml`, and intra-repo deps use `workspace:^`. See [[platform-config-package]].

**Why:** the driver is **performance** — matching prod's bundled-dist resolution path in dev too. It was not merely a fix for the original `nx build` failure (a missing `^dist` in the app's `build` target `dependsOn`). Keep that in mind when weighing tradeoffs here. Do not propose reverting to the src-override hybrid as a cure for dev-reload cost; look instead at cutting the reload cost itself (incremental tsc emit, per-file dist writes, Vite SSR-environment watch tuning).

**How to apply:** when dev-server reload behavior, lib build caching, or tsconfig path resolution comes up, the goal is real dist-based resolution kept fast — not a fallback to src.

## Reload cost: solved by an export condition, not a watcher

Every `libs/*/package.json` export carries three conditions:

```json
{ "types": "./dist/index.d.ts", "development": "./src/index.ts", "default": "./dist/index.js" }
```

Vite matches `development` in dev only; build, nitro, node and tsc still get `dist`. `watch-deps` was deleted from the app's `prepare-start`. Dev serves lib src with HMR and no lib rebuilds.

Do **not** reintroduce an `nx watch → dist` loop, and do **not** restore src `paths` overrides in the app tsconfig.

## Consequence: types lag src

IDE and tsc types come from `dist/*.d.ts` while Vite dev serves `src`. Editing a lib's public type — e.g. adding an icon to `libs/ui-components/src/icon/icon.config.ts` — makes the app typecheck fail with `not assignable to type ...` until that lib's dist is rebuilt:

```sh
pnpm nx run ui-components:dist   # the target is `dist`, there is no `build`
```

After rebuilding, VS Code still needs **TypeScript: Restart TS Server** — it caches the old `.d.ts` in memory. Check dist content and mtime before believing such an error.

(`platform:typecheck` does now declare `dependsOn: ["i18n:types", "^dist"]`, so nx builds lib dists for you; a bare `tsc` invocation outside nx does not.)

## Why tsconfig.base.json paths still exist

`tsconfig.base.json` maps `@globalfishingwatch/* → libs/*/dist/*.d.ts` solely for `apps/api-portal`, `apps/data-download-portal` and `apps/port-labeler`. Those three have no `package.json`, so they are not pnpm packages and paths are their only resolution mechanism. They cannot be deleted until those apps get manifests and workspace membership. Libs opt out individually via `"paths": {}` in each `libs/*/tsconfig.json`.

Prefer fixing the source over patching consumers — a dev-only `resolve.alias` in `vite.config` was proposed and rejected for exactly this reason.
