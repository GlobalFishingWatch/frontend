# libs/deck-layer-composer/src/resolvers/basemap.ts · [[deck-layer-composition-rendering]] [[type-specific-layer-resolvers]]

Resolves basemap layer configurations by converting dataview instances into deck.gl layer property objects for image tiles, labels, and basemap rendering.

- resolvePMTilesUrl · function · L18-L32 — Constructs and resolves the absolute URL to a PMTiles dataset resource by extracting the file path configuration and building an endpoint request.
- resolvePMTilesDatasetTilesUrl · function · L34-L40 — Retrieves and validates a PMTiles dataset from a dataview's dataset collection, then resolves its URL.
- resolveDeckBasemapLabelsLayerProps · function · L42-L53 — Transforms a dataview configuration into deck.gl basemap labels layer properties including tiles URL, visibility, and locale settings.
- resolveDeckBasemapLayerProps · function · L55-L62 — Transforms a dataview configuration into deck.gl basemap layer properties including category, visibility, and basemap type selection.
- resolveDeckBasemapImageLayerProps · function · L64-L75 — Transforms a dataview configuration into deck.gl basemap image layer properties including tiles URL, visibility, tile size, and zoom constraints.
