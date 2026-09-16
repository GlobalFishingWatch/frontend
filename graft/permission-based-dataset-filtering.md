---
name: Permission-Based Dataset Filtering
slug: permission-based-dataset-filtering
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.permissions.ts
    hash: 76a310bad2263011556ef0dc49fa7b420b1047ed7c0391c25e5de5c57e99d773
  - path: apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts
    hash: 4c26ab42c1b6e764c17ef2f854ddc32cc5d9836622aaf8faab4a657a622a4942
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx
    hash: 41b69fbdd3b74f05dd579055bf055964c6e23a547d5550f1d088d4b10ed58433
  - path: apps/platform/features/_vessels/search/search.hook.ts
    hash: 9c45fd0638e3a1721f88554950411d9eb2ced9c1a1a8a0fd28dfa9c9fae8b01c
  - path: apps/platform/features/_vessels/search/search.selectors.ts
    hash: fd4251d03d8e0b9e42a37745bbb797fbf136dff0795bc138726f71314442eb56
sources_digest: c895bc5b4b8b98c7a62708a12cd4d9c0f1c0312a8ac9031cfaf8413a33f21be0
links:
  - to: guest-user-authorization
    relation: part_of
    description: >-
      Guest users see restricted dataset lists via filterDatasetsByUserType;
      advanced search is unavailable to guests
  - to: vessel-search-system
    relation: implements
    description: >-
      selectBasicSearchDatasets and selectAdvancedSearchDatasets apply user-type
      and permission filters; advanced search validates schema support via
      isDatasetSearchFieldNeededSupported
generator:
  version: 1
covers:
  - symbol: hasDatasetConfigVesselData
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L11-L17'
  - symbol: getActivityDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L19-L41'
  - symbol: getVesselDatasetsDownloadTrackSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L43-L57'
  - symbol: getDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L59-L68'
  - symbol: getDatasetsReportNotSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L70-L79'
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
  - symbol: filterDatasetByPermissions
    kind: function
    at: 'apps/platform/features/_vessels/search/search.selectors.ts:L85-L97'
  - symbol: selectSearchDatasetsInWorkspaceByType
    kind: function
    at: 'apps/platform/features/_vessels/search/search.selectors.ts:L99-L111'
---

<!-- context:generated:start -->

## Summary

Dataset permission checks delegate to @globalfishingwatch/datasets-client (checkDatasetReportPermission, checkDatasetDownloadTrackPermission) which evaluate UserPermission arrays against dataset IDs. Permission-focused selectors (getDatasetsReportSupported, getDatasetsReportNotSupported) partition datasets into reportable vs. non-reportable sets. A noted inefficiency is the recomputation of active dataset lists in both functions, suggesting optimization opportunity.

## Related

- part of [[guest-user-authorization]] — Guest users see restricted dataset lists via filterDatasetsByUserType; advanced search is unavailable to guests
- implements [[vessel-search-system]] — selectBasicSearchDatasets and selectAdvancedSearchDatasets apply user-type and permission filters; advanced search validates schema support via isDatasetSearchFieldNeededSupported

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
