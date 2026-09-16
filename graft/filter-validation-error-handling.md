---
name: Filter Validation & Error Handling
slug: filter-validation-error-handling
type: concept
sources:
  - path: apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts
    hash: 4c26ab42c1b6e764c17ef2f854ddc32cc5d9836622aaf8faab4a657a622a4942
  - path: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx
    hash: 78577fa456dfe213f2b2cf23d9e73dce569c623e1c306f73477cdec2277162e2
  - path: apps/platform/features/_vessels/search/search.hook.ts
    hash: 9c45fd0638e3a1721f88554950411d9eb2ced9c1a1a8a0fd28dfa9c9fae8b01c
sources_digest: 502398e06df2ae5c7af3be6b60c7e5d86414d8e14251669da0dc9a9bfed42d94
links:
  - to: multi-filter-advanced-search
    relation: validates
    description: >-
      isDatasetSearchFieldNeededSupported checks dataset schema;
      AdvancedFilterInputField displays validation errors via
      useSearchFiltersErrors; incompatible combinations detected in
      SearchAdvancedFilters
generator:
  version: 1
covers:
  - symbol: AdvancedFilterInputFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx:L12-L16
  - symbol: AdvancedFilterInputField
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx:L18-L52
  - symbol: getSearchDataview
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L32-L52
  - symbol: isDatasetSearchFieldNeededSupported
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L60-L69
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

Advanced search filters are validated for schema support (each dataset must expose minimum required fields: MMSI, IMO, callsign, shipname). Incompatible filter combinations are detected and invalid selections auto-cleared. Validation errors shown in field tooltips.

## Related

- validates [[multi-filter-advanced-search]] — isDatasetSearchFieldNeededSupported checks dataset schema; AdvancedFilterInputField displays validation errors via useSearchFiltersErrors; incompatible combinations detected in SearchAdvancedFilters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
