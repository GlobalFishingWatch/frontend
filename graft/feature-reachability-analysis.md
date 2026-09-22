---
name: Feature reachability analysis
slug: feature-reachability-analysis
type: file
sources:
  - path: scripts/reachable-features.mjs
    hash: a7b6b1b10bb3021ee3eb574f6c07ad7077f3f71683ee7d00593e999d51d6423a
sources_digest: 144610ab1f51019cc0fd868a3c35d2d896a405cc8beacb09d34be2c631def893
links: []
generator:
  version: 1
covers:
  - symbol: rf
    kind: function
    at: 'scripts/reachable-features.mjs:L64-L72'
  - symbol: resolveSpec
    kind: function
    at: 'scripts/reachable-features.mjs:L73-L78'
  - symbol: specs
    kind: function
    at: 'scripts/reachable-features.mjs:L79-L113'
---

<!-- context:generated:start -->

## Summary

Node.js script analyzing which feature directories are reachable from apps/platform entry points via runtime import traversal. Parses TypeScript/JavaScript via compiler API extracting import declarations (excluding type-only), resolves module specifiers against exact mappings (store/middlewares, features/_, etc.) and prefixed directories, performs BFS to discover transitive imports. Outputs total module count and reachable features/_ directories. Core exports: resolveSpec (maps specifiers to filesystem paths), specs (extracts runtime imports via AST), walker function for traversal. Design insight: per-import weights don't compose due to central selector hub overlap, so script reports union of reachable features, not deltas, and undercounts by excluding workspace packages (check-store-graph.mjs handles cross-package analysis).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
