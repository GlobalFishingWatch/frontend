---
name: Cross-Dataset Vessel Identity
slug: cross-dataset-vessel-identity
type: concept
sources:
  - path: apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx
    hash: fff3e1111bcfc2d91a3582ccb400c0526052ff2a1ec922c0aa2a15a8408310dd
  - path: apps/platform/features/_vessels/search/search.utils.ts
    hash: 6ae46d5ea9028425a5ff1a1d7eefba0058e0c85f1e8263391ed2d930d8563049
sources_digest: dd4089b09f8f52de0f449576b4b9e479363e530862465f58ecf21be8b4adb5f1
links:
  - to: vessel-search-system
    relation: implements
    description: >-
      getSearchVesselId constructs compound ID from vessel.datasetId and
      vessel.id; used as React key in SearchBasicResultList and for selection
      tracking
generator:
  version: 1
covers:
  - symbol: SearchBasicResultListProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx:L7-L13
  - symbol: SearchBasicResultList
    kind: function
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx:L15-L39
  - symbol: getSearchVesselId
    kind: function
    at: 'apps/platform/features/_vessels/search/search.utils.ts:L3-L3'
---

<!-- context:generated:start -->

## Summary

Vessels are uniquely identified by a compound key: dataset ID + vessel ID (hyphen-separated, via getSearchVesselId). Enables same vessel tracked across multiple data sources to be distinguished and selected independently in the UI.

## Related

- implements [[vessel-search-system]] — getSearchVesselId constructs compound ID from vessel.datasetId and vessel.id; used as React key in SearchBasicResultList and for selection tracking

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
