# libs/deck-layer-composer/src/resolvers/polygons.ts · [[dataset-client]] [[dual-data-sourcing-strategy]] [[type-specific-layer-resolvers]] [[user-data-and-polygon-layers]]

Module that resolves polygon layer properties and data URLs for deck layers by extracting temporal context datasets from dataviews.

- resolvePolygonsDataUrl · function · L12-L28 — Resolves a temporal context dataset URL from a dataview and injects the start and end date parameters.
- resolveDeckPolygonsLayerProps · function · L30-L49 — Builds polygon layer configuration by composing dataview properties with either embedded GeoJSON data or a resolved data URL.
