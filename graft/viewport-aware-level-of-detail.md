---
name: Viewport-Aware Level-of-Detail
slug: viewport-aware-level-of-detail
type: concept
sources:
  - path: libs/deck-layers/src/layers/graticules/graticules.utils.ts
    hash: 391d3bcf163b89645a6c30195df7150b451e63e7bde835d80465fc18fee3cbc2
  - path: libs/deck-layers/src/layers/graticules/GraticulesLayer.ts
    hash: d60c36636fc638ad79ea850e7ce6bbfa97701ffbe37086809cdd998669b384e7
sources_digest: 55a3637ae8505fb09949322285831b740d3733bd4f83ff0ad79e772b18e00e67
links: []
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
  - symbol: checkScaleRankByViewport
    kind: function
    at: 'libs/deck-layers/src/layers/graticules/graticules.utils.ts:L7-L27'
---

<!-- context:generated:start -->

## Summary

Performance optimization where rendering adapts to viewport zoom by filtering features by scaleRank. checkScaleRankByViewport calculates viewport geographic extent, compares against breakpoints (9, 25, 50, 150 degrees), and progressively filters to higher scaleRank values at zoomed-in levels. Prevents cluttered graticule rendering at continental/global scales.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
