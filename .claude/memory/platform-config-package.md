---
name: platform-config-package
description: apps/platform/config is a build-less source-only pnpm package (@platform/config) shared with libs/skills — erasable-syntax-only constraint
---

# @platform/config is a build-less source-only package

`@platform/config` (`apps/platform/config`) is a build-less pnpm workspace package: `exports` point straight at TS source, no nx build target. Exports are subpaths only: `./routes` → `routes.ts`, `./user-guide` → `user-guide.ts`, `./map/*` → `map/*.ts` and `./selectors/*` → `selectors/*.ts`. There is no root `.` entry and no `index.ts` barrel.

Single source of truth for `WorkspaceCategory`, dataview slugs / instance ids, and `ROUTE_PATHS`. Consumers import it directly (`@platform/config/routes` in `router.tsx`, `features/nav/*`, `routes/_platform/**`).

**Why:** the app is the source of truth, internal-only, no build step. Consumed by [[skills-lib]] via an esbuild alias (`@platform/config` → `apps/platform/config`). The alias points at the **directory**, not `index.ts`: esbuild appends the subpath to the alias target, so an `index.ts` target turns `@platform/config/map/dataviews` into `…/index.ts/map/dataviews`.

**How to apply:** anything added here must use **erasable syntax only** — no `enum`, no `namespace`. Node's type stripping has to be able to load these files. `WorkspaceCategory` is a const object plus a type alias of the same name, so type positions need `typeof WorkspaceCategory.X`.

## Every constant has exactly one import path (since 2026-09-24)

Each constant is imported from the subpath of the file that defines it (`@platform/config/map/dataviews`, `@platform/config/routes`, …) and from nowhere else. The root barrel was deleted on 2026-09-24 and must not come back, and no app file re-exports these constants. Before, the same constant was reachable from `@platform/config`, `@platform/config/map/dataviews` and `features/_map/dataviews/dataviews.utils`. The editor's auto-import offered all three paths, so each file picked a different one.

A new file under `map/` or `selectors/` is exported automatically by its `/*` pattern. Only a new top-level file needs its own `exports` entry.

When you move a constant into this package, update its consumers to import it from the subpath. Do not add a re-export in the file that owned it before.

## Test ids live in `selectors/`

Every `data-testid` / `data-test` / DOM id that `apps/platform-e2e` queries is a constant in `selectors/<area>.ts`, imported by **both** the component that renders it and the e2e page or helper that queries it.

**Why:** with a string literal on each side, renaming a test id in the app broke e2e silently and showed up only as a red e2e run. A shared constant makes the rename a typecheck error.

**How to apply:** when an e2e test needs a new test id, add the constant here first and use it in the component — never a literal on either side. `apps/platform-e2e/package.json` depends on `@platform/config` (`workspace:*`) for this; Playwright transpiles these `.ts` files because the pnpm symlink resolves outside `node_modules`. Out of scope on purpose: ids owned by `libs/ui-components` (`SPLIT_VIEW_DOM_ID`, its `Header`), which a published lib cannot import from app config, and i18n text used in role/label selectors.
