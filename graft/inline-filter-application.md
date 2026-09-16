---
name: Inline Filter Application
slug: inline-filter-application
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx
    hash: ebb3908a47f6719491dca02ddb5584cecc9bff929a20da41f75ba1bc723ca7e5
sources_digest: 3a3ef4145586cda9cb9333eec20f12206a594ec074c1c399f721dbe43344d89a
links:
  - to: vessel-search-system
    relation: uses
    description: >-
      AdvancedResultCellWithFilter wraps cells in SearchAdvancedResults; reads
      VesselSearchState via useSearchFiltersConnect and conditionally renders
      filter icon button
generator:
  version: 1
covers:
  - symbol: AdvancedResultCellWithFilterProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx:L16-L22
  - symbol: AdvancedResultCellWithFilter
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx:L24-L63
---

<!-- context:generated:start -->

## Summary

Search result cells are wrapped with filter buttons that allow users to narrow the current search without navigating away. Multi-select filters (flag, shiptypes, geartypes, owner) handle string splitting/array conversion; button hides if value already in active filters.

## Related

- uses [[vessel-search-system]] — AdvancedResultCellWithFilter wraps cells in SearchAdvancedResults; reads VesselSearchState via useSearchFiltersConnect and conditionally renders filter icon button

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
