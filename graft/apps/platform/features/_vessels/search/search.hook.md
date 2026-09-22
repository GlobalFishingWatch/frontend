# apps/platform/features/_vessels/search/search.hook.ts · [[debounced-query-execution]] [[filter-validation-error-handling]] [[permission-based-dataset-filtering]] [[url-driven-search-state]] [[vessel-search-system]]

React hooks module that manages vessel search state, filtering, result fetching, and analytics tracking across basic and advanced search modes.

- useSearchConnect · function · L39-L47 — Custom hook that connects and memoizes search pagination, suggestion, and suggestion-clicked state from Redux.
- hasFiltersActive · function · L56-L66 — Determines whether any non-ignorable search filters have active values set by checking entries against a predefined ignore list.
- useSearchFiltersConnect · function · L68-L90 — Custom hook that provides search filters state and a callback to update filters while clearing previous results.
- useSearchFiltersErrors · function · L92-L132 — Validates search filters against available datasets to detect disabled fields with active values and invalid date ranges.
- FetchSearchResultsParams · type · L134-L142 — Type definition specifying the parameters required to initiate a vessel search request including query, filters, datasets, and optional pagination/force flags.
- getSearchParamsKey · function · L144-L152 — Generates a unique cache key from search parameters to detect when search inputs have changed and avoid redundant API calls.
- useFetchSearchResults · function · L154-L241 — Custom hook managing vessel search API calls with caching, pagination support, abort handling, and analytics tracking of results.
- useSearch · function · L243-L337 — Main orchestrating hook that combines query debouncing, filter validation, and automatic search triggering for both basic and advanced search modes.
