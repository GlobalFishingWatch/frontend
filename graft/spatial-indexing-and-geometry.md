---
name: Spatial Indexing and Geometry
slug: spatial-indexing-and-geometry
type: concept
sources:
  - path: libs/deck-layers/src/layers/rulers/rulers.utils.ts
    hash: d4e64a77446178c5b684500ff97fbf66a101314676b443d522a679d96e44b20e
  - path: libs/deck-layers/src/layers/rulers/RulersLayer.ts
    hash: 0987b644ded4137df111b8244af9d8e341370cfe3cda02680c222564d1dcf280
  - path: libs/deck-layers/src/layers/vessel/vessel.track.utils.ts
    hash: e7e7575af1c6c608ec261f8d0ebfbadb31fffebf1782ca66633595e010f5c423
  - path: libs/deck-layers/src/layers/vessel/vessel.utils.ts
    hash: b31c93a53b33d3eb2251820a8d3532ccd319d559d2042bc624dfb689cfd8a0c2
  - path: libs/deck-layers/src/layers/vessel/VesselLayer.ts
    hash: ff98ab4d46317426d154301060ca594c5abefd0c2e666a3ed22c672202d9a7c4
  - path: libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts
    hash: a0179183bde9448b2a8adbbed30d065eeea88208dad4d9001406a623c8281fd8
  - path: libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts
    hash: 5afab348f622726bf805c9a0799619a76e54594b344f52aa39243a563a50aa7c
sources_digest: f1107d7fc139b105e95ed558712e6149740efa995b694c09feaf1530a5980db2
links: []
generator:
  version: 1
covers:
  - symbol: getRulersLines
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L33-L37'
  - symbol: getRulersLinesLabels
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L39-L43'
  - symbol: RulersLayer
    kind: class
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L45-L119'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L49-L60'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L61-L118'
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
  - symbol: VesselEventsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L55-L57'
  - symbol: VesselLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L59-L63'
  - symbol: VesselLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L65-L73'
  - symbol: mergeBboxes
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L78-L99'
  - symbol: VesselLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L102-L670'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L107-L113'
  - symbol: isLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L115-L117'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L119-L123'
  - symbol: shouldUpdateState
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L192-L207'
  - symbol: _getTrackThinningLevel
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L209-L218'
  - symbol: _getTracksUrl
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L220-L248'
  - symbol: setHighlightedTime
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L264-L272'
  - symbol: setHighlightEventIds
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L274-L279'
  - symbol: _getVesselTrackLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L281-L368'
  - symbol: _getVesselEventLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L370-L405'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L407-L412'
  - symbol: _getLastPositionFeature
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L415-L438'
  - symbol: _getVesselPositionLayer
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L440-L548'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L550-L560'
  - symbol: getTrackLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L562-L564'
  - symbol: getEventLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L566-L568'
  - symbol: getVesselName
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L570-L572'
  - symbol: getColor
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L574-L576'
  - symbol: getFilters
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L578-L586'
  - symbol: getVesselsData
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L588-L590'
  - symbol: getVesselEventsData
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L592-L598'
  - symbol: getVesselTrackData
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L600-L602'
  - symbol: getVesselTrackSegments
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L604-L606'
  - symbol: getVesselTrackGraphExtent
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L608-L614'
  - symbol: getVesselTrackBounds
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L616-L624'
  - symbol: getVesselEventsBounds
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L626-L637'
  - symbol: getVesselEventsLayersLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L639-L645'
  - symbol: getVesselTracksLayersLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L647-L655'
  - symbol: getVesselLayersError
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L657-L665'
  - symbol: getAllSublayersLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselLayer.ts:L667-L669'
  - symbol: VesselTrackLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L26-L30'
  - symbol: VesselTrackLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L32-L209'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L150-L181'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L183-L185'
  - symbol: getSegments
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L187-L192'
  - symbol: getGraphExtent
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L194-L200'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts:L202-L208'
  - symbol: TrackShaderAttributeFlags
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L21-L25'
  - symbol: TrackShaderLayoutProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L27-L35'
  - symbol: getNarrowestLonSpan
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L40-L52'
  - symbol: getTrackShaderAttributeFlags
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L54-L68'
  - symbol: getTrackShaderLayoutKey
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L70-L74'
  - symbol: _VesselTrackPathLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L77-L183'
  - symbol: generateShaderColorSteps
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L185-L202'
  - symbol: VesselTrackPathLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L229-L230'
  - symbol: VesselTrackPathLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L311-L596'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L318-L408'
  - symbol: getPropsInstancedAttributes
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L410-L441'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L443-L459'
  - symbol: draw
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L461-L528'
  - symbol: rebase
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L505-L505'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L530-L532'
  - symbol: getSegments
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L534-L536'
  - symbol: getGraphExtent
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L538-L542'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts:L544-L595'
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

Efficient spatial operations combining Turf.js geographic utilities (bearing, distance, bounding box) with KDBush in-memory spatial indexing. KDBush enables O(log n) nearest-neighbor queries during vessel track picking. Turf handles antimeridian-crossing through coordinate shifting (±360° longitude adjustment), great-circle distance calculations for rulers, and bearing-aware label orientation. Bounding box merging logic ensures compact boxes across antimeridian.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
