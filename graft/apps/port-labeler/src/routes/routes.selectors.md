# apps/port-labeler/src/routes/routes.selectors.ts · [[url-routing-query-parameter-synchronization]]

Redux selectors for accessing and deriving route location state, query parameters, and computed viewport/time-range properties.

- selectLocation · function · L10-L10 — Extracts the location object from Redux root state.
- selectQueryParam · function · L26-L29 — Factory selector that retrieves a typed query parameter from the current location, falling back to the default workspace value if absent.
