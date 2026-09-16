# apps/port-labeler/src/utils/async-slice.ts · [[async-redux-slice-factory]]

Utility module that exports Redux Toolkit factories for managing async entity state with status tracking and error handling across fetch, create, update, and delete operations.

- AsyncReducerStatus · enum · L9-L19 — Enumerates all possible states an async reducer can occupy, from idle through loading variants to completion or error states.
- AsyncError · type · L21-L25 — Defines the structure for async operation errors, capturing HTTP status codes, messages, and custom metadata.
- AsyncReducerId · type · L27-L27 — Type alias for entity identifiers used throughout async reducer state management.
- AsyncReducer · type · L28-L35 — Defines the complete state shape for an async reducer, including entities, request tracking, status, and error information.
- getRequestIdsOnStart · function · L46-L49 — Appends the current request ID to the tracking list when an async action begins.
- getRequestIdsOnFinish · function · L50-L52 — Removes the completed request ID from the tracking list when an async action finishes.
- createAsyncSlice · function · L54-L208 — Factory function that creates a Redux slice with pre-configured reducer handlers for standardized async CRUD operations and status tracking.
