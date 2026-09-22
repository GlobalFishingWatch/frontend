---
name: Fourwings Data Infrastructure
slug: fourwings-data-infrastructure
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/fourwings.config.ts
    hash: 09f95a205fa2513c9f24a38acb07e477b7ec206682ff9983dfb74d5e3bb027fb
  - path: libs/deck-layers/src/layers/fourwings/fourwings.stats.ts
    hash: a7340c60702542e3ced2d40754d96ad3e5f5cae5658560ce751a0b1135aa20f2
  - path: libs/deck-layers/src/layers/fourwings/fourwings.utils.ts
    hash: c0261f7698c43889a41691967758af413803246cdb1668262a2e2fc8df24696f
sources_digest: 3cfa82220bb2a8d879c5172af975e12a92aea5edc623595e66e84315b35d2880
links:
  - to: deck-gl-core-integration
    relation: depends_on
    description: >-
      Depends on @globalfishingwatch/deck-loaders for FourwingsInterval and
      FourwingsChunk types; uses Luxon for datetime manipulation
generator:
  version: 1
covers:
  - symbol: getSteps
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.stats.ts:L7-L21'
  - symbol: removeOutliers
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.stats.ts:L23-L39'
  - symbol: getDateInIntervalResolution
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.utils.ts:L11-L16'
  - symbol: GetChunkByIntervalParams
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.utils.ts:L18-L26'
  - symbol: getChunkByInterval
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.utils.ts:L28-L69'
  - symbol: getChunkBuffer
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.utils.ts:L71-L77'
---

<!-- context:generated:start -->

## Summary

Common data model and utilities for Fourwings fisheries visualization layers. Defines temporal chunking strategies (DATE, NONE, full-range modes) via getChunkByInterval and getDateInIntervalResolution; handles interval-based data organization and buffer management. Provides statistical utilities (getSteps for Ckmeans clustering, removeOutliers for outlier filtering) to compute color-mapping breakpoints and clean aggregation data.

## Related

- depends on [[deck-gl-core-integration]] — Depends on @globalfishingwatch/deck-loaders for FourwingsInterval and FourwingsChunk types; uses Luxon for datetime manipulation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
