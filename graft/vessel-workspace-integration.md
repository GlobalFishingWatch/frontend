---
name: Vessel Workspace Integration
slug: vessel-workspace-integration
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-pin.hooks.ts
    hash: 661a15e1a0314bafc68e656de71f4ebb6e9a16a461ae5f777ea993db84c46643
sources_digest: 529b91ced4fc09b06990f65fd29a257c76312e1e6d23befb1d732621e70c5480
links:
  - to: dataset-management-integration
    relation: uses
    description: >-
      Uses fetchDatasetByIdThunk and dataview selectors to resolve and populate
      vessel datasets
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Queries API to fetch missing vessel identity information before
      constructing dataviews
  - to: vessel-navigation-links
    relation: implements
    description: Provides the pin/unpin logic used by VesselLink and VesselPin components
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
---

<!-- context:generated:start -->

## Summary

Hooks managing vessel pin/unpin lifecycle and dataview instance construction. usePinVessel accepts partial vessel specs and orchestrates fetching missing identity and dataset info before constructing unified dataview with track, info, real-time, and events datasets. Implements fallback resolution chain: search API if identity missing, fetch via Redux thunk if info dataset missing, resolve via dataset endpoint if vessel data absent. Integrates with workspace hooks for dataview instance lifecycle.

## Related

- uses [[dataset-management-integration]] — Uses fetchDatasetByIdThunk and dataview selectors to resolve and populate vessel datasets
- uses [[vessel-identity-resolution]] — Queries API to fetch missing vessel identity information before constructing dataviews
- implements [[vessel-navigation-links]] — Provides the pin/unpin logic used by VesselLink and VesselPin components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
