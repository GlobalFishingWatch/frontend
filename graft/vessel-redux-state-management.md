---
name: Vessel Redux State Management
slug: vessel-redux-state-management
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.slice.ts
    hash: 9cae9abefa9334672e903254e6cceab3c1d15ada357b37e2759451a33ae6881e
sources_digest: 6c4c2077f3e34fc91dd3cd2a803fd09aef4c0eac8aa72b515f5a2af61e2b72a4
links:
  - to: dataset-management-integration
    relation: depends_on
    description: >-
      Uses fetchDatasetByIdThunk and getRelatedDatasetsByType to populate track
      and event datasets associated with a vessel
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Calls getVesselIdentities and getVesselProperty utilities to merge
      self-reported and registry identities into a unified vessel object
  - to: vessel-resource-selectors
    relation: produces
    description: >-
      Exposes selectors and thunks consumed by vessel profile UI components and
      resource resolution hooks
generator:
  version: 1
covers:
  - symbol: VesselDataIdentity
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L46-L56'
  - symbol: IdentityVesselData
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L58-L72'
  - symbol: VesselInfoEntry
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L74-L80'
  - symbol: VesselInfoState
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L82-L82'
  - symbol: VesselState
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L84-L91'
  - symbol: VesselSliceState
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L102-L102'
  - symbol: FetchVesselThunkParams
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L104-L109'
  - symbol: selectVesselSlice
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L329-L329'
  - symbol: selectVesselEventId
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L330-L330'
  - symbol: selectVesselEventType
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L331-L331'
  - symbol: selectVesselVoyage
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.slice.ts:L332-L332'
---

<!-- context:generated:start -->

## Summary

Redux slice managing vessel profile data including merged identities from self-reported and registry sources, associated datasets, events, and UI state. Exports fetchVesselInfoThunk which orchestrates API calls, dataset resolution, and resource caching via dataviews-client. Tracks dual status (initial load vs refresh) to prevent concurrent requests and injects cache-control headers for guest users.

## Related

- depends on [[dataset-management-integration]] — Uses fetchDatasetByIdThunk and getRelatedDatasetsByType to populate track and event datasets associated with a vessel
- uses [[vessel-identity-resolution]] — Calls getVesselIdentities and getVesselProperty utilities to merge self-reported and registry identities into a unified vessel object
- produces [[vessel-resource-selectors]] — Exposes selectors and thunks consumed by vessel profile UI components and resource resolution hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
