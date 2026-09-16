---
name: Vessel Areas Visualization
slug: vessel-areas-visualization
type: file
sources:
  - path: apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx
    hash: ba26a4c5928e0ff3c07b9e06504c5be3cb0d87543bb53dbd0ce4b8756432b7f9
sources_digest: 849986994f778d824d062fe57b837a624590af3acb5f38851efca6843625d219
links:
  - to: map-integration-layer
    relation: uses
    description: >-
      Fits bounds to region polygons and dispatches highlighted events via
      useDebouncedDispatchHighlightedEvent
  - to: vessel-activity-event-system
    relation: uses
    description: >-
      Depends on selectEventsGroupedByArea, selectVesselEventTypes, and event
      filtering selectors
generator:
  version: 1
covers:
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

Stacked bar chart displaying vessel fishing events by geographic region (EEZ, FAO, RFMO, MPA) with region-filtering and map synchronization. Separates known from unknown regions and conditionally shows data-quality warnings.

## Related

- uses [[map-integration-layer]] — Fits bounds to region polygons and dispatches highlighted events via useDebouncedDispatchHighlightedEvent
- uses [[vessel-activity-event-system]] — Depends on selectEventsGroupedByArea, selectVesselEventTypes, and event filtering selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
