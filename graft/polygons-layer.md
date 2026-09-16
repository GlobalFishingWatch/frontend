---
name: Polygons Layer
slug: polygons-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/polygons/index.ts
    hash: 8968a691c1ff72ec627cbaa0ccc6d6b4e2f223ccc58dd268da87e4928d2d87cf
  - path: libs/deck-layers/src/layers/polygons/polygons.types.ts
    hash: 90d8bf6dc6be489e818c852897bed4b5554b20631877f608656fc8bfefabd41a
  - path: libs/deck-layers/src/layers/polygons/PolygonsLayer.ts
    hash: 054eedc44fc09b17c72c088997c3dc1252cd819dadf0f5ca23178109964f926d
sources_digest: 510f99332dc06bf93fcc548bbb12ae6ea47045d05752234e3a9b245e31587ebc
links:
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends CompositeLayer to render Polygon/MultiPolygon GeoJSON with
      highlight state tracking
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
  - symbol: PolygonFeature
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/polygons.types.ts:L7-L10'
  - symbol: PolygonPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/polygons.types.ts:L12-L12'
  - symbol: PolygonPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/polygons.types.ts:L14-L14'
  - symbol: PolygonsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/polygons.types.ts:L16-L24'
---

<!-- context:generated:start -->

## Summary

Deck.gl composite layer for rendering polygon geometries with highlighting support. Accepts GeoJSON Polygon/MultiPolygon features with a required highlighted boolean property and exposes customizable styling and picking interactions.

## Related

- uses [[deck-gl-composite-layer-pattern]] — Extends CompositeLayer to render Polygon/MultiPolygon GeoJSON with highlight state tracking

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
