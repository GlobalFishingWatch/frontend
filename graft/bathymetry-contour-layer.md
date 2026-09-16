---
name: Bathymetry Contour Layer
slug: bathymetry-contour-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts
    hash: abdbaa66deb665511f075848a521f958d31eb8f29f84b3e47861798ad22bcce2
  - path: libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts
    hash: 8805cc36ff7f4ed95b1d101be6115c29fc2c4ea784bda1d7f9b32efae53b02bc
  - path: libs/deck-layers/src/layers/bathymetry-contour/index.ts
    hash: 1424c5dd2f43e70fdf66867a61340d31dffa45a47c9853db4770053fa21bd665
sources_digest: a85ffdefefeef10e8ee0c1feb22ae8bdbf81ab5219ff1d1d4285b076c881d58d
links:
  - to: deck-gl-core-integration
    relation: depends_on
    description: >-
      Depends on @deck.gl/core layers (PathLayer), @deck.gl/geo-layers,
      @deck.gl/extensions (CollisionFilterExtension)
  - to: gpu-accelerated-shader-highlighting
    relation: implements
    description: >-
      Passes elevation as per-instance attribute and resolves highlight styling
      in vertex shader via uniforms (highlightedElevation, zoomOpacity,
      highlightColor)
  - to: vector-tile-layer-infrastructure
    relation: uses
    description: >-
      Extends deck.gl CompositeLayer and PMTilesLayer for tile loading; uses
      PathLayer for rendering contour lines and LabelLayer for depth annotations
generator:
  version: 1
covers:
  - symbol: _ContextLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L36-L36
  - symbol: isIndexContour
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L58-L58
  - symbol: _BathymetryContourPathLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L60-L70
  - symbol: BathymetryContourPathLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L92-L93
  - symbol: BathymetryContourPathLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L108-L176
  - symbol: getShaders
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L115-L144
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L146-L155
  - symbol: draw
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L157-L175
  - symbol: isBelowSeaLevel
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L178-L178
  - symbol: BathymetryPathFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L180-L180
  - symbol: isLabelFeature
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L182-L183
  - symbol: BathymetryContourLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L191-L405
  - symbol: shouldUpdateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L204-L206
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L208-L210
  - symbol: setHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L299-L301
  - symbol: finalizeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L303-L306
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L320-L404
  - symbol: matchesDepth
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L329-L330
  - symbol: BathymetryContourLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L6-L11
  - symbol: BathymetryContourFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L12-L12
  - symbol: BathymetryLabelFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L13-L20
  - symbol: BathymetryTileFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L22-L22
  - symbol: BathymetryContourPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L24-L26
  - symbol: BathymetryContourPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L28-L28
---

<!-- context:generated:start -->

## Summary

Renders ocean floor depth contours from PMTiles vector data with GPU-accelerated highlighting, zoom-dependent styling (darker shades for deeper contours), collision-aware label placement, and debounced hover state management. Implements elevation-based feature distinction and WeakMap tile caching to prevent memory leaks.

## Related

- depends on [[deck-gl-core-integration]] — Depends on @deck.gl/core layers (PathLayer), @deck.gl/geo-layers, @deck.gl/extensions (CollisionFilterExtension)
- implements [[gpu-accelerated-shader-highlighting]] — Passes elevation as per-instance attribute and resolves highlight styling in vertex shader via uniforms (highlightedElevation, zoomOpacity, highlightColor)
- uses [[vector-tile-layer-infrastructure]] — Extends deck.gl CompositeLayer and PMTilesLayer for tile loading; uses PathLayer for rendering contour lines and LabelLayer for depth annotations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
