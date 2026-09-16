---
name: Vessel Bounds and Time Synchronization
slug: vessel-bounds-and-time-synchronization
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts
    hash: 4e7d64d932db428d60d94ea796356fca59cea28892e0706221d06ac8779ad5a1
sources_digest: 9676301a7b94aa4e3752bfd76b757ed9055e0d3a3d48465b31ef32381b740c45
links:
  - to: map-layer-integration
    relation: depends_on
    description: >-
      Depends on map bounds layer and track layer reload events to coordinate
      viewport and data fetches
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Checks transmission dates via getVesselTransmissionDates to validate
      whether current timerange overlaps vessel activity
  - to: vessel-profile-core
    relation: implements
    description: >-
      Provides automatic bounds fitting and timerange validation when vessel
      profiles load
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
---

<!-- context:generated:start -->

## Summary

Hooks orchestrating automatic map viewport and timerange adjustments when navigating to vessel profiles. Handles two scenarios: fitting bounds on external link load (via useVesselFitBoundsOnLoad with optional timerange confirmation), and fresh workspace navigation (via useVesselFitTranmissionsBounds with deferred state updates). Uses refs and requestAnimationFrame to choreograph async updates across Redux, URL params, and map layer rendering without race conditions.

## Related

- depends on [[map-layer-integration]] — Depends on map bounds layer and track layer reload events to coordinate viewport and data fetches
- uses [[vessel-identity-resolution]] — Checks transmission dates via getVesselTransmissionDates to validate whether current timerange overlaps vessel activity
- implements [[vessel-profile-core]] — Provides automatic bounds fitting and timerange validation when vessel profiles load

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
