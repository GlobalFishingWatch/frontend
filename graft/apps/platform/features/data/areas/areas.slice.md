# apps/platform/features/data/areas/areas.slice.ts · [[data-layer-api]]

Redux slice managing the state, fetching, and caching of geographic area data from datasets, including support for single and merged multi-dataset areas.

- parseFeatureBbox · function · L20-L29 — Converts bbox data from JSON string or array format into a validated Bbox tuple.
- DrawnDatasetGeometry · type · L31-L31 — Type alias representing a GeoJSON FeatureCollection of polygons drawn by users with unique identifiers.
- DatasetArea · interface · L33-L37 — Data structure representing a single area entry with id, label, and optional bounding box.
- DatasetAreaList · interface · L39-L42 — Container holding async fetch status and a list of areas or drawn geometry features for a dataset.
- AreaGeometry · type · L44-L44 — Type alias for geographic geometry restricted to Polygon or MultiPolygon types.
- Area · interface · L45-L52 — Full GeoJSON Feature representation of a geographic area with geometry, bounds, name, and metadata properties.
- DatasetAreaDetail · interface · L53-L56 — Container holding async fetch status and detailed area data including full geometry and bounds.
- DatasetAreas · type · L63-L66 — Nested state structure pairing a list of areas with keyed detail entries for individual area geometries.
- AreasState · type · L67-L67 — Root state shape mapping dataset IDs to their associated area list and detail records.
- ensureDatasetAreas · function · L71-L81 — Initializes or retrieves the nested area state structure for a given dataset, creating it if missing.
- AreaKeyId · type · L83-L83 — Union type for area identifiers, allowing both string and numeric IDs.
- AreaKeys · type · L84-L84 — Type bundling the dataset, area ID, and optional name for identifying a specific area.
- FetchAreaDetailThunkParam · type · L85-L90 — Parameter object for fetching a single area's full geometry and bounds, with optional simplification.
- fetchAreaDetail · function · L92-L172 — Fetches a single area's geometry from the API, handling GeometryCollections via union and wrapping longitudes for antimeridian correctness.
- FetchDatasetAreasThunkParam · type · L276-L280 — Parameter object for fetching a dataset's list of context or user-drawn areas with optional field includes.
- selectAreas · function · L398-L398 — Selector extracting the root areas state object from Redux state.
