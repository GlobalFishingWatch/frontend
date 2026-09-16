---
name: Global Fishing Watch API Integration
slug: global-fishing-watch-api-integration
type: concept
sources:
  - path: libs/deck-layers/src/layers/user/UserBaseLayer.ts
    hash: a7f512b76e078af7d86aa4bde23cba88d6cd2bc922ce07c1da4a6def2f05c381
  - path: libs/deck-layers/src/layers/user/UserPointsTileLayer.ts
    hash: ee18bd0303860e65d7e0fa70fb360d4a1d6cc60d533f23be85848b57d68dcf42
  - path: libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts
    hash: 68971f086786b011126e331d2221ca049e43d9ca953c32760e1753bafd40c041
  - path: libs/deck-layers/src/layers/user/UserTracksLayer.ts
    hash: ed96fee373ae05473d41b52d8636dfeff97d0c85d38518bcd6a8c58279ab2862
  - path: libs/deck-layers/src/layers/vessel/VesselLayer.ts
    hash: ff98ab4d46317426d154301060ca594c5abefd0c2e666a3ed22c672202d9a7c4
  - path: libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts
    hash: a0179183bde9448b2a8adbbed30d065eeea88208dad4d9001406a623c8281fd8
  - path: libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts
    hash: 5afab348f622726bf805c9a0799619a76e54594b344f52aa39243a563a50aa7c
sources_digest: 08496b6301ce6ab8d3fc02bb10a7f776426b8577efb06d28616fe274d1df7122
links: []
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
  - symbol: _UserContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L40-L40'
  - symbol: UserPolygonsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L47-L51'
  - symbol: UserContextTileLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L53-L336'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L60-L72'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L74-L76'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L78-L86'
  - symbol: aggregatedPropertyHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L88-L96'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L98-L101'
  - symbol: viewportLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L103-L105'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L107-L132'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L226-L335'
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
---

<!-- context:generated:start -->

## Summary

Data fetching and authentication layer integrating GFWAPI client, VesselTrackLoader, VesselEventsLoader, GFWMVTLoader, and UserTrackLoader for server-side data. Handles chunk-based loading for large historical datasets, MVT tile loading, binary data parsing via @loaders.gl, and relative-to-absolute timestamp conversion for compact data formats. Critical for vessel and user layer data sourcing.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
