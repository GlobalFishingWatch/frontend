# apps/track-labeler/src/routes/routes.selectors.ts · [[activity-type-ontology]] [[query-driven-state-synchronization]] [[track-labeler-routing]] [[workspace-and-project-configuration]]

Selector functions that extract and transform route, project, and map filter state from Redux store for the track labeler application.

- selectLocation · function · L11-L13 — Retrieves the location object from the Redux root state.
- selectQueryParam · function · L22-L28 — Factory function that creates selectors to extract and normalize query parameters from location, falling back to default workspace values when undefined.
