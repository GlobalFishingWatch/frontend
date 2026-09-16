---
name: Geometry Validation and Error Handling
slug: geometry-validation-and-error-handling
type: concept
sources:
  - path: libs/deck-layers/src/layers/draw/DrawLayer.ts
    hash: ed2775a1334b70c1dc917aedc49ffc42e9ec9f2432c7c3a20800c9baa801ca2a
  - path: libs/deck-layers/src/layers/fourwings/fourwings.stats.ts
    hash: a7340c60702542e3ced2d40754d96ad3e5f5cae5658560ce751a0b1135aa20f2
sources_digest: 12354933af1f32f778c92648070e98720558b3084b67198f56e583ad96257d00
links: []
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
  - symbol: getSteps
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.stats.ts:L7-L21'
  - symbol: removeOutliers
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.stats.ts:L23-L39'
---

<!-- context:generated:start -->

## Summary

Pattern for detecting and surfacing geometry errors in real-time. Self-intersection detection (turf's kinks function), minimum vertex requirements (3 points for polygons), falsy coordinate filtering (treating 0 values carefully to avoid falsy-check bugs), and visual error indication (error coloring, prevented rendering). Preserves legitimate zero values in aggregation results by using Number.isFinite instead of truthiness checks.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
