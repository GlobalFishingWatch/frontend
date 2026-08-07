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

## Types no longer lag src (changed 2026-08-06)

This used to be the main tax: IDE and tsc read `dist/*.d.ts` while Vite dev served `src`, so editing a lib's public type made the app typecheck fail on correct code until you ran that lib's `dist` **and** did *TypeScript: Restart TS Server*. That is fixed.

The cause was condition **order** in each `libs/*/package.json`. `types` was listed first, so TS matched it and never reached `development`:

```jsonc
// before — TS stops at "types"        // after — TS matches "development"
{ "types": "./dist/index.d.ts",        { "development": "./src/index.ts",
  "development": "./src/index.ts",       "types": "./dist/index.d.ts",
  "default": "./dist/index.js" }         "default": "./dist/index.js" }
```

All 13 libs were reordered, and `apps/platform/tsconfig.json` gained `"customConditions": ["development"]`. **Both halves are required — either alone is a no-op.** Vite was never affected (it does not know the `types` condition), which is why dev already served src.

Runtime resolution is unchanged: build, nitro and node still get `dist` via `default`. Only type resolution moved.

Consequences:

- `platform:typecheck` and `prepare-start` no longer declare `^dist`. Cold `nx run platform:typecheck` went **21.2s → 6.9s** (18 tasks → 2) because 13 lib `dist` builds are no longer prerequisites.
- The old `types-watch` (`nx watch → dist`) was removed from `prepare-start`. With `development` exports, rebuilding `dist` on every lib edit does nothing useful for Vite or the IDE; switching it to `typecheck` would only burn CPU. Native `watch-deps` is also a miss here — it depends on `^build`, and these libs expose `dist`, not `build`.
- `platform:build` **keeps** `^dist` — production resolves `default` → `dist`.
- Go-to-definition lands in lib source instead of generated `.d.ts`.

Trade-off to know: typecheck now validates against lib *source*, not the emitted `.d.ts`. A declaration-emit-only bug would be caught by `build`, not by `typecheck`.

## tsconfig.base.json no longer has paths

Historical note: `tsconfig.base.json` used to map `@globalfishingwatch/* → libs/*/dist/*.d.ts` for the apps without a `package.json`. Those paths were **removed on 2026-07-27** in `a97680d746 "remove paths and fix project run"`. Each of those apps carries its own `paths` map in `apps/<app>/tsconfig.json` instead.

Prefer fixing the source over patching consumers — a dev-only `resolve.alias` in `vite.config` was proposed and rejected for exactly this reason.
