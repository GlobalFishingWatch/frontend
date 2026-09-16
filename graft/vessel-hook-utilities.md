---
name: Vessel Hook Utilities
slug: vessel-hook-utilities
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.hooks.ts
    hash: d34769cff8562d9ef57d2f4f0df5695a50c717e3bfe4e7f5d3a72870b03c7cd1
sources_digest: 9af1f81e1d752b8947e52529992d307d4e327c26ddee6dfac575a8bf3769d407
links:
  - to: map-layer-integration
    relation: implements
    description: >-
      Provides layer retrieval and visibility management abstractions for map
      integration
  - to: vessel-resource-selectors
    relation: uses
    description: Queries Redux selectors for vessel info and dataview state
generator:
  version: 1
covers:
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

Internal hooks abstracting vessel layer and data access patterns. useVesselProfileLayer and useVesselProfileEncounterLayer retrieve deck layers for current and encountered vessels. useUpdateVesselEventsVisibility auto-hides non-relevant event types on load (loitering for fishing vessels, fishing for others). useGetVesselInfoByDataviewId aggregates vessel info, layer, and dataview metadata. All depend on dataviews-client resolution and Redux selectors for state lookup.

## Related

- implements [[map-layer-integration]] — Provides layer retrieval and visibility management abstractions for map integration
- uses [[vessel-resource-selectors]] — Queries Redux selectors for vessel info and dataview state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
