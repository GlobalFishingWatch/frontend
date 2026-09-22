---
name: Feature Classification & Analytics
slug: feature-classification-analytics
type: concept
sources:
  - path: apps/platform/features/_map/map/map-interaction.utils.ts
    hash: 77238bda9dd00033d960042596f40da06a3ba9d79d19dacb2ae1e16d11b14e33
  - path: apps/platform/features/_map/map/map-interactions.hooks.ts
    hash: 66059acd630a27c9d08994d3847cc9106281478c4299e1a9e955acd92df70b7e
sources_digest: d155d8380292907f6ff344972f9798e474abd269e39b8f4c6246ccc9d1f038cb
links:
  - to: map-interactions
    relation: implements
    description: Enables rich analytics logging of user interactions by feature type
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

Design pattern for categorizing map layer interactions and generating structured analytics events. Uses type guards (isTilesClusterLayer, isRulerLayerPoint, isTrackSegment) and discriminated unions to extract layer-specific metadata (vessel IDs, visualization mode, event type) for tracking user engagement with different data types.

## Related

- implements [[map-interactions]] — Enables rich analytics logging of user interactions by feature type

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
