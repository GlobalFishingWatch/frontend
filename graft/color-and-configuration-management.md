---
name: Color and Configuration Management
slug: color-and-configuration-management
type: concept
sources:
  - path: libs/deck-layers/src/layers/polygons/PolygonsLayer.ts
    hash: 054eedc44fc09b17c72c088997c3dc1252cd819dadf0f5ca23178109964f926d
  - path: libs/deck-layers/src/layers/rulers/RulersLayer.ts
    hash: 0987b644ded4137df111b8244af9d8e341370cfe3cda02680c222564d1dcf280
  - path: libs/deck-layers/src/layers/user/UserPointsTileLayer.ts
    hash: ee18bd0303860e65d7e0fa70fb360d4a1d6cc60d533f23be85848b57d68dcf42
  - path: libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts
    hash: 68971f086786b011126e331d2221ca049e43d9ca953c32760e1753bafd40c041
  - path: libs/deck-layers/src/layers/vessel/vessel.config.ts
    hash: 3cb2487de9e41a0fce0ca91bc46c09b58a65e35ca59affc62fea22dedf9c0919
  - path: libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts
    hash: 2ce5f24c5faa4596c294f609a7911d8c440f827d39af4d8b2420d3ced54bb0eb
  - path: libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts
    hash: 8747c431d53cf6e91d0e2bacc5ff40f69fc1e7111e4b1e0a5074fbe2bc193520
  - path: libs/deck-layers/src/layers/vessel/VesselLayer.ts
    hash: ff98ab4d46317426d154301060ca594c5abefd0c2e666a3ed22c672202d9a7c4
  - path: libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts
    hash: 3a5a07ecf6e98211c5b83668da0ea76308d524cfa07592490bb786a28c643025
  - path: libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts
    hash: 5afab348f622726bf805c9a0799619a76e54594b344f52aa39243a563a50aa7c
  - path: libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts
    hash: da86aaef3c5f9b2b8119ee3499c9a1117349d0c2cc6e9f71ff973a09ddb3dc53
sources_digest: f565ea15237ed5f94725b031c6e452d07cf74e8504e05a40dcd16874cb9e4f84
links: []
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
  - symbol: WorkspacesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L10-L34'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L14-L16'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts:L18-L33'
---

<!-- context:generated:start -->

## Summary

Centralized configuration system where vessel.config, colors.config, layers.config, and colorRamps.config define visual mappings (event types to colors/shapes, layer group offsets, sprite atlases, color step ramps). Configuration drives dynamic styling via getColor/getRadius/getLineWidth callbacks without code changes. Hex color conversion via hexToDeckColor bridges hex strings to deck.gl's [r,g,b,a] format. Support for data-driven color ramps via stepped values and ordinal shape mappings.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
