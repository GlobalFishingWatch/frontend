---
name: Vessel Layer System
slug: vessel-layer-system
type: system
sources:
  - path: libs/deck-layers/src/layers/vessel/index.ts
    hash: b7e7feca3422b9821ffb2b7041ae3524bfda675ca79da33777ff8a3d9ba2546c
  - path: libs/deck-layers/src/layers/vessel/TrackLabelerVesselLayer.ts
    hash: 17818e7451572531d46713925fcc846fbd9f1562c1598f91c1423d9ea54e598a
  - path: libs/deck-layers/src/layers/vessel/vessel.config.ts
    hash: 3cb2487de9e41a0fce0ca91bc46c09b58a65e35ca59affc62fea22dedf9c0919
  - path: libs/deck-layers/src/layers/vessel/vessel.track.utils.ts
    hash: e7e7575af1c6c608ec261f8d0ebfbadb31fffebf1782ca66633595e010f5c423
  - path: libs/deck-layers/src/layers/vessel/vessel.types.ts
    hash: 62182a3f5272d7b7c54c5cb4c585640bdfb29f57204b826667f81cc2108c212f
  - path: libs/deck-layers/src/layers/vessel/vessel.utils.ts
    hash: b31c93a53b33d3eb2251820a8d3532ccd319d559d2042bc624dfb689cfd8a0c2
  - path: libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts
    hash: 2ce5f24c5faa4596c294f609a7911d8c440f827d39af4d8b2420d3ced54bb0eb
  - path: libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts
    hash: 8747c431d53cf6e91d0e2bacc5ff40f69fc1e7111e4b1e0a5074fbe2bc193520
  - path: libs/deck-layers/src/layers/vessel/VesselLayer.ts
    hash: ff98ab4d46317426d154301060ca594c5abefd0c2e666a3ed22c672202d9a7c4
  - path: libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts
    hash: 3a5a07ecf6e98211c5b83668da0ea76308d524cfa07592490bb786a28c643025
  - path: libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts
    hash: a0179183bde9448b2a8adbbed30d065eeea88208dad4d9001406a623c8281fd8
  - path: libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts
    hash: 5afab348f622726bf805c9a0799619a76e54594b344f52aa39243a563a50aa7c
sources_digest: 2d5c7782f01ff3b4eb85c6058b1f3055657eb793c154ae3ca63fb4a4a6397aed
links:
  - to: color-and-configuration-management
    relation: configures
    description: >-
      Uses vessel.config for event type-to-shape mappings, EVENTS_COLORS for
      event visualization, VESSEL_GRAPH_COLORS for speed/elevation steps
  - to: deck-gl-layer-foundation
    relation: uses
    description: >-
      Extends CompositeLayer, PathLayer, IconLayer, ScatterplotLayer and related
      deck.gl primitives for GPU-accelerated rendering
  - to: global-fishing-watch-api-integration
    relation: depends_on
    description: >-
      Fetches vessel track data via VesselTrackLoader, VesselEventsLoader, and
      GFWAPI client for authenticated data access
  - to: shader-based-filtering-and-highlighting
    relation: implements
    description: >-
      Implements GLSL shader injection for time-window filtering, gap detection,
      speed/elevation coloring, and highlight time-range visualization without
      CPU overhead
  - to: spatial-indexing-and-geometry
    relation: uses
    description: >-
      Employs KDBush for efficient nearest-neighbor picking queries and Turf.js
      for bearing calculations and bounding box operations
generator:
  version: 1
covers:
  - symbol: TrackLabelerVesselLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/TrackLabelerVesselLayer.ts:L11-L18'
  - symbol: TrackLabelerVesselLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/TrackLabelerVesselLayer.ts:L20-L73'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/TrackLabelerVesselLayer.ts:L23-L72'
  - symbol: _VesselEventIconLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L10-L26'
  - symbol: VesselEventIconLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L28-L29'
  - symbol: VesselEventIconLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L73-L200'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L80-L105'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L107-L176'
  - symbol: draw
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts:L186-L199'
  - symbol: _VesselEventsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts:L23-L37'
  - symbol: VesselEventsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts:L39-L160'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts:L42-L159'
  - symbol: getFillColor
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts:L45-L54'
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
  - symbol: VesselTrackPositionFeature
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L15-L25'
  - symbol: VesselPositionMode
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L26-L26'
  - symbol: _VesselTrackPositionLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L28-L38'
  - symbol: VesselTrackPositionLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L39-L39'
  - symbol: VesselTrackPositionLayer
    kind: class
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L41-L143'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts:L46-L142'
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
  - symbol: EventShape
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.config.ts:L13-L13'
  - symbol: VesselsColorByProperty
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.config.ts:L64-L64'
  - symbol: VesselsColorByValue
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.config.ts:L65-L65'
  - symbol: sortedFirstIndexAfter
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L7-L19'
  - symbol: sortedFirstIndexAtOrAfter
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L21-L33'
  - symbol: getPositions
    kind: function
    at: 'libs/deck-layers/src/layers/vessel/vessel.track.utils.ts:L35-L61'
  - symbol: VesselDeckLayersEvent
    kind: interface
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L10-L16'
  - symbol: VesselDataType
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L18-L18'
  - symbol: VesselTrackVisualizationMode
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L19-L19'
  - symbol: _VesselLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L21-L32'
  - symbol: VesselEventProperties
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L40-L45'
  - symbol: VesselTrackInteractionType
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L47-L47'
  - symbol: VesselTrackProperties
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L49-L59'
  - symbol: VesselPositionProperties
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L61-L69'
  - symbol: TrackLabelerPoint
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L71-L79'
  - symbol: VesselEventPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L81-L82'
  - symbol: VesselEventPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L83-L83'
  - symbol: VesselTrackPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L85-L86'
  - symbol: VesselTrackPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L87-L87'
  - symbol: VesselPositionPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L89-L90'
  - symbol: VesselPositionPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/vessel/vessel.types.ts:L91-L94'
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

Comprehensive deck.gl layer suite for rendering vessel tracking data including movement tracks, temporal events, and position markers. Orchestrates multi-mode visualization (tracks, positions, points) with time-range filtering, speed/elevation coloring, interactive highlighting, and efficient spatial indexing via KDBush. Manages chunk-based data loading for large historical datasets and handles antimeridian-crossing tracks through coordinate shifting.

## Related

- configures [[color-and-configuration-management]] — Uses vessel.config for event type-to-shape mappings, EVENTS_COLORS for event visualization, VESSEL_GRAPH_COLORS for speed/elevation steps
- uses [[deck-gl-layer-foundation]] — Extends CompositeLayer, PathLayer, IconLayer, ScatterplotLayer and related deck.gl primitives for GPU-accelerated rendering
- depends on [[global-fishing-watch-api-integration]] — Fetches vessel track data via VesselTrackLoader, VesselEventsLoader, and GFWAPI client for authenticated data access
- implements [[shader-based-filtering-and-highlighting]] — Implements GLSL shader injection for time-window filtering, gap detection, speed/elevation coloring, and highlight time-range visualization without CPU overhead
- uses [[spatial-indexing-and-geometry]] — Employs KDBush for efficient nearest-neighbor picking queries and Turf.js for bearing calculations and bounding box operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
