---
name: Search Result Pagination
slug: search-result-pagination
type: concept
sources:
  - path: apps/platform/features/_vessels/search/basic/SearchBasic.tsx
    hash: bd9cfe9f24d11f254c48599081f763add2daed6b712d71b68e6db285b852987a
  - path: apps/platform/features/_vessels/search/search.slice.ts
    hash: 8709c7ea770e9244016bdaad5a7f073cc48dd01ca0cb79c0dbc16a93f379cc87
  - path: apps/platform/features/_vessels/search/SearchFooter.tsx
    hash: 46c0dd9fdb1dfa49dbab56070a99d7064d687d593f6e8c8b6c07a063168c83ce
sources_digest: cd8aad0086ee116aa423e1c8cbb06a2fb28d8b8e3fb9fa4c5bb004c1c781ced2
links:
  - to: vessel-search-system
    relation: implements
    description: >-
      SearchBasicResultList triggers fetchMoreResults via intersection observer;
      fetchVesselSearchThunk concatenates results when 'since' token present;
      SearchFooter detects hasMoreResults via non-null since
generator:
  version: 1
covers:
  - symbol: SearchFooter
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchFooter.tsx:L18-L50'
  - symbol: SearchComponentProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L44-L51'
  - symbol: SearchBasic
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L53-L211'
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

Results are returned in pages (RESULTS_PER_PAGE = 20) with a 'since' token for continuation. Intersection observer detects user scroll near bottom and triggers fetchMoreResults. SearchFooter displays current vs. total count, accounting for incomplete pagination.

## Related

- implements [[vessel-search-system]] — SearchBasicResultList triggers fetchMoreResults via intersection observer; fetchVesselSearchThunk concatenates results when 'since' token present; SearchFooter detects hasMoreResults via non-null since

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
