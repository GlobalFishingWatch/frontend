# libs/deck-layers/src/layers/basemap/basemap.types.ts · [[basemap-layer-suite]]

Type definitions module for basemap layer configuration and feature properties.

- BasemapType · enum · L7-L11 — Enumeration of available basemap rendering types: satellite, default, and labels.
- BasemapLayerProperties · type · L13-L23 — Property schema for basemap GeoJSON features including geographic ranking, classification, size, and localized names.
- BasemapLayerFeature · type · L24-L24 — GeoJSON feature type alias for point geometries with basemap layer properties.
- _BasemapLayerProps · type · L25-L25 — Type alias for deck layer props parameterized with a basemap type selection.
- _BasemapLabelsLayerProps · type · L26-L26 — Type alias for deck layer props parameterized with locale and tiles URL configuration.
