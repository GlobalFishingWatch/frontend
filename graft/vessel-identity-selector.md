---
name: Vessel Identity Selector
slug: vessel-identity-selector
type: file
sources:
  - path: apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx
    hash: f5be315377ccd49fed64505f7e41759d42bdac5e2cb861b9dc37b9df817b70da
sources_digest: e82b1db394e65bd9120f0da9378e4836d67159054e63e7c3c5e2c3a30d51222b
links:
  - to: redux-state-selectors
    relation: depends_on
    description: >-
      Retrieves vessel identities and current selection via
      selectVesselInfoData, selectVesselIdentitySource, selectVesselIdentityId
  - to: time-range-filtering-pattern
    relation: implements
    description: >-
      Conditionally displays warning when selected identity transmission dates
      are outside the active map time range
generator:
  version: 1
covers:
  - symbol: VesselIdentitySelector
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx:L27-L97
  - symbol: setIdentityId
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx:L42-L56
---

<!-- context:generated:start -->

## Summary

Interactive dropdown component that allows users to switch between multiple vessel identity records (self-reported vs. registry) with transmission date ranges. Warns when the selected identity falls outside the current map time range, integrating with router query parameters and analytics tracking.

## Related

- depends on [[redux-state-selectors]] — Retrieves vessel identities and current selection via selectVesselInfoData, selectVesselIdentitySource, selectVesselIdentityId
- implements [[time-range-filtering-pattern]] — Conditionally displays warning when selected identity transmission dates are outside the active map time range

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
