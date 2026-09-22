---
name: Vessel Group API Compatibility Filtering
slug: vessel-group-api-compatibility-filtering
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.selectors.ts
    hash: 2dba31ceeeb77270b13479ca9fc6778107625da3934b0039a5be714266cd5c7e
sources_digest: f2e7718d306350489dcd53a39787d3541b2cb63c455f06609c6415846c54b90b
links: []
generator:
  version: 1
covers:
  - symbol: selectDatasetsByType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.selectors.ts:L17-L32'
---

<!-- context:generated:start -->

## Summary

The selectVesselGroupCompatibleDatasets selector filters vessels datasets to only those supporting advanced search fields and matching the vessel-groups API version constraints via VESSEL_GROUPS_CONFIG. selectVesselGroupSearchDatasets further restricts results by cross-referencing the PRIVATE_SEARCH_DATASET_BY_GROUP mapping, ensuring only datasets explicitly linked to the user's private groups are available for group-based searches.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
