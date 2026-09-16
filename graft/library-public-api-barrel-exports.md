---
name: Library Public API Barrel Exports
slug: library-public-api-barrel-exports
type: concept
sources:
  - path: libs/data-transforms/src/segments/index.ts
    hash: 54bfefa64fbff23c5ac0eb38c925666a931e4a2d10eaf762da02301cf5a2fe9a
  - path: libs/data-transforms/src/track-value-array-to-segments/index.ts
    hash: aed5d9962dc9bceb6c36a232305f757fb5cdfd7bea4cbafc83ce82c5793fdeaf
  - path: libs/data-transforms/src/union/index.ts
    hash: f4bcd22bd0f37b2b4a8883e6f3014e4d49489fec9a198ef28a2880d608f79868
  - path: libs/data-transforms/src/vessels/index.ts
    hash: 558d85f270d3aa5d5e90d7304e95bcecb65e97851e071b6a1ae61270e2651abc
  - path: libs/data-transforms/src/worker/index.ts
    hash: 492f3f30ab42791f9c3ed0944b133ca683ffe08ee6fd1f8a72e7821bdc0ff867
  - path: libs/datasets-client/src/index.ts
    hash: 6e005be19a6fadcf458b17e3da97f2e2a0d7e99529c9d1b1e601699d0e13650e
sources_digest: 0af462fcdd9f346bfecca50ef2ab6596baaa0ef7eaad4b511c85e84c4e86c98f
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Curated re-export pattern for managing bundle size across consuming pages. Public barrels (index.ts files) re-export modules supporting common use cases while deliberately excluding constants to avoid inflating entry chunks. Enforcement via scripts/check-store-graph.mjs validates that specific subpaths (e.g., '@globalfishingwatch/datasets-client/constants') are used for performance-sensitive imports. This pattern trades import convenience for measurable bundle size optimization in shared entry points.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
