# libs/deck-layers/src/layers/rulers/RulersLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[interactive-picking-and-enrichment]] [[ruler-measurement-layer]] [[shared-picking-and-layer-utilities]] [[spatial-indexing-and-geometry]]

- getRulersLines · function · L33-L37 — Transforms an array of ruler data objects into great-circle line features for rendering.
- getRulersLinesLabels · function · L39-L43 — Extracts center points with labels from ruler line features for text rendering on the map.
- RulersLayer · class · L45-L119 — Composite deck.gl layer class that manages rendering of ruler lines, labels, and endpoint markers.
- getPickingInfo · method · L49-L60 — Augments picking information with layer-specific metadata (id, layerId, category) for interaction events.
- renderLayers · method · L61-L118 — Constructs and returns deck.gl GeoJsonLayer and ScatterplotLayer instances configured to render ruler lines, labels, and control points.
