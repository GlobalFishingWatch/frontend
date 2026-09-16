---
name: Multi-Filter Advanced Search
slug: multi-filter-advanced-search
type: concept
sources:
  - path: apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts
    hash: 4c26ab42c1b6e764c17ef2f854ddc32cc5d9836622aaf8faab4a657a622a4942
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx
    hash: c23b1c28dbd266787de63f60f9915bc6dcf94ffaede15d29aaedd6b640e2c34a
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx
    hash: 41b69fbdd3b74f05dd579055bf055964c6e23a547d5550f1d088d4b10ed58433
sources_digest: 924afaf5789faeecce489150c78e772d426c39f52f9b9f154352f23efb3f4d85
links:
  - to: permission-based-dataset-filtering
    relation: depends_on
    description: >-
      Available schema filters computed dynamically via getDataviewFilterConfig
      per active dataview; datasets filtered by selectAdvancedSearchDatasets
  - to: vessel-search-system
    relation: implements
    description: >-
      SearchAdvancedFilters orchestrates multiple filter types (text inputs,
      multi-selects, date ranges); incompatible filter combinations are detected
      and invalid selections cleared via getIncompatibleFilters
generator:
  version: 1
covers:
  - symbol: SearchAdvanced
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L42-L192
  - symbol: handleSearchQueryChange
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L96-L100
  - symbol: handleSearchIdChange
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L102-L104
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
  - symbol: getSearchDataview
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L32-L52
  - symbol: isDatasetSearchFieldNeededSupported
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L60-L69
---

<!-- context:generated:start -->

## Summary

Advanced search mode extends basic keyword search with structured faceted filters: identity source selection, dataset-specific schema filters (gear types, ship types, flags), transmission date ranges, and vessel ID fields. Filters are validated for compatibility (e.g., ship types incompatible with Registry identity source).

## Related

- depends on [[permission-based-dataset-filtering]] — Available schema filters computed dynamically via getDataviewFilterConfig per active dataview; datasets filtered by selectAdvancedSearchDatasets
- implements [[vessel-search-system]] — SearchAdvancedFilters orchestrates multiple filter types (text inputs, multi-selects, date ranges); incompatible filter combinations are detected and invalid selections cleared via getIncompatibleFilters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
