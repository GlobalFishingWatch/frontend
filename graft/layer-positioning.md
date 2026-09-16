---
name: Layer Positioning
slug: layer-positioning
type: file
sources:
  - path: libs/deck-layers/src/utils/sort.ts
    hash: d75a9d2412b0503e1ffe4fc40f5057afb0ed9695a7d416eb0fb0059b47ae770b
sources_digest: c4dc866920fbadac740910541b0d2666e10673994b7047f25c0dd633a0cb6d52
links: []
generator:
  version: 1
covers:
  - symbol: getLayerGroupOffset
    kind: function
    at: 'libs/deck-layers/src/utils/sort.ts:L4-L10'
---

<!-- context:generated:start -->

## Summary

Computes 2D layer offsets for deck-based rendering via getLayerGroupOffset, which maps LayerGroup identifiers to vertical stacking positions (offset.y = group index × 100). Consumes LAYER_GROUP_ORDER configuration to establish canonical depth ordering; optional layerIndex parameter is currently unused.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
