# libs/deck-layer-composer/src/types.ts · [[deck-layer-composition-system]] [[layer-lifecycle-state-machine]] [[legend-configuration-system]]

Exports type definitions for deck layer composition, including legend types and lifecycle states.

- DeckLayerLifecycle · type · L19-L19 — Type alias that extracts valid lifecycle state values from the DECK_LAYER_LIFECYCLE constant.
- LegendType · enum · L21-L27 — Enumeration of supported legend visualization types for deck layers.
- DeckLegend · type · L29-L44 — Base type defining the shape of a legend object with styling, data domain, and associated sublayers.
- DeckLegendBivariate · interface · L46-L51 — Specialized legend type for two-dimensional bivariate data with a matrix of color breaks and values.
