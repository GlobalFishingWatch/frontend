---
name: Map Interactions
slug: map-interactions
type: system
sources:
  - path: apps/platform/features/_map/map/map-interaction.utils.ts
    hash: 77238bda9dd00033d960042596f40da06a3ba9d79d19dacb2ae1e16d11b14e33
  - path: apps/platform/features/_map/map/map-interactions.atoms.ts
    hash: ab0aaa1f73958ecb79cc9afdd267eef53d97db01740f333f4ea3dfc2805f21be
  - path: apps/platform/features/_map/map/map-interactions.hooks.ts
    hash: 66059acd630a27c9d08994d3847cc9106281478c4299e1a9e955acd92df70b7e
sources_digest: 390d3fc6393d2d0b1b46ee2452a29cbea0d6c27d01a79b882f6e3022e1ceb1ac
links:
  - to: dataview-state-management
    relation: uses
    description: >-
      Reads activity and event dataviews via Redux selectors to determine
      interaction payloads
  - to: feature-classification-analytics
    relation: uses
    description: >-
      Classifies clicked features and generates analytics events via
      getAnalyticsEvent and type guards
  - to: map-overlays-annotations-rulers
    relation: uses
    description: >-
      Early-returns from click handling when annotation or error notification
      editing is active
  - to: map-rendering-core
    relation: implements
    description: >-
      Provides event handlers (useMapMouseClick, useMapMouseHover, useMapCursor)
      used by DeckGLWrapper
generator:
  version: 1
covers:
  - symbol: getSliceInteractionEvent
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L21-L34'
  - symbol: getClickedFeatureKey
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L36-L39'
  - symbol: getNewClickedFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L41-L47'
  - symbol: getUpdatedClickedFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L49-L56'
  - symbol: isTilesClusterLayer
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L58-L59'
  - symbol: isTilesClusterLayerCluster
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L61-L62'
  - symbol: isRulerLayerPoint
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L64-L65'
  - symbol: isBathymetryContour
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L67-L68'
  - symbol: isTrackSegment
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L70-L72'
  - symbol: getAnalyticsEvent
    kind: function
    at: 'apps/platform/features/_map/map/map-interaction.utils.ts:L74-L115'
  - symbol: InteractionPromise
    kind: type
    at: 'apps/platform/features/_map/map/map-interactions.atoms.ts:L13-L13'
  - symbol: useCancelInteractionPromises
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.atoms.ts:L29-L54'
  - symbol: useGetAreClusterTilesLoading
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L91-L103'
  - symbol: useInteractionHandlers
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L109-L252'
  - symbol: useClickedEventConnect
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L254-L393'
  - symbol: useGetPickingInteraction
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L395-L437'
  - symbol: isDataviewLayerLoaded
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L442-L446'
  - symbol: waitForLayersUpdate
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L448-L467'
  - symbol: useRefreshClickedEvent
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L469-L549'
  - symbol: isOutdated
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L495-L502'
  - symbol: pickFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L504-L510'
  - symbol: useMapMouseHover
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L554-L599'
  - symbol: useMapHoverCoordinates
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L601-L604'
  - symbol: useMapMouseClick
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L606-L633'
  - symbol: useMapCursor
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L635-L694'
  - symbol: useMapDrag
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L696-L737'
  - symbol: useDebouncedDispatchHighlightedEvent
    kind: function
    at: 'apps/platform/features/_map/map/map-interactions.hooks.ts:L739-L753'
---

<!-- context:generated:start -->

## Summary

Manages user interactions with the map (clicks, hovers, cursor feedback) by coordinating deck.gl picking events, Redux state, and Jotai atoms. Handles feature classification (heatmaps, detections, clusters, ruler points, bathymetry), analytics event generation, and concurrent interaction promise tracking for cancellation. Implements throttling/debouncing to manage performance.

## Related

- uses [[dataview-state-management]] — Reads activity and event dataviews via Redux selectors to determine interaction payloads
- uses [[feature-classification-analytics]] — Classifies clicked features and generates analytics events via getAnalyticsEvent and type guards
- uses [[map-overlays-annotations-rulers]] — Early-returns from click handling when annotation or error notification editing is active
- implements [[map-rendering-core]] — Provides event handlers (useMapMouseClick, useMapMouseHover, useMapCursor) used by DeckGLWrapper

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
