---
name: server-code-file-convention
description: Where platform server code lives and which file suffix it takes — .serverfn.ts for createServerFn, .server.ts for server-only helpers (enforced by TanStack import protection), .loaders.ts for route glue
---

# Server code: suffix says what it is, folder says who owns it

Normalized on 2026-10-08 (server-function files renamed `.functions.ts` → `.serverfn.ts` the same day). Before that, server code was spread over `server-functions/`, `server/`
and `features/*/…loaders.ts`, with `.functions.ts` files that held no server function and
`loaders` files that mixed RPC endpoints, route glue and shared types.

| Suffix          | Holds                                                                        | Importable from                                                                                               |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `x.serverfn.ts` | **only** `createServerFn` exports (plus private helpers)                     | anywhere — the compiler swaps handlers for RPC stubs                                                          |
| `x.server.ts`   | server-only helpers: cookies, `getRequest`, nitro cache                      | `.serverfn.ts` handlers, `routes/api/*`, `server.ts`, `start.ts`, or a dynamic `import()` behind an SSR guard |
| `x.loaders.ts`  | route glue: `loaderDeps`, loader fns calling server fns, route cache options | route files                                                                                                   |
| `x.types.ts`    | types shared by client and server                                            | anywhere                                                                                                      |

Placement:

- **Feature server functions live with the feature**: `features/_places/places.serverfn.ts`,
  `features/help/helpHub.serverfn.ts`, `features/cms/<collection>.serverfn.ts`.
- **App-wide ones live in `server/`**: `server/*.serverfn.ts` (auth) and
  `server/*.server.ts` (auth cookies/refresh, SSR user, panel widths, GFW API request config).
  `server/api/*` stays the helper tree for `routes/api/*` HTTP handlers.
- There is no `server-functions/` folder any more; don't recreate it.

**Why:** the `.server.` suffix is not just a name. TanStack Start (1.171) ships import protection
on by default, and its client rule denies `**/*.server.*` files and the
`@tanstack/react-start/server` specifier
(`@tanstack/start-plugin-core/dist/esm/import-protection/defaults.js`). Mislabelling a
server-only file as `.serverfn.ts` or a plain `.ts` removes that guard silently. Keeping types
out of `.serverfn.ts` also stops UI components from importing the RPC-boundary file just for a
type.

Verified 2026-10-08 with `nx run platform:build:app`: no `.server` chunk and no server-only
symbol (`refreshInFlight`, `AsyncLocalStorage`, the strapi cache key) reached
`.output/public/assets`. A `.server.ts` module imported statically from a `.serverfn.ts` file is
fine because the compiler drops the handler body and its imports on the client.

**How to apply:**

- New `createServerFn` → `<feature>.serverfn.ts` next to the feature, nothing else exported.
- Helper that touches the request, cookies, secrets, fs or nitro → `.server.ts`.
- `__root.tsx` loads `server/user.server` and `server/screen-size.server` through
  `if (!import.meta.env.SSR) return …; await import(…)`. Keep that guard if you touch it — the
  dynamic import is what keeps the client build clean.
- `routes/api/ocean-areas/*` are plain HTTP endpoints for `hooks/ocean-areas.ts`, not server
  functions. Converting them is a separate decision.

See [[platform-testing]] for how to verify (typecheck, lint, real SSR build).
