# apps/platform/features/_vessels/search/search.slice.ts · [[search-result-pagination]] [[vessel-deduplication-grouping]] [[vessel-search-system]]

Redux slice managing vessel search state, including query results, pagination, selection, and async thunk for fetching vessels from the API.

- VesselLastIdentity · type · L38-L41 — Type representing the last known identity of a vessel with optional dataset, vessel identities, and registry extra fields.
- SearchState · interface · L43-L55 — Interface defining the shape of the Redux search slice state including selected vessels, async status, search data, suggestions, and pagination.
- SearchSliceState · type · L56-L56 — Root state type containing the search slice nested under the 'search' key.
- VesselSearchThunk · type · L69-L76 — Type defining parameters for the vessel search async thunk including query, filters, datasets, and pagination token.
- selectSearchResults · function · L78-L78 — Selector returning the current vessel search results data array from state.
- getVesselSearchEndpoint · function · L80-L113 — Constructs the vessel search API endpoint URL with datasets, query mode, and pagination parameters.
- selectSearchStatus · function · L304-L304 — Selector returning the async loading status of the current search operation.
- selectSearchStatusCode · function · L305-L305 — Selector returning the HTTP status code from the most recent search API error, if any.
- selectSearchSuggestion · function · L306-L306 — Selector returning any search suggestion text (e.g., "did you mean") from the search results.
- selectSearchSuggestionClicked · function · L307-L308 — Selector returning whether the user has clicked on a search suggestion.
- selectSearchPagination · function · L309-L309 — Selector returning pagination state including total results count, cursor token, and loading flag.
- selectSearchSelectedVesselsIds · function · L310-L311 — Selector returning the array of selected vessel IDs from the search results.
