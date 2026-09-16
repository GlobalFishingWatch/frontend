# apps/platform/utils/async-slice.ts · [[async-redux-slice-factory]]

- AsyncReducerStatus · enum · L11-L21 — Enumeration of lifecycle states for async operations including idle, loading variants, finished, error, and aborted statuses.
- AsyncError · type · L23-L25 — Type extending ResponseError with optional metadata to carry additional context in error payloads.
- AsyncReducerId · type · L27-L27 — Type alias for entity identifiers used in async reducer state.
- AsyncReducer · type · L28-L35 — State shape for async reducer containing entities, request tracking, status, and error information.
- getRequestIdsOnStart · function · L46-L49 — Appends incoming request ID to the tracking list when an async operation begins.
- getRequestIdsOnFinish · function · L51-L53 — Removes completed request ID from the tracking list when an async operation settles.
- createAsyncSlice · function · L55-L209 — Factory function that creates a Redux slice with built-in async operation handlers for fetch, create, update, and delete thunks.
