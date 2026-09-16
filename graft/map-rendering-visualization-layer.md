---
name: Map Rendering & Visualization Layer
slug: map-rendering-visualization-layer
type: system
sources:
  - path: apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts
    hash: 27c5409eb759727ca7c6b7cb5faf68b20c9f1e9160758753767ba48c154c71fd
  - path: apps/track-labeler/src/features/map/map-controls/MapControls.tsx
    hash: 61da58e8fc48819129fed3ef3a112ead2f1e3cd19a25195684f1a2dcddc2def7
  - path: apps/track-labeler/src/features/map/map.hooks.ts
    hash: 146ba12003ea3213d3b76912cbb5b0468b45829c589f7b55b316106d499a4d8e
  - path: apps/track-labeler/src/features/map/map.selectors.ts
    hash: 16c50d507c7162b6712c5251c3a1ab296c0c2a41e23842e3a40cc2bb192773a4
  - path: apps/track-labeler/src/features/map/Map.tsx
    hash: d8f4eb5353fe91bc98786000f3f2629cd244c3fca9b9a32c51ce78c3353b30b1
sources_digest: d0ed48a45002cc068ab565875991b8fec4347966e8fc51919c3d5033a28cbc0d
links:
  - to: contextual-layers-configuration
    relation: depends_on
    description: >-
      MapControls uses getContextualLayersDataviews selector to render layer
      visibility toggles and basemap switcher.
  - to: deck-gl-layer-composition-system
    relation: uses
    description: >-
      Map component calls useMapDeckLayers to build track, ruler, and contextual
      layers; feeds them to DeckGL renderer.
  - to: ruler-drawing-tool
    relation: uses
    description: >-
      Map stores Deck instance via useSetMapInstance for ruler click handling;
      MapControls integrates Rulers component.
  - to: sidebar-segment-labeling-interface
    relation: uses
    description: >-
      Map click events (via useMapClick) dispatch selectedTracks actions;
      sidebar responds to Redux updates.
  - to: timebar-ui-data-filtering
    relation: uses
    description: >-
      Map highlights time ranges via useMapClick dispatcher; timebar.slice
      tracks highlightedTime state.
generator:
  version: 1
covers:
  - symbol: MapComponent
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L40-L184'
  - symbol: handleLegendClick
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L84-L86'
  - symbol: updateBounds
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L100-L125'
  - symbol: MapControls
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L21-L161'
  - symbol: handleLayerToggle
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L33-L40'
  - symbol: switchBasemap
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L49-L51'
  - symbol: useClickOutside
    kind: function
    at: >-
      apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts:L3-L23
  - symbol: handleClickOutside
    kind: function
    at: >-
      apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts:L10-L14
  - symbol: useMapHover
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L21-L44'
  - symbol: useMapClick
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L46-L78'
  - symbol: LatLon
    kind: type
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L80-L83'
  - symbol: HighlightedTime
    kind: type
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L84-L84'
  - symbol: useMapViewState
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L92-L94'
  - symbol: useMapSetViewState
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L95-L104'
  - symbol: useHiddenLabelsConnect
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L106-L123'
  - symbol: dispatchHiddenLabels
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L110-L120'
  - symbol: useSetMapInstance
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L127-L134'
  - symbol: useDeckMap
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L136-L138'
  - symbol: extractVesselDirectionPoints
    kind: function
    at: 'apps/track-labeler/src/features/map/map.selectors.ts:L18-L63'
  - symbol: extractVesselDirectionPointsByDateRange
    kind: function
    at: 'apps/track-labeler/src/features/map/map.selectors.ts:L65-L75'
---

<!-- context:generated:start -->

## Summary

Deck.GL-powered map engine displaying vessel tracks with interactive controls, layer management, and user interactions. The Map component throttles viewport updates (100ms), manages click/hover events through custom hooks, renders track points and ruler annotations via deck.gl layers, and displays a customizable legend with keyboard shortcuts. MapControls provides zoom, basemap switching, layer visibility, and coordinate display UI.

## Related

- depends on [[contextual-layers-configuration]] — MapControls uses getContextualLayersDataviews selector to render layer visibility toggles and basemap switcher.
- uses [[deck-gl-layer-composition-system]] — Map component calls useMapDeckLayers to build track, ruler, and contextual layers; feeds them to DeckGL renderer.
- uses [[ruler-drawing-tool]] — Map stores Deck instance via useSetMapInstance for ruler click handling; MapControls integrates Rulers component.
- uses [[sidebar-segment-labeling-interface]] — Map click events (via useMapClick) dispatch selectedTracks actions; sidebar responds to Redux updates.
- uses [[timebar-ui-data-filtering]] — Map highlights time ranges via useMapClick dispatcher; timebar.slice tracks highlightedTime state.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
