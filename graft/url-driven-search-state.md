---
name: URL-Driven Search State
slug: url-driven-search-state
type: concept
sources:
  - path: apps/platform/features/_vessels/search/search.config.selectors.ts
    hash: fa8486a2bfd538eba4aea39465fb1addf827da751e82cdce033a57d1cc9e3691
  - path: apps/platform/features/_vessels/search/search.hook.ts
    hash: 9c45fd0638e3a1721f88554950411d9eb2ced9c1a1a8a0fd28dfa9c9fae8b01c
  - path: apps/platform/features/_vessels/search/search.types.ts
    hash: aea6ab830e7a4fc0352ce9c0d8a8624aba3f6037aec63c90a43d1cc6db93551a
sources_digest: 341aa1b3c709917ad06f6adc0d242c20454387ffbf61ff08b8805953e908938a
links:
  - to: vessel-search-system
    relation: implements
    description: >-
      search.config.selectors reads from router's selectLocationQuery and
      deserializes into typed VesselSearchState; hooks use useReplaceQueryParams
      to sync Redux back to URL
generator:
  version: 1
covers:
  - symbol: VesselSearchProperty
    kind: type
    at: 'apps/platform/features/_vessels/search/search.config.selectors.ts:L11-L11'
  - symbol: selectVesselSearchStateProperty
    kind: function
    at: 'apps/platform/features/_vessels/search/search.config.selectors.ts:L12-L18'
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
  - symbol: VesselSearchState
    kind: type
    at: 'apps/platform/features/_vessels/search/search.types.ts:L6-L20'
  - symbol: VesselSearchStateProperty
    kind: type
    at: 'apps/platform/features/_vessels/search/search.types.ts:L21-L21'
---

<!-- context:generated:start -->

## Summary

Architectural pattern where vessel search parameters live in URL query strings, synchronized bidirectionally with Redux state via custom selectors and hooks. Enables bookmarkable searches and browser back/forward navigation.

## Related

- implements [[vessel-search-system]] — search.config.selectors reads from router's selectLocationQuery and deserializes into typed VesselSearchState; hooks use useReplaceQueryParams to sync Redux back to URL

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
