---
name: Map Integration Layer
slug: map-integration-layer
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx
    hash: 7bef2fb0366551d86dbe29a2ffa64c57cd6948b9f3b470dda12ddc339bd71b55
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx
    hash: b5b284adaf7be447f9873a5b9aa89a5418a446c89b6937fadf3ba8e5918e5a40
  - path: apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts
    hash: 4aba157b94e837f9f5238c3e558698a7bb7be7a6c91b25eef311c3da9054d551
  - path: apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx
    hash: ba26a4c5928e0ff3c07b9e06504c5be3cb0d87543bb53dbd0ce4b8756432b7f9
sources_digest: a72af0e294ef8fd4f9c535a8491808aaa784675122945fb2abfcd2b48b2b1c9a
links:
  - to: track-correction-feature
    relation: uses
    description: >-
      TrackCorrectionNew extracts track segments from vesselLayer instance and
      computes center of mass for issue location
  - to: vessel-activity-event-system
    relation: uses
    description: >-
      ActivityByType/Voyage dispatch highlighted events and fit bounds;
      event.bounds.ts computes track geometry intersection
  - to: vessel-areas-visualization
    relation: uses
    description: >-
      VesselAreas fits bounds to region polygons and highlights region-filtered
      events on map
generator:
  version: 1
covers:
  - symbol: TrackCorrectionNew
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:L42-L303
  - symbol: ActivityByType
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx:L36-L220
  - symbol: ActivityByVoyage
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx:L35-L222
  - symbol: useVesselEventBounds
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts:L14-L63
  - symbol: VesselAreasProps
    kind: type
    at: 'apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx:L46-L48'
  - symbol: AreaTick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx:L50-L92'
  - symbol: AreaTooltip
    kind: function
    at: 'apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx:L94-L115'
  - symbol: VesselAreas
    kind: function
    at: 'apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx:L117-L299'
---

<!-- context:generated:start -->

## Summary

Bidirectional communication with map: dispatches highlighted event IDs to map layer for point/segment highlighting, fits map bounds to event track geometry with antimeridian handling, closes sidebar on small screens for map focus. Dependencies: useMapFitBounds, fitEventBounds, useDebouncedDispatchHighlightedEvent.

## Related

- uses [[track-correction-feature]] — TrackCorrectionNew extracts track segments from vesselLayer instance and computes center of mass for issue location
- uses [[vessel-activity-event-system]] — ActivityByType/Voyage dispatch highlighted events and fit bounds; event.bounds.ts computes track geometry intersection
- uses [[vessel-areas-visualization]] — VesselAreas fits bounds to region polygons and highlights region-filtered events on map

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
