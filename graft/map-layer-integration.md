---
name: Map Layer Integration
slug: map-layer-integration
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts
    hash: 4e7d64d932db428d60d94ea796356fca59cea28892e0706221d06ac8779ad5a1
  - path: apps/platform/features/_vessels/vessel/vessel-events.hooks.ts
    hash: 599dac2177fde02d465af8b2278825bc4062a2cea912e04f0bd108d571ed5806
  - path: apps/platform/features/_vessels/vessel/vessel.hooks.ts
    hash: d34769cff8562d9ef57d2f4f0df5695a50c717e3bfe4e7f5d3a72870b03c7cd1
sources_digest: 55543112eb184a3e5942956289ea96ab1ce8f29762c4f059c8853581c3b8e557
links:
  - to: vessel-bounds-and-time-synchronization
    relation: implements
    description: >-
      vessel-bounds hooks coordinate map bounds fitting with layer data
      availability
  - to: vessel-event-management
    relation: implements
    description: >-
      vessel-events hooks extract loaded event data from map layers and sync to
      Redux
generator:
  version: 1
covers:
  - symbol: useGetVesselProfileBbox
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L23-L33'
  - symbol: useVesselProfileBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L35-L90'
  - symbol: useVesselFitBoundsOnLoad
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L92-L106'
  - symbol: useVesselFitTranmissionsBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L108-L153'
  - symbol: useVesselFitBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L155-L161'
  - symbol: useVesselProfileLayer
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-events.hooks.ts:L13-L16'
  - symbol: useVesselProfileEvents
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-events.hooks.ts:L18-L28'
  - symbol: useVesselProfileEventsLoading
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-events.hooks.ts:L30-L33'
  - symbol: useVesselProfileEventsError
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-events.hooks.ts:L35-L38'
  - symbol: useSetVesselProfileEvents
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-events.hooks.ts:L40-L49'
  - symbol: useVesselProfileLayer
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.hooks.ts:L32-L36'
  - symbol: useVesselProfileEncounterLayer
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.hooks.ts:L38-L52'
  - symbol: useUpdateVesselEventsVisibility
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.hooks.ts:L54-L74'
  - symbol: useGetVesselInfoByDataviewId
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.hooks.ts:L76-L96'
---

<!-- context:generated:start -->

## Summary

Vessel profile couples with map visualization through deck-layer-composer for rendering vessel tracks, events, and area layers. Components rely on external layer instance methods (getEventLayers, getVesselEventsLayersLoaded, getVesselEventsData) to query state rather than maintaining this in Redux, creating tight coupling that requires careful synchronization. Visibility toggling adjusts which event types display (e.g., hiding loitering for non-fishing vessels). Layer load events trigger bounds fitting and data synchronization.

## Related

- implements [[vessel-bounds-and-time-synchronization]] — vessel-bounds hooks coordinate map bounds fitting with layer data availability
- implements [[vessel-event-management]] — vessel-events hooks extract loaded event data from map layers and sync to Redux

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
