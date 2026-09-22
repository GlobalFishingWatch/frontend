---
name: Store graph module budget enforcement
slug: store-graph-module-budget-enforcement
type: file
sources:
  - path: scripts/check-store-graph.mjs
    hash: 7439d8c92b23e9c5045e1972641d46c8e5a54a35d57a9863f8458d82706aa492
sources_digest: a281bfec83e9bec23aeb2385fb25e494c240dd391ae27780ad79dbac90442b62
links: []
generator:
  version: 1
covers:
  - symbol: readWorkspacePackages
    kind: function
    at: 'scripts/check-store-graph.mjs:L137-L165'
  - symbol: sourceTargetFor
    kind: function
    at: 'scripts/check-store-graph.mjs:L179-L208'
  - symbol: resolveWorkspaceSpecifier
    kind: function
    at: 'scripts/check-store-graph.mjs:L214-L251'
  - symbol: fail
    kind: function
    at: 'scripts/check-store-graph.mjs:L221-L224'
  - symbol: resolveFile
    kind: function
    at: 'scripts/check-store-graph.mjs:L279-L289'
  - symbol: resolveSpecifier
    kind: function
    at: 'scripts/check-store-graph.mjs:L297-L327'
  - symbol: runtimeSpecifiers
    kind: function
    at: 'scripts/check-store-graph.mjs:L330-L370'
  - symbol: walk
    kind: function
    at: 'scripts/check-store-graph.mjs:L378-L422'
  - symbol: addImporter
    kind: function
    at: 'scripts/check-store-graph.mjs:L387-L390'
  - symbol: chainTo
    kind: function
    at: 'scripts/check-store-graph.mjs:L425-L433'
---

<!-- context:generated:start -->

## Summary

CI gate script enforcing bundle size discipline by walking runtime import graphs from Redux store entry points. Blocks heavyweight packages (@deck.gl/*, @turf/turf, recharts, etc.) via FORBIDDEN blocklist and enforces module budgets (120 for root+eager slices, 300 for platform shell). Traverses only runtime imports (skipping type-only, dynamic await import(), and non-JS assets), resolves workspace packages to source via their exports maps to catch pre-build issues, and stops at real npm packages to isolate "did our code add this" questions. Exports FORBIDDEN, CHECKED_ENTRIES, and walker function; --importers reveals every edge into a module; --report lists workspace packages by cost to identify barrel import culprits. Key constraint: budgets exist because blocklist only catches known problems, so module count is the real enforcement; workspaces resolved to source not dist.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
