# libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts · [[deck-layer-legends-interaction]]

Provides hooks and atoms for managing and querying deck layer legends including color scales, visualization modes, and grid area calculations.

- DeckLegendAtom · type · L20-L20 — Type alias that extends DeckLegend by replacing the ranges property with string or 2D string array representation for legend display.
- useDeckLegends · function · L98-L100 — Hook that retrieves the current deck layer legends atom value for use in React components.
- useGetDeckLayerLegend · function · L102-L105 — Hook that finds and returns a single deck layer legend by its ID.
- useGetDeckLayerLegends · function · L107-L110 — Hook that filters and returns multiple deck layer legends matching the provided ID array.
