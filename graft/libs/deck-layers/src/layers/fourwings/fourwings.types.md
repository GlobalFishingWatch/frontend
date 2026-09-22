# libs/deck-layers/src/layers/fourwings/fourwings.types.ts · [[fourwings-unified-layer]]

Type definitions for the Fourwings deck layer, including color objects, sublayer configurations, and picking interfaces for heatmap and position visualizations.

- FourwingsSublayerId · type · L17-L17 — Type alias identifying a unique sublayer within a Fourwings visualization.
- FourwingsDatasetId · type · L18-L18 — Type alias identifying a dataset associated with Fourwings layers.
- FourwingsVisualizationMode · type · L19-L19 — Union type extracted from the FOURWINGS_VISUALIZATION_MODES configuration constant to represent supported visualization modes.
- GetViewportDataParams · type · L21-L23 — Configuration options for viewport data retrieval, controlling whether to fetch only values and starting frame.
- FourwingsColorObject · type · L25-L25 — RGBA color representation with individual numeric channels for rendering.
- FourwingsTileLayerColorDomain · type · L26-L26 — Domain specification for color scale mapping, supporting both flat and 2D array ranges.
- FourwingsTileLayerColorRange · type · L27-L27 — Color value range used in tile layer rendering, defined as either 2D or 1D arrays of RGBA objects.
- FourwingsTileLayerColorScale · type · L28-L31 — Complete color scale mapping combining domain intervals with their corresponding RGBA color ranges.
- FourwingsDeckSublayer · type · L33-L51 — Configuration object defining a Fourwings sublayer with dataset references, visibility, styling, filtering, and optional vessel grouping.
- FourwingsVectorDirection · type · L53-L53 — Enumeration of vector component directions ('u' or 'v') for wind or current data representation.
- FourwingsDeckVectorSublayer · type · L54-L62 — Configuration for a vector-based Fourwings sublayer specifying direction, color, datasets, and visibility bounds.
- BaseFourwingsLayerProps · type · L64-L73 — Base properties for Fourwings deck layers, defining temporal range, sublayer collection, tile URL, and position rendering limits.
- FourwingsPickingInfo · type · L75-L75 — Union type aggregating picking information from both heatmap and positions layers for unified interaction handling.
- FourwingsPickingObject · type · L76-L78 — Wrapper type for deck picking results, containing either heatmap or positions layer picking data.
