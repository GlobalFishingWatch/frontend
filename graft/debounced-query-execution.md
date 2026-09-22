---
name: Debounced Query Execution
slug: debounced-query-execution
type: concept
sources:
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx
    hash: 41b69fbdd3b74f05dd579055bf055964c6e23a547d5550f1d088d4b10ed58433
  - path: apps/platform/features/_vessels/search/basic/SearchBasic.tsx
    hash: bd9cfe9f24d11f254c48599081f763add2daed6b712d71b68e6db285b852987a
  - path: apps/platform/features/_vessels/search/search.hook.ts
    hash: 9c45fd0638e3a1721f88554950411d9eb2ced9c1a1a8a0fd28dfa9c9fae8b01c
sources_digest: 5d896a15cfb376acabd18ddc14bf8addec8df1e145c91efc8f4d22b0743db462
links:
  - to: vessel-search-system
    relation: implements
    description: >-
      useSearch debounces via useDebounce (600ms) plus 300ms async delay;
      useFetchSearchResults deduplicates on lastParamsKeyRef before calling
      fetchVesselSearchThunk
generator:
  version: 1
covers:
  - symbol: ImcompatibleFilter
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx:L52-L52
  - symbol: IncompatibleFilterSelection
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx:L53-L56
  - symbol: getIncompatibleFiltersBySelection
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx:L64-L68
  - symbol: isIncompatibleFilterBySelection
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx:L70-L83
  - symbol: SearchAdvancedFilters
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx:L85-L347
  - symbol: SearchComponentProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L44-L51'
  - symbol: SearchBasic
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L53-L211'
  - symbol: useSearchConnect
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L39-L47'
  - symbol: hasFiltersActive
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L56-L66'
  - symbol: useSearchFiltersConnect
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L68-L90'
  - symbol: useSearchFiltersErrors
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L92-L132'
  - symbol: FetchSearchResultsParams
    kind: type
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L134-L142'
  - symbol: getSearchParamsKey
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L144-L152'
  - symbol: useFetchSearchResults
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L154-L241'
  - symbol: useSearch
    kind: function
    at: 'apps/platform/features/_vessels/search/search.hook.ts:L243-L337'
---

<!-- context:generated:start -->

## Summary

Multi-stage debouncing strategy (200-600ms input delays, additional 300ms async buffer) reduces redundant API calls during rapid user input in search fields. Implements request deduplication via parameter hashing to prevent duplicate fetches.

## Related

- implements [[vessel-search-system]] — useSearch debounces via useDebounce (600ms) plus 300ms async delay; useFetchSearchResults deduplicates on lastParamsKeyRef before calling fetchVesselSearchThunk

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
