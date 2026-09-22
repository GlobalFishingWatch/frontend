---
name: Immutable Feature State Management
slug: immutable-feature-state-management
type: concept
sources:
  - path: libs/deck-layers/src/layers/draw/DrawLayer.ts
    hash: ed2775a1334b70c1dc917aedc49ffc42e9ec9f2432c7c3a20800c9baa801ca2a
sources_digest: 425506740574a90410b4f081a57b66142e3b84ab647e7c1814108c8514a4cab3
links:
  - to: deck-gl-editable-layers-integration
    relation: uses
    description: >-
      Uses ImmutableFeatureCollection from @deck.gl-community/editable-layers to
      enforce immutability constraints
generator:
  version: 1
covers:
  - symbol: Color
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L32-L32'
  - symbol: getFeaturesWithOverlapping
    kind: function
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L61-L70'
  - symbol: getDrawDataParsed
    kind: function
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L72-L77'
  - symbol: DrawLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L83-L90'
  - symbol: DrawFeatureType
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L92-L92'
  - symbol: DrawLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L93-L96'
  - symbol: DrawLayer
    kind: class
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L98-L439'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L115-L124'
  - symbol: _setState
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L140-L145'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L285-L298'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L404-L438'
---

<!-- context:generated:start -->

## Summary

Pattern for managing editable feature collections through immutable data structures (ImmutableFeatureCollection) that prevent accidental mutations. Maintains separate data and tentativeData states to support preview-before-commit workflows. Forces explicit state updates through dedicated methods, enabling undo/redo patterns and transactional geometry modifications.

## Related

- uses [[deck-gl-editable-layers-integration]] — Uses ImmutableFeatureCollection from @deck.gl-community/editable-layers to enforce immutability constraints

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
