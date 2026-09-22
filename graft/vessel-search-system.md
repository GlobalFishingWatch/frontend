---
name: Vessel Search System
slug: vessel-search-system
type: system
sources:
  - path: apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts
    hash: 4c26ab42c1b6e764c17ef2f854ddc32cc5d9836622aaf8faab4a657a622a4942
  - path: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx
    hash: 78577fa456dfe213f2b2cf23d9e73dce569c623e1c306f73477cdec2277162e2
  - path: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx
    hash: ebb3908a47f6719491dca02ddb5584cecc9bff929a20da41f75ba1bc723ca7e5
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx
    hash: c23b1c28dbd266787de63f60f9915bc6dcf94ffaede15d29aaedd6b640e2c34a
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx
    hash: 41b69fbdd3b74f05dd579055bf055964c6e23a547d5550f1d088d4b10ed58433
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx
    hash: 1638654c38365f644d25cb92ae0984e94fbed32fbd8012f3f1aa0e27801e49f2
  - path: apps/platform/features/_vessels/search/basic/SearchBasic.tsx
    hash: bd9cfe9f24d11f254c48599081f763add2daed6b712d71b68e6db285b852987a
  - path: apps/platform/features/_vessels/search/basic/SearchBasicResult.tsx
    hash: 73a1451b14736f27ccda6a4cec5e915441f7a62781e2a6f6b33021f87bbf007f
  - path: apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx
    hash: fff3e1111bcfc2d91a3582ccb400c0526052ff2a1ec922c0aa2a15a8408310dd
  - path: apps/platform/features/_vessels/search/basic/SearchError.tsx
    hash: 75dcfff82aca3ab956d41ef4a402ddba2c0c60e55c2e5c7a32729ca9696756eb
  - path: apps/platform/features/_vessels/search/basic/TrackFootprint.tsx
    hash: 8cd35d2cac209d1829bbc38fdbb1396e0653ee737103894d7467714df4b2c715
  - path: apps/platform/features/_vessels/search/search.config.selectors.ts
    hash: fa8486a2bfd538eba4aea39465fb1addf827da751e82cdce033a57d1cc9e3691
  - path: apps/platform/features/_vessels/search/search.config.ts
    hash: c8fec49165a214d6a53db9e42f2f9cb937ab1ae166feb63cae1752b353d785a3
  - path: apps/platform/features/_vessels/search/search.hook.ts
    hash: 9c45fd0638e3a1721f88554950411d9eb2ced9c1a1a8a0fd28dfa9c9fae8b01c
  - path: apps/platform/features/_vessels/search/search.selectors.ts
    hash: fd4251d03d8e0b9e42a37745bbb797fbf136dff0795bc138726f71314442eb56
  - path: apps/platform/features/_vessels/search/search.slice.ts
    hash: 8709c7ea770e9244016bdaad5a7f073cc48dd01ca0cb79c0dbc16a93f379cc87
  - path: apps/platform/features/_vessels/search/Search.tsx
    hash: 1fcf8b62c782a13078f0cb33b95af430998ace5f4a7b2cb6c7d78af62dc4176b
  - path: apps/platform/features/_vessels/search/search.types.ts
    hash: aea6ab830e7a4fc0352ce9c0d8a8624aba3f6037aec63c90a43d1cc6db93551a
  - path: apps/platform/features/_vessels/search/search.utils.ts
    hash: 6ae46d5ea9028425a5ff1a1d7eefba0058e0c85f1e8263391ed2d930d8563049
  - path: apps/platform/features/_vessels/search/SearchActions.tsx
    hash: 96fb1a85c40eee3562edcd9b706f913f77fed78b47671c04c1091d1864d690d0
  - path: apps/platform/features/_vessels/search/SearchDownload.tsx
    hash: 418edb26653e2b3093315ea3e92ea5567974cabf7dc1441e46a57ae2534fe1da
  - path: apps/platform/features/_vessels/search/SearchFooter.tsx
    hash: 46c0dd9fdb1dfa49dbab56070a99d7064d687d593f6e8c8b6c07a063168c83ce
  - path: apps/platform/features/_vessels/search/SearchPlaceholders.tsx
    hash: fd75e4707f2109a6ad542162103fdef40df963ed6b08c7bc83672dfcebbae732
  - path: apps/platform/features/_vessels/search/SearchTypeChoice.tsx
    hash: 9373d2c394f996d6559364d2df711d8471fc2374417d3c874accd84e2089f58d
sources_digest: 1c3c9a6a3982934e0168b8a85372fed174aedff73d8b93841a27de50011e81fe
links:
  - to: debounced-query-execution
    relation: implements
    description: >-
      useSearch hook debounces input (300-600ms) before calling
      fetchVesselSearchThunk to reduce API pressure; search.slice handles async
      thunk with abort capability and deduplication
  - to: guest-user-authorization
    relation: validates
    description: >-
      isAdvancedSearchAllowed and isBasicSearchAllowed enforce permission
      checks; guest users see restricted messaging; SearchAdvanced redirects
      unauthorized users to LoginLink
  - to: permission-based-dataset-filtering
    relation: implements
    description: >-
      selectBasicSearchDatasets and selectAdvancedSearchDatasets gate available
      datasets by user type and permissions; advanced search also validates
      datasets support required schema fields
  - to: url-driven-search-state
    relation: depends_on
    description: >-
      All search selectors read from router query parameters via
      selectLocationQuery; search.config.selectors maps URL into typed
      VesselSearchState with fallback to DEFAULT_SEARCH_STATE
generator:
  version: 1
covers:
  - symbol: Search
    kind: function
    at: 'apps/platform/features/_vessels/search/Search.tsx:L39-L131'
  - symbol: onSuggestionClick
    kind: function
    at: 'apps/platform/features/_vessels/search/Search.tsx:L72-L77'
  - symbol: SearchActions
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L40-L136'
  - symbol: onSeeVesselsInMapClick
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L52-L99'
  - symbol: onAddToVesselGroup
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchActions.tsx:L101-L112'
  - symbol: SearchDownload
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchDownload.tsx:L13-L88'
  - symbol: onDownloadVesselsClick
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchDownload.tsx:L18-L67'
  - symbol: SearchFooter
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchFooter.tsx:L18-L50'
  - symbol: SearchPlaceholderProps
    kind: type
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L21-L24'
  - symbol: SearchPlaceholder
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L26-L32'
  - symbol: SearchNoResultsState
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L34-L49'
  - symbol: SearchEmptyState
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L52-L102'
  - symbol: SearchNotAllowed
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L104-L111'
  - symbol: SearchTypeChoice
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchTypeChoice.tsx:L21-L72'
  - symbol: onSearchOptionChange
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchTypeChoice.tsx:L42-L61'
  - symbol: AdvancedFilterInputFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx:L12-L16
  - symbol: AdvancedFilterInputField
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedFilterInputField.tsx:L18-L52
  - symbol: AdvancedResultCellWithFilterProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx:L16-L22
  - symbol: AdvancedResultCellWithFilter
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx:L24-L63
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
  - symbol: SearchTable
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L91-L91
  - symbol: VesselDataviewRef
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L92-L92
  - symbol: isVesselInWorkspace
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L94-L102
  - symbol: canSelectVessel
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L104-L114
  - symbol: columnSizeStyle
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L116-L118
  - symbol: SelectAllCheckbox
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L120-L144
  - symbol: SearchAdvancedResultRow
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L146-L181
  - symbol: SearchAdvancedResultsBody
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L183-L230
  - symbol: SearchAdvancedResults
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L232-L760
  - symbol: writeColumnSizeVars
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L638-L646
  - symbol: getSearchDataview
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L32-L52
  - symbol: isDatasetSearchFieldNeededSupported
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts:L60-L69
  - symbol: SearchComponentProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L44-L51'
  - symbol: SearchBasic
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/SearchBasic.tsx:L53-L211'
  - symbol: SearchBasicResultProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/SearchBasicResult.tsx:L54-L61'
  - symbol: SearchBasicResult
    kind: function
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResult.tsx:L63-L353
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResult.tsx:L162-L172
  - symbol: SearchBasicResultListProps
    kind: type
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx:L7-L13
  - symbol: SearchBasicResultList
    kind: function
    at: >-
      apps/platform/features/_vessels/search/basic/SearchBasicResultList.tsx:L15-L39
  - symbol: SearchError
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/SearchError.tsx:L13-L49'
  - symbol: TrackFootprintProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/TrackFootprint.tsx:L20-L25'
  - symbol: TrackFootprint
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/TrackFootprint.tsx:L38-L208'
  - symbol: VesselSearchProperty
    kind: type
    at: 'apps/platform/features/_vessels/search/search.config.selectors.ts:L11-L11'
  - symbol: selectVesselSearchStateProperty
    kind: function
    at: 'apps/platform/features/_vessels/search/search.config.selectors.ts:L12-L18'
  - symbol: SearchType
    kind: type
    at: 'apps/platform/features/_vessels/search/search.config.ts:L12-L12'
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
  - symbol: VesselSearchState
    kind: type
    at: 'apps/platform/features/_vessels/search/search.types.ts:L6-L20'
  - symbol: VesselSearchStateProperty
    kind: type
    at: 'apps/platform/features/_vessels/search/search.types.ts:L21-L21'
  - symbol: getSearchVesselId
    kind: function
    at: 'apps/platform/features/_vessels/search/search.utils.ts:L3-L3'
---

<!-- context:generated:start -->

## Summary

Implements searchable discovery of vessels through both basic (keyword) and advanced (multi-field filter) modes, with paginated results, batch selection, and export capabilities. Manages dataset availability, permission gates, and search state synchronization with URL parameters.

## Related

- implements [[debounced-query-execution]] — useSearch hook debounces input (300-600ms) before calling fetchVesselSearchThunk to reduce API pressure; search.slice handles async thunk with abort capability and deduplication
- validates [[guest-user-authorization]] — isAdvancedSearchAllowed and isBasicSearchAllowed enforce permission checks; guest users see restricted messaging; SearchAdvanced redirects unauthorized users to LoginLink
- implements [[permission-based-dataset-filtering]] — selectBasicSearchDatasets and selectAdvancedSearchDatasets gate available datasets by user type and permissions; advanced search also validates datasets support required schema fields
- depends on [[url-driven-search-state]] — All search selectors read from router query parameters via selectLocationQuery; search.config.selectors maps URL into typed VesselSearchState with fallback to DEFAULT_SEARCH_STATE

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
