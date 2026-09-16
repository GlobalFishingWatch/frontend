---
name: Polygon Rendering Layers
slug: polygon-rendering-layers
type: system
sources:
  - path: libs/deck-layers/src/layers/polygons/PolygonsLayer.ts
    hash: 054eedc44fc09b17c72c088997c3dc1252cd819dadf0f5ca23178109964f926d
sources_digest: e18e780fa5b962d86c380672f041dd05a58290d1b9554f755715b847af3f7558
links:
  - to: color-and-configuration-management
    relation: uses
    description: >-
      Applies polygon colors via getFillColor callback and layer-specific
      styling from config/colors.config and config/layers.config
  - to: debouncing-and-async-data-loading
    relation: implements
    description: >-
      Debounces dataUrl changes with configurable interval (default 1000ms) via
      setTimeout cleanup to avoid rapid re-renders during URL updates
  - to: deck-gl-layer-foundation
    relation: uses
    description: >-
      Extends CompositeLayer and composes four stacked GeoJsonLayer instances
      for depth-ordered polygon rendering
  - to: shared-picking-and-layer-utilities
    relation: uses
    description: >-
      Uses getLayerGroupOffset for polygon offset calculations and picking
      utilities from layers/_shared
generator:
  version: 1
covers:
  - symbol: PolygonsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L38-L43'
  - symbol: PolygonsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L45-L246'
  - symbol: constructor
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L52-L61'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L63-L69'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L71-L99'
  - symbol: finalizeState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L101-L107'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L109-L111'
  - symbol: getFillColor
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L127-L135'
  - symbol: getHighlightLineWidth
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L137-L145'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L147-L149'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L151-L238'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L240-L245'
---

<!-- context:generated:start -->

## Summary

Deck.gl composite layers for rendering interactive polygon features with highlight capabilities and debounced URL-based data loading. Stacks multiple GeoJsonLayer instances at different z-orders via polygon offsets to render base outlines, fill highlights, and highlight borders. Supports inline data and remote data via debounced URL loading with configurable debounce intervals.

## Related

- uses [[color-and-configuration-management]] — Applies polygon colors via getFillColor callback and layer-specific styling from config/colors.config and config/layers.config
- implements [[debouncing-and-async-data-loading]] — Debounces dataUrl changes with configurable interval (default 1000ms) via setTimeout cleanup to avoid rapid re-renders during URL updates
- uses [[deck-gl-layer-foundation]] — Extends CompositeLayer and composes four stacked GeoJsonLayer instances for depth-ordered polygon rendering
- uses [[shared-picking-and-layer-utilities]] — Uses getLayerGroupOffset for polygon offset calculations and picking utilities from layers/_shared

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
