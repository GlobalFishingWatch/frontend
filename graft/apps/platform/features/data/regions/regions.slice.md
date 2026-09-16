# apps/platform/features/data/regions/regions.slice.ts · [[workspace-map-data]]

Redux slice managing the async fetching and selection of global fishing regions (EEZ, MPA, RFMO, FAO) with memoized selectors.

- RegionId · type · L12-L12 — Type alias for region identifiers accepting either string or numeric values.
- Region · interface · L13-L16 — Data structure representing a single geographic region with its identifier and display label.
- Regions · interface · L17-L20 — Container grouping regions by type with an array of region data for a specific region classification.
- RegionsState · type · L21-L21 — Redux state type wrapping the async loading state and data for all region collections.
- FetchRegionsThunkParams · type · L27-L27 — Parameter type mapping region types to dataset IDs for multi-source API region data retrieval.
- selectRegions · function · L93-L95 — Redux selector extracting the entire regions state subtree from the root state.
