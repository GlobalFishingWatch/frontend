# libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts · [[bathymetry-contour-layer]] [[deck-gl-core-integration]]

- BathymetryContourLayerProps · type · L6-L11 — Defines the configuration properties for a bathymetry contour layer, including tile source URL, optional depth levels, color, and line thickness.
- BathymetryContourFeature · type · L12-L12 — Represents a bathymetry contour feature as a GeoJSON feature with line or multi-line geometry.
- BathymetryLabelFeature · type · L13-L20 — Represents a bathymetry label feature as a GeoJSON point with elevation, bearing, and length metadata.
- BathymetryTileFeature · type · L22-L22 — Union type that represents any bathymetry tile feature, either a contour line or a depth label.
- BathymetryContourPickingObject · type · L24-L26 — Defines the structure of a picking object when a bathymetry contour is clicked, exposing the elevation property.
- BathymetryContourPickingInfo · type · L28-L28 — Wraps bathymetry contour picking data with Deck.gl picking metadata for interaction handling.
