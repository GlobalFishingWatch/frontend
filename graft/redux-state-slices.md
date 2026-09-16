---
name: Redux State Slices
slug: redux-state-slices
type: concept
sources:
  - path: apps/platform/features/_map/map/map-layers.sync.hooks.ts
    hash: fb96abfb61eafc0a08d184d623957d209865ef96e8d2291dfe22035562865711
  - path: apps/platform/features/_map/map/map.selectors.ts
    hash: 68e1ba0443eda4e56b6159677b8d97722c45abc8c7c474450e52f318cb9f33a3
  - path: apps/platform/features/_map/map/map.slice.ts
    hash: fd5638d489e8525366dd305553aaeefae142a4d5730ad3e94ed327ab8d2384ec
  - path: apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx
    hash: 60ac15257113d63b1ca390dcd0f1e6102c13e4db8f4b8bfcc5b1eefd42c32960
  - path: apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts
    hash: f076fa01134fafda43e90ef30550d5c15c10211a7abd22530328c7b51e5ae4b6
sources_digest: 1bf4ecb46108b9268306349be3b7df84c826bdb4472c42e531463bf86e057078
links:
  - to: highlight-synchronization
    relation: part_of
    description: Multiple slices provide highlight state consumed by sync layer
  - to: map-interaction-feature-picking
    relation: part_of
    description: map.slice is core to feature picking and interaction enrichment
generator:
  version: 1
covers:
  - symbol: SyncableLayer
    kind: type
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L29-L36'
  - symbol: LayerHighlightHashes
    kind: type
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L39-L39'
  - symbol: getFeaturePropertyId
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L43-L60'
  - symbol: getHoverFeaturesHash
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L62-L68'
  - symbol: getLayerHoverFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L70-L75'
  - symbol: getLayerHighlightedFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L77-L88'
  - symbol: toHighlightTimeMillis
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L90-L98'
  - symbol: useSyncMapHighlights
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L100-L203'
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
  - symbol: DrawFeature
    kind: type
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L39-L39'
  - symbol: MapDraw
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L42-L312'
  - symbol: useRulers
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L17-L130'
  - symbol: useMapRulerInstance
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L132-L143'
---

<!-- context:generated:start -->

## Summary

Aggregates Redux state management across map feature including map interactions (map.slice storing clicked/hovered features with async enrichment thunks), timebar highlight time ranges and events (timebar.slice), report-area selections and dataviews (area-reports.slice), track-correction active IDs and time ranges (track-correction.slice), drawing state and dataset editing (map-draw.hooks integration with datasets.slice), and routes/navigation context (routes.selectors). Each slice maintains domain-specific state mutations and selectors consumed by hooks and components.

## Related

- part of [[highlight-synchronization]] — Multiple slices provide highlight state consumed by sync layer
- part of [[map-interaction-feature-picking]] — map.slice is core to feature picking and interaction enrichment

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
