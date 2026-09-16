---
name: Binary Tile Data Fetching
slug: binary-tile-data-fetching
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.spec.ts
    hash: 260ea232b0c52c9634617ddc807993e657cb6ac1a2a85d1abbd18b431c8f6c4f
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts
    hash: 2e7b196e74bc924301c47286acc074bd02d916fb8ef6db0aaaab215b1e291d5f
sources_digest: e3ae7cb13abd70774c0b816876e148204dd6c48933a748008492d15cfb6979d9
links:
  - to: fourwings-data-infrastructure
    relation: implements
    description: >-
      Uses @globalfishingwatch/deck-loaders FourwingsLoader for worker-based
      data parsing
generator:
  version: 1
covers:
  - symbol: responseWith
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.spec.ts:L5-L5
  - symbol: FetchFourwingsTileDataParams
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L23-L41
  - symbol: FourwingsTileHeaders
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L43-L49
  - symbol: readNumberHeader
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L51-L58
  - symbol: readFourwingsHeaders
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L60-L87
  - symbol: FourwingsTileBuffers
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L89-L93
  - symbol: fetchFourwingsTileBuffers
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L98-L162
  - symbol: getBuffer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L116-L138
  - symbol: fetchFourwingsTileData
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L165-L231
---

<!-- context:generated:start -->

## Summary

Pattern for retrieving and parsing binary tile buffers from remote tile servers. Extracts metadata (scale, offset, dimensions, no-data values) from HTTP response headers (X-prefixed). Uses Promise.allSettled for per-sublayer fault tolerance. Checks abort signals at multiple points to short-circuit parsing if requests were cancelled. Handles fractional no-data values and rejects unparseable values like 'nan' to prevent rendering artifacts.

## Related

- implements [[fourwings-data-infrastructure]] — Uses @globalfishingwatch/deck-loaders FourwingsLoader for worker-based data parsing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
