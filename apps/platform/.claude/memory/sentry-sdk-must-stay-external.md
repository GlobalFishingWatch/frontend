---
name: sentry-sdk-must-stay-external
description: '@sentry/tanstackstart-react must stay in ssr.external or the production container crashes at boot'
---

# `@sentry/tanstackstart-react` must stay in `ssr.external`

The production image starts with `node --import ./output/server/instrument.server.mjs`. That file
is not part of the build: `project.json` copies it into `.output/server` with `shx cp`, so its
`import '@sentry/tanstackstart-react'` resolves against `.output/server/node_modules`. Only Nitro's
dependency tracing puts the package there, and Nitro traces only packages Vite left external.

`@sentry/tanstackstart-react` 11.10 (`makeRoutePatternPlugin`, always on) forces itself into
`resolve.noExternal` for server environments, so the SDK was inlined into the SSR chunks and
`node_modules` held only `tslib`. Every dev deploy from 2026-11-02 (`1043fd3d8a`, the
production-minor bump) failed with `ERR_MODULE_NOT_FOUND: Cannot find package
'@sentry/tanstackstart-react' imported from /app/output/server/instrument.server.mjs`. Cloud Run
reports this only as "container failed to start and listen on PORT=8080".

**Why:** the plugin is enabled only when `CI` and `SENTRY_AUTH_TOKEN` are both set
(`vite.config.ts`), so local builds and local Docker builds stay green. Reproduce with
`CI=true SENTRY_AUTH_TOKEN=fake pnpm nx run platform:build:app --skip-nx-cache`, then
`ls apps/platform/.output/server/node_modules/@sentry`.

**How to apply:**

- Keep `'@sentry/tanstackstart-react'` in `ssr.external`. Vite lets an explicit `external` string
  win over `noExternal`. The cost is 11.10's route-pattern span names: `__SENTRY_ROUTE_PATTERNS__`
  is guarded by `typeof`, so the feature is skipped silently.
- Don't use Nitro `traceDeps: ['@sentry/tanstackstart-react']` instead. Tried 2026-11-03: it copied
  `vite`, `rolldown`, `esbuild`, `fsevents` and `lightningcss-darwin-arm64` into the output.
- `buildTimeInstrumentation: false` does not fix it. Orchestrion only inlines `@sentry/server-utils`
  and instrumented modules.
- After a Sentry bump, run the reproduce command above before you merge.

See [[platform-testing]] and [[browser-testing-uses-platform-e2e]].
