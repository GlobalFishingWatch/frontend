---
name: Data Transformation Pipeline
slug: data-transformation-pipeline
type: concept
sources:
  - path: libs/deck-layers/src/layers/rulers/rulers.utils.ts
    hash: d4e64a77446178c5b684500ff97fbf66a101314676b443d522a679d96e44b20e
  - path: libs/deck-layers/src/layers/user/user.utils.ts
    hash: 1ccaa49cf38391905485bd0f3fd0785fae24487a069d16ff293dec71e01d6999
  - path: libs/deck-layers/src/layers/user/UserTracksLayer.ts
    hash: ed96fee373ae05473d41b52d8636dfeff97d0c85d38518bcd6a8c58279ab2862
  - path: libs/deck-layers/src/layers/vessel/vessel.track.utils.ts
    hash: e7e7575af1c6c608ec261f8d0ebfbadb31fffebf1782ca66633595e010f5c423
  - path: libs/deck-layers/src/layers/vessel/vessel.utils.ts
    hash: b31c93a53b33d3eb2251820a8d3532ccd319d559d2042bc624dfb689cfd8a0c2
sources_digest: 48b854ea55eb216eaed4adf76fb9158ee826e0d27004983eff256260e26cfce5
links: []
generator:
  version: 1
covers:
  - symbol: getRulerCoordsPairs
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L7-L15'
  - symbol: hasRulerStartAndEnd
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L17-L18'
  - symbol: getGreatCircleMultiLine
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L20-L23'
  - symbol: getRulerLengthLabel
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L25-L33'
  - symbol: getRulerStartAndEndPoints
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L35-L45'
  - symbol: getRulerCenterPointWithLabel
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L47-L61'
  - symbol: _UserTrackLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L53-L53'
  - symbol: UserTracksPathLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L90-L181'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L97-L136'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L138-L152'
  - symbol: draw
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L154-L180'
  - symbol: UserTrackContextLayer
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L183-L183'
  - symbol: UserTrackSublayer
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L184-L184'
  - symbol: RawDataIndex
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L186-L186'
  - symbol: UserTracksLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L187-L202'
  - symbol: UserTracksLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L209-L601'
  - symbol: shouldUpdateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L220-L222'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L224-L244'
  - symbol: _getLayerKey
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L246-L255'
  - symbol: _getDataKey
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L257-L261'
  - symbol: _getLodIndex
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L263-L268'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L270-L272'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L274-L279'
  - symbol: _getHighlightTimes
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L281-L286'
  - symbol: setHighlightedTime
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L288-L296'
  - symbol: _getFeatureIndex
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L444-L453'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L461-L463'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L465-L467'
  - symbol: getColor
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L469-L472'
  - symbol: getSegments
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L474-L485'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L487-L534'
  - symbol: addLine
    kind: function
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L501-L518'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L556-L600'
  - symbol: IsFeatureInRangeParams
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L11-L17'
  - symbol: getFeatureTimeRange
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L19-L47'
  - symbol: isFeatureInRange
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L49-L66'
  - symbol: getFilterExtensionSize
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L68-L75'
  - symbol: sortedFirstIndexAfter
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L7-L19'
  - symbol: sortedFirstIndexAtOrAfter
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L21-L33'
  - symbol: getPositions
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L35-L61'
  - symbol: memoize
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L20-L32'
  - symbol: getVesselResourceChunks
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L36-L64'
  - symbol: GetSegmentsFromDataParams
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L66-L72'
  - symbol: getPointByIndex
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L114-L126'
  - symbol: isGapAfter
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L130-L135'
  - symbol: isTimestampInRange
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L137-L141'
  - symbol: flushCurrent
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L170-L178'
  - symbol: generateVesselGraphStepValues
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L234-L238'
  - symbol: generateVesselGraphSteps
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.utils.ts:L240-L251'
---

<!-- context:generated:start -->

## Summary

Converts raw API data into deck.gl-compatible GeoJSON features and track segments. Vessel tracks extract positions within time windows, compute bearings between consecutive points, handle gap detection via threshold, and filter coordinate outliers. User track loader parses binary data via @loaders.gl. GeoJSON conversion maintains Feature envelope with properties for interactive metadata. Memoization caches expensive transformations keyed by props and visibility state.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
