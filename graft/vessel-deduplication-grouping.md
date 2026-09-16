---
name: Vessel Deduplication & Grouping
slug: vessel-deduplication-grouping
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx
    hash: 37242623758729636901180532f82ee0df376f1d86f0dc162126d2f10422b111
  - path: apps/platform/features/_vessels/search/search.slice.ts
    hash: 8709c7ea770e9244016bdaad5a7f073cc48dd01ca0cb79c0dbc16a93f379cc87
sources_digest: e61349ec89c12e92492dd0e83cdfe02986170a37ca4010c5697ec4d3dfddeb20
links:
  - to: vessel-groups-ui-layer
    relation: uses
    description: >-
      Modal vessels component groups via getVesselGroupUniqVessels and
      groupVesselGroupVessels, hiding redundant identity fields per row
  - to: vessel-search-system
    relation: implements
    description: >-
      fetchVesselSearchThunk deduplicates results; non-staff compare on
      selfReportedInfo.id to collapse variants into single record
generator:
  version: 1
covers:
  - symbol: VesselGroupVesselRowProps
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx:L37-L43
  - symbol: VesselGroupVesselsComponent
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx:L142-L239
  - symbol: VesselLastIdentity
    kind: type
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L38-L41'
  - symbol: SearchState
    kind: interface
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L43-L55'
  - symbol: SearchSliceState
    kind: type
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L56-L56'
  - symbol: VesselSearchThunk
    kind: type
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L69-L76'
  - symbol: selectSearchResults
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L78-L78'
  - symbol: getVesselSearchEndpoint
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L80-L113'
  - symbol: selectSearchStatus
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L304-L304'
  - symbol: selectSearchStatusCode
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L305-L305'
  - symbol: selectSearchSuggestion
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L306-L306'
  - symbol: selectSearchSuggestionClicked
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L307-L308'
  - symbol: selectSearchPagination
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L309-L309'
  - symbol: selectSearchSelectedVesselsIds
    kind: function
    at: 'apps/platform/features/_vessels/search/search.slice.ts:L310-L311'
---

<!-- context:generated:start -->

## Summary

Vessel datasets may contain duplicate records across sources (SSVID, IMO, callsign variants). A deduplication layer normalizes by grouping on a primary search identifier and hiding redundant properties in non-header rows; search results collapse by selfReportedInfo ID for non-staff users.

## Related

- uses [[vessel-groups-ui-layer]] — Modal vessels component groups via getVesselGroupUniqVessels and groupVesselGroupVessels, hiding redundant identity fields per row
- implements [[vessel-search-system]] — fetchVesselSearchThunk deduplicates results; non-staff compare on selfReportedInfo.id to collapse variants into single record

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
