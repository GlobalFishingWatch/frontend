# libs/deck-layers/src/layers/vessel/TrackLabelerVesselLayer.ts · [[deck-gl-layer-foundation]] [[vessel-layer-system]]

Provides a composite deck.gl layer that renders vessel track paths with icons, allowing filtering by action categories and temporal highlighting.

- TrackLabelerVesselLayerProps · type · L11-L18 — Defines the configuration properties for the track labeler vessel layer, including vessel data points, icon assets, color functions, and visibility filters.
- TrackLabelerVesselLayer · class · L20-L73 — Composite layer that renders vessel movement tracks as connected paths with individual vessel icons colored by data and filtered by action category.
- renderLayers · method · L23-L72 — Composes three deck.gl sublayers to display vessel track paths, base vessel icons, and highlight-state vessel icons with category filtering and temporal updates.
