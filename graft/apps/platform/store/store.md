# apps/platform/store/store.ts · [[redux-store-configuration]] [[session-expiration-handling]]

Configures and exports the Redux store with middleware for managing application state, including API queries, user logout, and serialization safeguards for large state slices.

- makeStore · function · L38-L73 — Factory function that creates a Redux store with configured middleware, dev tools serialization, and support for preloaded state and custom middleware injection.
- AppStore · type · L75-L75 — Type alias representing the return type of the store factory function for type-safe store instance references.
- TypedDispatch · type · L76-L76 — Generic type alias that binds Redux dispatch to a specific thunk-aware state type for type-safe async action dispatching.
- AppDispatch · type · L78-L78 — Type alias for the application's dispatch function bound to RootState, enabling type-safe dispatching of actions and thunks.
- AppThunk · type · L79-L84 — Generic type alias that defines the shape of thunk actions within the application, supporting async action creators with type safety.
- RootState · type · L86-L86 — Type alias representing the complete application state shape derived from the root reducer composition.
