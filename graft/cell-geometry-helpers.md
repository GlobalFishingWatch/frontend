---
name: Cell Geometry Helpers
slug: cell-geometry-helpers
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/helpers/cells.ts
    hash: 24c192f6075be0c322efc562f0b430d7604238b3812f0600344797bc718d20b1
sources_digest: 34c73f1efb1fba172106d0212c1d9aabb6d9668a52e6d9f6da5b5e12a8bc62ab
links: []
generator:
  version: 1
covers:
  - symbol: BBox
    kind: type
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L3-L3'
  - symbol: getCellProperties
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L5-L17'
  - symbol: GetCellCoordinatesParams
    kind: type
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L19-L25'
  - symbol: getCellCoordinates
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L27-L51'
  - symbol: getCellBounds
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L53-L66'
  - symbol: getCellPointCoordinates
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L68-L79'
  - symbol: getLastDigit
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L81-L81'
  - symbol: generateUniqueId
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/cells.ts:L83-L84'
---

<!-- context:generated:start -->

## Summary

Utilities for geospatial grid cell operations within a tile bounding box. Exports getCellProperties (row/column positions from cell index), getCellCoordinates (closed polygon ring), getCellBounds (four-corner bbox), getCellPointCoordinates (GeoJSON Position), and generateUniqueId (numeric identifier from x/y coordinates). Performs straightforward linear arithmetic to map cell indices to geographic space; getCellCoordinates returns ten coordinates (closed rectangle) rather than minimal four-corner form, possibly for GeoJSON compliance.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
