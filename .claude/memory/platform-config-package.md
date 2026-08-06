---
name: platform-config-package
description: apps/platform/config is a build-less source-only pnpm package (@platform/config) shared with libs/skills — erasable-syntax-only constraint
---

# @platform/config is a build-less source-only package

`@platform/config` (`apps/platform/config`) is a build-less pnpm workspace package: `exports` point straight at TS source, no nx build target. Subpaths: `.` → `index.ts`, `./routes` → `routes.ts`, `./map/app`, `./map/dataviews`, `./map/workspaces`.

Single source of truth for `WorkspaceCategory`, dataview slugs / instance ids, and `ROUTE_PATHS`. Consumers import it directly (`@platform/config/routes` in `router.tsx`, `features/nav/*`, `routes/_platform/**`), and `apps/platform/data/map/` re-exports the map halves (`data/map/workspaces.ts` does `export * from '@platform/config/map/workspaces'`; `data/map/config.ts` re-exports selected consts from `./map/dataviews` and `./map/app`).

**Why:** the app is the source of truth, internal-only, no build step. Consumed by [[skills-lib]] via an esbuild alias (`@platform/config` → `apps/platform/config/index.ts`).

**How to apply:** anything added here must use **erasable syntax only** — no `enum`, no `namespace`. Node's type stripping has to be able to load these files. `WorkspaceCategory` is a const object plus a type alias of the same name, so type positions need `typeof WorkspaceCategory.X`. Put new shared app constants here and re-export from the app file that used to own them, to avoid consumer churn.
