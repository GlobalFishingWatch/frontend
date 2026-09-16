# apps/track-labeler/src/routes/routes.ts · [[query-driven-state-synchronization]] [[track-labeler-routing]]

Configures routing logic and navigation handlers for the track-labeler application using redux-first-router.

- thunk · function · L21-L45 — Authenticates the user and conditionally redirects to HOME or LOGIN based on login state, triggering prefetch thunks for data loading.
- encodeWorkspace · function · L77-L79 — Serializes workspace state objects to URL query strings without encoding special characters.
- decodeWorkspace · function · L81-L92 — Parses URL query strings into workspace state objects and applies type transformations for numeric parameters.
