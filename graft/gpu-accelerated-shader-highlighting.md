---
name: GPU-Accelerated Shader Highlighting
slug: gpu-accelerated-shader-highlighting
type: concept
sources:
  - path: libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts
    hash: 8805cc36ff7f4ed95b1d101be6115c29fc2c4ea784bda1d7f9b32efae53b02bc
sources_digest: 6206752f46a2f9eadb28d71affd39eff0f9442bfdd6d6230cb4e1d3606350367
links:
  - to: deck-gl-core-integration
    relation: implements
    description: >-
      Leverages deck.gl's shader injection pattern via layer props
      (highlightedElevation, zoomOpacity, highlightColor uniforms)
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
---

<!-- context:generated:start -->

## Summary

Design pattern that passes feature attributes (e.g., elevation) as per-instance GPU attributes and resolves highlight styling in vertex/fragment shaders via uniforms, avoiding expensive per-frame attribute re-uploads during hover. Used by BathymetryContourLayer to highlight depth contours and enable smooth visual feedback during picking operations.

## Related

- implements [[deck-gl-core-integration]] — Leverages deck.gl's shader injection pattern via layer props (highlightedElevation, zoomOpacity, highlightColor uniforms)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
