# apps/track-labeler/src/store.ts · [[track-labeler-store-and-middleware]]

Configures and exports the Redux store with reducers, middleware, and type definitions for the track-labeler application.

- RootState · type · L58-L58 — Type alias representing the complete state tree of the Redux store.
- AppThunk · type · L59-L64 — Generic thunk action type for async operations dispatched in the application.
- TypedDispatch · type · L65-L65 — Generic typed dispatch function that supports thunk actions with a given state type.
- AppDispatch · type · L66-L66 — Typed dispatch function for the application that includes thunk action support.
