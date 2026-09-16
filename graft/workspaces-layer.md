---
name: Workspaces Layer
slug: workspaces-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/workspaces/index.ts
    hash: 3f97fe8e1538fb87d8f81318dfe45c4fb9601f5932c0c4e3a171c61eeb1f2b92
  - path: libs/deck-layers/src/layers/workspaces/workspaces.types.ts
    hash: cd2716fce0cf79d3331099fca1275765780bf1ad9388720e65a4fa2be03cc12e
  - path: libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts
    hash: da86aaef3c5f9b2b8119ee3499c9a1117349d0c2cc6e9f71ff973a09ddb3dc53
sources_digest: aa278b65009a189b58b7f8bda6acd8449ffc91047390c34d67e38dbc179601a0
links:
  - to: deck-gl-layer-foundation
    relation: uses
    description: >-
      Extends CompositeLayer and uses ScatterplotLayer for workspace point
      rendering
  - to: shared-picking-and-layer-utilities
    relation: uses
    description: Uses getLayerGroupOffset with LayerGroup.Overlay for visual stacking
generator:
  version: 1
covers:
  - symbol: WorkspacesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L10-L34'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L14-L16'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L18-L33'
  - symbol: WorkspacesLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/workspaces/workspaces.types.ts:L6-L6'
  - symbol: WorkspacesProperties
    kind: type
    at: 'libs/deck-layers/src/layers/workspaces/workspaces.types.ts:L8-L16'
  - symbol: WorkspacesFeature
    kind: type
    at: 'libs/deck-layers/src/layers/workspaces/workspaces.types.ts:L18-L18'
  - symbol: WorkspacesPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/workspaces/workspaces.types.ts:L19-L19'
  - symbol: WorkspacesPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/workspaces/workspaces.types.ts:L21-L21'
---

<!-- context:generated:start -->

## Summary

Deck.gl composite layer for rendering workspace locations as interactive scatterplot points with uniform styling. Provides picking support for workspace selection and layering via polygon offset calculations for depth ordering.

## Related

- uses [[deck-gl-layer-foundation]] — Extends CompositeLayer and uses ScatterplotLayer for workspace point rendering
- uses [[shared-picking-and-layer-utilities]] — Uses getLayerGroupOffset with LayerGroup.Overlay for visual stacking

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
