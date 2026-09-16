# libs/deck-layers/src/layers/graticules/GraticulesLayer.ts · [[deck-gl-composite-layer-pattern]] [[graticules-layer]] [[viewport-aware-level-of-detail]]

- GraticulesLayer · class · L29-L136 — A deck.gl composite layer that renders graticule (latitude/longitude grid) lines and labels, with adaptive visibility based on viewport zoom level.
- initializeState · method · L36-L42 — Sets up initial layer state with the current viewport hash and generates all graticule features.
- shouldUpdateState · method · L44-L51 — Determines if the layer needs re-rendering when viewport changes or color/thickness properties are modified.
- updateState · method · L53-L57 — Updates the cached viewport hash when the viewport or props change.
- renderLayers · method · L95-L135 — Composes and returns PathLayer and TextLayer instances for rendering graticule lines and coordinate labels with viewport-driven update triggers.
