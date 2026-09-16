---
name: Vessel Event Management
slug: vessel-event-management
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-events.hooks.ts
    hash: 599dac2177fde02d465af8b2278825bc4062a2cea912e04f0bd108d571ed5806
sources_digest: fe532b9f3a32ef59d0ef05469c8c7787acc502d01709f182d18f8dc691a0d7f3
links:
  - to: map-layer-integration
    relation: depends_on
    description: >-
      Queries deck-layer-composer layer instances for event data availability
      and fetch completion
  - to: vessel-profile-core
    relation: implements
    description: >-
      Provides event loading state consumed by vessel profile tabs and insight
      components
  - to: vessel-redux-state-management
    relation: uses
    description: >-
      Dispatches setVesselEvents action to persist event data loaded from map
      layers
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Hooks bridging deck-layer-composer map visualization with Redux state management. useSetVesselProfileEvents extracts loaded event data from map layers and dispatches to vessel.slice; useVesselProfileEventsLoading and useVesselProfileEventsError expose fetch status. Depends on external layer instance methods (getEventLayers, getVesselEventsLayersLoaded, getVesselEventsData) rather than storing in Redux directly, creating coupling to deck-layer API stability.

## Related

- depends on [[map-layer-integration]] — Queries deck-layer-composer layer instances for event data availability and fetch completion
- implements [[vessel-profile-core]] — Provides event loading state consumed by vessel profile tabs and insight components
- uses [[vessel-redux-state-management]] — Dispatches setVesselEvents action to persist event data loaded from map layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
