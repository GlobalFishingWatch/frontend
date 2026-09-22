---
name: Test Fixture Factories
slug: test-fixture-factories
type: file
sources:
  - path: libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts
    hash: 3afede24c791cb6d711c7e90d096ee714d116e852160a850d59d7bf63f2435fc
sources_digest: e0d17646c9b744a37bb200da521ffd19730262aca99f225d85896a233efc7b1f
links: []
generator:
  version: 1
covers:
  - symbol: createMockTileBBox
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts:L3-L12'
  - symbol: createHeatmapPbfBuffer
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts:L14-L23'
  - symbol: createAggregatedHeatmapPbfBuffer
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts:L26-L34'
  - symbol: createVectorsPbfBuffer
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts:L36-L63'
---

<!-- context:generated:start -->

## Summary

Generates mock Protocol Buffer tile data for fourwings testing. Exports createMockTileBBox (mock tile with coordinates/indices), createHeatmapPbfBuffer (encoded heatmap with per-frame or aggregated values), createAggregatedHeatmapPbfBuffer, and createVectorsPbfBuffer (encoded vector fields with conditional temporal vs. aggregated mode). Explicitly slices ArrayBuffers to avoid Pbf internal allocation issues and demonstrates conditional encoding logic for time-series vs. static data.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
