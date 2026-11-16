---
name: load-boundaries-two-modes
description: The page-load guard (scripts/load-boundaries) has a source mode that gates CI and a build mode that only reports; they disagree by design
---

# load-boundaries: source mode gates, build mode reports

`apps/platform/scripts/load-boundaries/` replaced `check-store-graph.mjs` on 2026-10-13. One rule set
(`config.ts`), two graphs:

|       | source (default)                                                      | build (`--mode build`)                                                                  |
| ----- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Reads | our imports, resolved by `ts.resolveModuleName` with the app tsconfig | `dist/chunk-graph.json` (written by `chunk-graph.plugin.ts` in every client build)      |
| Cost  | ~0.7s, no build                                                       | ~0.4s on top of `build:app` (~30s cold)                                                 |
| Sees  | exact import edges, so it names the edge to cut                       | real chunks after Rolldown grouping, TanStack route splitting, tree shaking; gzip bytes |
| Role  | CI gate (`platform:check-load-boundaries`, before `build`)            | report only, never fails; rendered to the deploy job summary                            |

**Why both:** source mode cannot see chunking. On 2026-10-13 `/areas` fetched report selectors that
no source import reached ([[rolldown-lib-app-chunk-colocation]]). Build mode alone cannot gate a PR
(needs a build) and cannot say which import to cut. So: build mode finds, source mode explains.

**How to apply:**

- A build-mode hit with a clean source mode means a bundler-placement problem, not an import to
  remove. Fix it in `vite.config.ts` `codeSplitting`, not by adding allowlist entries.
- Workspace libs are walked into (src in source mode, dist in build mode). `libKey()` maps both to
  one key, which is what lets `allowSubpaths` (e.g. `@globalfishingwatch/timebar/constants`) work in
  both modes. That relies on lib dist being a per-file tsc emit of src.
- CSS **modules** are JS (the class-name map) and are walked. Plain CSS is not: with
  `cssCodeSplit: false` it lands in the one global stylesheet wherever it is imported.
- Allowlist entries no checked page uses fail the check. Delete them; do not keep them "just in case".
- Budgets (`maxModules`, source mode only) count modules including lib files and CSS modules.
  Raise one only with a reason in the commit.
- CI path: the platform `build` target writes `dist/load-boundaries.md`; the Dockerfile stage
  `load-boundaries-report` exports it; `_build-and-deploy.yml` appends it to the step summary.

See [[platform-testing]] for verifying platform changes.
