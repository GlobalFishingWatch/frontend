---
name: rolldown-lib-app-chunk-colocation
description: Production chunks can drag app code onto pages whose source never imports it; the vendor codeSplitting group in vite.config.ts prevents it
---

# Rolldown put library modules inside app chunks

In the production client build, Rolldown placed library modules inside chunks named after app
modules. Every other page that needed the library module then downloaded the whole app chunk and
everything it statically imports. Found on 2026-10-13: `/areas/eez` fetched the report selectors
(`area-reports.selectors`, `reports.config.selectors`, …) although no module on that page imports
them. The source import graph was clean. Only the chunk graph had the link:

```
PlacesMap → deck-layers-composer.hooks → data-transforms barrel → [area-reports.selectors chunk]
```

The `area-reports.selectors` chunk held `libs/data-transforms/dist/dissolve/dissolve.js`
together with the report selectors. When that link was cut, the next one appeared through the
same mechanism: the turf `esm` chunk imported the `NewDataset` chunk, which led to
`map-layers.hooks`.

**Why:** with `strictExecutionOrder` every module is wrapped in a lazy init. Execution order
stays correct wherever a module ends up, but fetching does not. A chunk's static imports are
downloaded even when the caller needs only one module inside that chunk.

**How to apply:**

- `apps/platform/vite.config.ts` uses `codeSplitting.groups` instead of `manualChunks`. The last
  group, `vendor`, matches `node_modules` and `libs` with `entriesAware: true`. Library code
  therefore never shares a chunk with app code, and it is still split by which entries need it.
  Do not go back to `manualChunks`: when `codeSplitting` is set, Rolldown ignores `manualChunks`.
- Turning off `experimental.chunkOptimization` (both passes) did **not** fix this. The placement
  comes from base chunk grouping.
- `check-store-graph.mjs` walks source, so it cannot see this. To verify a page in production,
  run `pnpm nx run platform:build:app`, then `node apps/platform/scripts/serve-ssr.mjs`, and
  inspect the requests on port 3000. Restart the server after every rebuild. A server left
  running while `.output` is rebuilt returns 500s with `ERR_MODULE_NOT_FOUND`.
- To find which modules a chunk holds, set `sourcemap: true` temporarily in the client build and
  read `sources` from the chunk's `.map` file.
- `libs/data-transforms` declares `"sideEffects": false`, like the `deck-*` libs. Without it,
  the barrel had to initialise every submodule for every consumer.

See [[browser-testing-uses-platform-e2e]] and [[platform-testing]].
