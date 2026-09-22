---
name: Shared Picking and Layer Utilities
slug: shared-picking-and-layer-utilities
type: concept
sources:
  - path: libs/deck-layers/src/layers/polygons/PolygonsLayer.ts
    hash: 054eedc44fc09b17c72c088997c3dc1252cd819dadf0f5ca23178109964f926d
  - path: libs/deck-layers/src/layers/rulers/RulersLayer.ts
    hash: 0987b644ded4137df111b8244af9d8e341370cfe3cda02680c222564d1dcf280
  - path: libs/deck-layers/src/layers/user/UserBaseLayer.ts
    hash: a7f512b76e078af7d86aa4bde23cba88d6cd2bc922ce07c1da4a6def2f05c381
  - path: libs/deck-layers/src/layers/vessel/vessel.config.ts
    hash: 3cb2487de9e41a0fce0ca91bc46c09b58a65e35ca59affc62fea22dedf9c0919
  - path: libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts
    hash: 8747c431d53cf6e91d0e2bacc5ff40f69fc1e7111e4b1e0a5074fbe2bc193520
  - path: libs/deck-layers/src/layers/vessel/VesselLayer.ts
    hash: ff98ab4d46317426d154301060ca594c5abefd0c2e666a3ed22c672202d9a7c4
  - path: libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts
    hash: 3a5a07ecf6e98211c5b83668da0ea76308d524cfa07592490bb786a28c643025
  - path: libs/deck-layers/src/layers/workspaces/WorkspacesLayer.ts
    hash: da86aaef3c5f9b2b8119ee3499c9a1117349d0c2cc6e9f71ff973a09ddb3dc53
sources_digest: ba650973f7836c8959b7db9f29367b9bb42e91b48de0296642cb2ee48e043254
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

Common utilities across layers including getLayerGroupOffset for polygon offset depth ordering (via LayerGroup enum), hexToDeckColor for color format conversion, getFetchLoadOptions for API request construction, and layer configuration exports. Picking utilities standardize DeckPickingObject structures and feature ID extraction. Utilities prevent circular dependency issues by being imported directly rather than through barrel exports.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
