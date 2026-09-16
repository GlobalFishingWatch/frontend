# libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts · [[tile-constraint-validation]] [[tile-data-access-patterns]]

Utility module for checking whether fourwings tile position data exceeds rendering limits based on viewport and frame range.

- FourwingsTileFrames · type · L14-L17 — Type alias defining the frame range boundaries for fourwings tile data queries.
- isTilePositionsOverLimit · function · L19-L56 — Determines whether a single tile's aggregated position count exceeds the maximum allowed limit within a given frame range.
- getAreTilePositionsAvailable · function · L58-L81 — Checks whether all tiles visible in the current viewport stay within position limits after filtering by geographic bounds.
