---
name: Dataset Management Integration
slug: dataset-management-integration
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts
    hash: 661a15e1a0314bafc68e656de71f4ebb6e9a16a461ae5f777ea993db84c46643
  - path: apps/platform/features/_vessels/vessel/vessel.slice.ts
    hash: 9cae9abefa9334672e903254e6cceab3c1d15ada357b37e2759451a33ae6881e
sources_digest: d60e3b2b4027eed80b8744830088b50c5ac3ab95ccf6705b19120fe8e6ebf91a
links:
  - to: vessel-redux-state-management
    relation: implements
    description: fetchVesselInfoThunk orchestrates related dataset fetching and caching
  - to: vessel-workspace-integration
    relation: implements
    description: >-
      usePinVessel resolves datasets before constructing workspace dataview
      instances
generator:
  version: 1
covers:
  - symbol: VesselToResolve
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L41-L46'
  - symbol: VesselToSearch
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L47-L47'
  - symbol: VesselPinClickProps
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L48-L51'
  - symbol: VesselPinOnClickCb
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L53-L53'
  - symbol: UsePinVesselParams
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L55-L63'
  - symbol: UsePinVesselResult
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L65-L69'
  - symbol: usePinVessel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L71-L211'
  - symbol: onPinClick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts:L101-L208'
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

Vessel profiles depend on related dataset resolution to populate tracks, real-time data, and events. fetchVesselInfoThunk uses getRelatedDatasetsByType to identify associated datasets from API responses. Caches resolved resources via dataviews-client to avoid refetches when navigating from workspace URLs. Guest users receive CACHE_FALSE_PARAM to bypass browser caches and fetch fresh data. Differentiates between template dataviews (profiles, private datasets) and instance dataviews (workspace-specific configurations).

## Related

- implements [[vessel-redux-state-management]] — fetchVesselInfoThunk orchestrates related dataset fetching and caching
- implements [[vessel-workspace-integration]] — usePinVessel resolves datasets before constructing workspace dataview instances

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
