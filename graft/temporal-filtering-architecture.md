---
name: Temporal Filtering Architecture
slug: temporal-filtering-architecture
type: concept
sources:
  - path: libs/deck-layers/src/layers/user/user.utils.ts
    hash: 1ccaa49cf38391905485bd0f3fd0785fae24487a069d16ff293dec71e01d6999
  - path: libs/deck-layers/src/layers/user/UserBaseLayer.ts
    hash: a7f512b76e078af7d86aa4bde23cba88d6cd2bc922ce07c1da4a6def2f05c381
  - path: libs/deck-layers/src/layers/user/UserPointsTileLayer.ts
    hash: ee18bd0303860e65d7e0fa70fb360d4a1d6cc60d533f23be85848b57d68dcf42
  - path: libs/deck-layers/src/layers/vessel/vessel.utils.ts
    hash: b31c93a53b33d3eb2251820a8d3532ccd319d559d2042bc624dfb689cfd8a0c2
  - path: libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts
    hash: 5afab348f622726bf805c9a0799619a76e54594b344f52aa39243a563a50aa7c
sources_digest: 523182a0f3f61869125f2b00604becc3bacc884728cf724cd30f1ab23933aded
links:
  - to: shader-based-filtering-and-highlighting
    relation: implements
    description: >-
      GPU implementation of time window filtering and gap detection via GLSL
      discard statements
generator:
  version: 1
covers:
  - symbol: _UserBaseLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L43-L44'
  - symbol: BoundsResponse
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L57-L61'
  - symbol: UserBaseLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L63-L65'
  - symbol: UserBaseLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L67-L67'
  - symbol: UserBaseLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L70-L456'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L77-L82'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L84-L137'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L139-L141'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L143-L148'
  - symbol: getRenderedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L204-L245'
  - symbol: _getTilesUrl
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L247-L275'
  - symbol: _getTimeFilterProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L277-L327'
  - symbol: _getSublayerFilterExtensionProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L329-L340'
  - symbol: _combineFilterExtensionProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L342-L418'
  - symbol: _getExtensionFilterProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L420-L455'
  - symbol: _UserPointsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L41-L41'
  - symbol: GetUserPointsDataParams
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L53-L56'
  - symbol: UserPointsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L58-L62'
  - symbol: UserPointsTileLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L63-L374'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L70-L90'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L92-L100'
  - symbol: aggregatedPropertyHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L102-L110'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L112-L115'
  - symbol: debounceTime
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L117-L119'
  - symbol: viewportLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L121-L123'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L130-L159'
  - symbol: getLayerInstance
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L210-L213'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L215-L217'
  - symbol: getColor
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L288-L290'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L299-L373'
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

Multi-level time-range filtering spanning GPU shaders, CPU feature iteration, and API filter extensions. Vessel tracks use relative timestamps against configurable timestampBase with shader-based discard for performance; user layers apply 30-minute precision offset workaround for 32-bit float accuracy. Supports three time-filter modes (dateRange, date, infinity-fallback) with flexible time boundary semantics. Never filters before coordinate bounds checking or allow post-filter state inconsistency.

## Related

- implements [[shader-based-filtering-and-highlighting]] — GPU implementation of time window filtering and gap detection via GLSL discard statements

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
