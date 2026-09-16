# libs/deck-loaders/src/fourwings/helpers/cells.ts · [[cell-geometry-helpers]]

- BBox · type · L3-L3 — Type alias representing a bounding box as [minX, minY, maxX, maxY] numeric coordinates.
- getCellProperties · function · L5-L17 — Extracts the column, row, width, and height of a cell within a grid given its flat index.
- GetCellCoordinatesParams · type · L19-L25 — Type definition for parameters required to locate a cell: tile bbox, cell index, grid dimensions, and optional flat flag.
- getCellCoordinates · function · L27-L51 — Computes the polygon ring coordinates (as a closed path) of a cell within a tile grid.
- getCellBounds · function · L53-L66 — Computes the axis-aligned bounding box [minX, minY, maxX, maxY] of a cell within a tile grid.
- getCellPointCoordinates · function · L68-L79 — Returns the minimum corner [x, y] point of a cell as a GeoJSON Position.
- getLastDigit · function · L81-L81 — Extracts the rightmost digit of a number.
- generateUniqueId · function · L83-L84 — Combines incremented last digits of x and y coordinates with a cell id into a single numeric identifier.
