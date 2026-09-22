# apps/port-labeler/src/routes/routes.actions.ts · [[url-routing-query-parameter-synchronization]]

Redux action creators and thunks that manage route state updates for viewport, timerange, and query parameters in the port labeler application.

- UpdateQueryParamsAction · interface · L14-L25 — Interface defining the shape of a Redux action for updating query parameters with optional route type, payload, and metadata.
- UpdateLocationOptions · type · L27-L27 — Type alias defining optional parameters for location updates: query, payload, and replace flag.
- updateQueryParams · function · L29-L31 — Action creator that returns a HOME route action with the given query parameters.
- updateLocation · function · L32-L37 — Action creator that constructs a location update action with specified route type, query, payload, and replace option.
- cleanQueryLocation · function · L39-L48 — Thunk action that dispatches a location update clearing query parameters while preserving payload and location type.
- updateUrlViewport · function · L51-L58 — Thunk action that dispatches a location update merging viewport coordinates into the query string.
- updateUrlTimerange · function · L60-L68 — Thunk action that dispatches a location update merging timerange parameters into the existing query string.
