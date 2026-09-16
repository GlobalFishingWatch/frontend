# apps/track-labeler/src/types/redux.types.d.ts · [[track-labeler-store-and-middleware]]

Redux type definitions module for the track labeler application, establishing root store, state, and action type contracts.

- AppActions · type · L4-L4 — Extracts the union type of all Redux actions dispatched in the application.
- AppState · type · L5-L5 — Extracts the complete application state tree shape from the root reducer.
- Store · type · L8-L8 — Extracts the Redux store type for use within the typesafe-actions module.
- RootState · type · L10-L10 — Aliases the application state type for consistency with typesafe-actions naming conventions.
- RootAction · type · L12-L12 — Aliases the application actions type for consistency with typesafe-actions naming conventions.
- Types · interface · L14-L16 — Module augmentation interface that configures typesafe-actions with application-specific action types.
