---
name: Map Interaction & Feature Picking
slug: map-interaction-feature-picking
type: system
sources:
  - path: apps/platform/features/_map/map/map.slice.ts
    hash: fd5638d489e8525366dd305553aaeefae142a4d5730ad3e94ed327ab8d2384ec
sources_digest: 1fef661181b2737d4fc8c215d4f01464a1386b1ae7ca8a656544131b6ae9d5a9
links:
  - to: layer-composition-deck-integration
    relation: depends_on
    description: >-
      Receives picking objects from deck-layer-composer and enriches them with
      API data
  - to: redux-state-slices
    relation: depends_on
    description: Reads dataset and vessel state; dispatches enriched interaction state
generator:
  version: 1
covers:
  - symbol: loadCategorySelectors
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L69-L70'
  - symbol: loadDataviewSelectors
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L71-L71'
  - symbol: loadDatasetsUtils
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L72-L72'
  - symbol: ExtendedFeatureVesselDatasets
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L74-L81'
  - symbol: ExtendedFeatureVessel
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L83-L91'
  - symbol: ExtendedEventVessel
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L93-L93'
  - symbol: ExtendedFeatureSingleEvent
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L95-L95'
  - symbol: ExtendedFeatureByVesselEventPort
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L96-L102'
  - symbol: ExtendedFeatureByVesselEvent
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L103-L109'
  - symbol: ExtendedFeatureEvent
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L110-L110'
  - symbol: SliceExtendedFourwingsDeckSublayer
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L112-L114'
  - symbol: SliceExtendedFourwingsPickingObject
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L115-L120'
  - symbol: SliceExtendedClusterPickingObject
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L122-L125'
  - symbol: SliceExtendedFeature
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L127-L134'
  - symbol: SliceInteractionEvent
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L137-L140'
  - symbol: MapState
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L142-L157'
  - symbol: SublayerVessels
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L176-L179'
  - symbol: getInteractionEndpointDatasetConfig
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L181-L242'
  - symbol: getVesselInfoEndpoint
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L244-L268'
  - symbol: fetchVesselInfo
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L270-L290'
  - symbol: searchVesselMMSI
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L292-L313'
  - symbol: ActivityProperty
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L315-L315'
  - symbol: PositionRealTimeVessel
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L824-L827'
  - symbol: BQClusterEvent
    kind: type
    at: 'apps/platform/features/_map/map/map.slice.ts:L923-L923'
  - symbol: selectIsMapLoaded
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1147-L1147'
  - symbol: selectClickedEvent
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1148-L1148'
  - symbol: selectActivityInteractionStatus
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1149-L1150'
  - symbol: selectActivityInteractionError
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1151-L1152'
  - symbol: selectDetectionPositionsInteractionStatus
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1153-L1154'
  - symbol: selectDetectionPositionsInteractionError
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1155-L1156'
  - symbol: selectRealTimePositionsInteractionStatus
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1157-L1158'
  - symbol: selectRealTimePositionsInteractionError
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1159-L1160'
  - symbol: selectApiEventStatus
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1161-L1161'
  - symbol: selectApiEventError
    kind: function
    at: 'apps/platform/features/_map/map/map.slice.ts:L1162-L1162'
---

<!-- context:generated:start -->

## Summary

Manages user interactions with map features (clicks, hovers) and enriches sparse deck-layer picking objects with detailed vessel, event, and activity data via async thunks. Fetches vessel identity, track datasets, and event details from API, with ranking by hours/detections/events. Supports heatmap cell interactions (activity ranking), cluster event interactions (grouped by vessel or port), and position interactions (real-time vessel MMSI lookup). Limits results to MAX_TOOLTIP_LIST (5) per sublayer for UI performance.

## Related

- depends on [[layer-composition-deck-integration]] — Receives picking objects from deck-layer-composer and enriches them with API data
- depends on [[redux-state-slices]] — Reads dataset and vessel state; dispatches enriched interaction state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
