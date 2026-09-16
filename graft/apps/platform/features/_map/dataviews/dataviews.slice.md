# apps/platform/features/_map/dataviews/dataviews.slice.ts · [[dataviews-management]] [[geospatial-data-transform-contracts]]

Redux slice module managing dataview state, thunks, selectors, and async operations for the map feature.

- normalizeDataview · function · L52-L55 — Normalizes a dataview by generating a slug from its name if one is not already present.
- DataviewsState · type · L142-L142 — Type alias representing the async reducer state for managing a collection of dataviews.
- DataviewsSliceState · type · L143-L143 — Type alias defining the slice state structure that wraps the async dataviews reducer state.
- selectDataviewBySlug · function · L168-L172 — Selector that retrieves a single dataview from the store by its slug identifier.
