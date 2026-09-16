# libs/deck-layers/src/layers/draw/draw.types.ts · [[deck-gl-core-integration]] [[drawing-and-editing-layer]]

Type definitions for draw layer features and picking objects in deck.gl.

- DrawFeatureProperties · type · L6-L8 — Properties object that attaches an index identifier to draw features.
- DrawFeature · type · L10-L10 — A GeoJSON feature representing drawable geometry (polygon, multipolygon, or point) with index-based properties.
- DrawPickingObject · type · L12-L12 — Deck.gl picking object that combines draw feature geometry and properties for click/hover detection.
- DrawPickingInfo · type · L13-L13 — Deck.gl picking event information wrapper containing draw feature picking objects.
- EditHandleType · type · L17-L18 — Union type enumerating the six categories of edit interaction handles (existing, intermediate, snap, scale, rotate).
- EditHandleFeature · type · L20-L29 — GeoJSON feature representing an interactive handle point for editing geometry, with metadata about handle type and feature position.
