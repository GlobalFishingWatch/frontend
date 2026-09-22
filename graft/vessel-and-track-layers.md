---
name: Vessel and Track Layers
slug: vessel-and-track-layers
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/vessels.ts
    hash: ec5ac48a92ff51388ce4aaa9c8380d939f917c4e735eb7676b7782c5f81b32ed
sources_digest: b5713c7d54650e34ec3558d38c7922e265b9e0ddb2306b0f7881f73b59755b2b
links:
  - to: api-gateway-integration
    relation: depends_on
    description: Fetches track URLs and event endpoints from @globalfishingwatch/api-client
  - to: dataset-client
    relation: uses
    description: >-
      Uses getDatasetConfigByDatasetType and resolveDataviewDatasetResource for
      dataset location
generator:
  version: 1
covers:
  - symbol: resolveDeckVesselLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vessels.ts:L14-L98'
---

<!-- context:generated:start -->

## Summary

Visualizes vessel positions, movement tracks, and events by fetching track geometries and event data from the API, supporting realtime vs. historical modes with configurable time bounds and filtering thresholds.

## Related

- depends on [[api-gateway-integration]] — Fetches track URLs and event endpoints from @globalfishingwatch/api-client
- uses [[dataset-client]] — Uses getDatasetConfigByDatasetType and resolveDataviewDatasetResource for dataset location

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
