---
name: Graticules Layer
slug: graticules-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/graticules/graticules.data.ts
    hash: 7411adb19ce4ddd39c383d876f4f124bab507ce67f862570fd495071425c6679
  - path: libs/deck-layers/src/layers/graticules/graticules.types.ts
    hash: f4ec3d0312ac54fcbec06bd1e0233347e5cfd4df7e676dd47f4361869b3aa02f
  - path: libs/deck-layers/src/layers/graticules/graticules.utils.ts
    hash: 391d3bcf163b89645a6c30195df7150b451e63e7bde835d80465fc18fee3cbc2
  - path: libs/deck-layers/src/layers/graticules/GraticulesLayer.ts
    hash: d60c36636fc638ad79ea850e7ce6bbfa97701ffbe37086809cdd998669b384e7
  - path: libs/deck-layers/src/layers/graticules/index.ts
    hash: fce9e49b8661a04cec1c4ff6241797ba6cef3e74c93e9b80e93a7dc4b923c695
sources_digest: d357ef181b7b1a3cb1a766c111ade5d44329948bfd47e71821840d2fb8e12c36
links:
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends CompositeLayer, composes PathLayer for lines and TextLayer for
      coordinate labels; uses updateTriggers on viewport changes
  - to: viewport-aware-level-of-detail
    relation: implements
    description: >-
      checkScaleRankByViewport filters features based on viewport geographic
      extent; progressive filtering across 4 zoom breakpoints prevents cluttered
      rendering at wide zoom
generator:
  version: 1
covers:
  - symbol: GraticulesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L29-L136'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L36-L42'
  - symbol: shouldUpdateState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L44-L51'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L53-L57'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L95-L135'
  - symbol: getLineScaleRank
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.data.ts:L5-L7'
  - symbol: getLongitudeLabel
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.data.ts:L9-L12'
  - symbol: getLatitudeLabel
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.data.ts:L14-L17'
  - symbol: generateGraticulesFeatures
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.data.ts:L19-L61'
  - symbol: GraticuleLineGroup
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L5-L5'
  - symbol: GraticulesLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L7-L10'
  - symbol: ViewportSize
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L12-L15'
  - symbol: GraticulesLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L17-L20'
  - symbol: GraticulesProperties
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L22-L26'
  - symbol: GraticulesFeature
    kind: type
    at: 'libs/deck-layers/src/layers/graticules/graticules.types.ts:L28-L28'
  - symbol: checkScaleRankByViewport
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.utils.ts:L7-L27'
---

<!-- context:generated:start -->

## Summary

Deck.gl composite layer rendering geographic grid lines (latitude/longitude) with adaptive zoom-level visibility control. Generates LineString features statically at module load, filters by scaleRank (1, 5, 10, 30, 90 degree intervals) based on viewport bounds, and labels with cardinal directional annotations.

## Related

- uses [[deck-gl-composite-layer-pattern]] — Extends CompositeLayer, composes PathLayer for lines and TextLayer for coordinate labels; uses updateTriggers on viewport changes
- implements [[viewport-aware-level-of-detail]] — checkScaleRankByViewport filters features based on viewport geographic extent; progressive filtering across 4 zoom breakpoints prevents cluttered rendering at wide zoom

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
