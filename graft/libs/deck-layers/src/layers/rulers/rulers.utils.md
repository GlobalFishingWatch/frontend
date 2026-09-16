# libs/deck-layers/src/layers/rulers/rulers.utils.ts · [[data-transformation-pipeline]] [[ruler-measurement-layer]] [[spatial-indexing-and-geometry]]

Utility module providing functions to compute ruler geometry, measurements, and label formatting for map-based distance measurement tools.

- getRulerCoordsPairs · function · L7-L15 — Converts a ruler object into start and end coordinate pairs with its ID.
- hasRulerStartAndEnd · function · L17-L18 — Validates that all rulers in an array have both start and end points defined.
- getGreatCircleMultiLine · function · L20-L23 — Generates a great circle GeoJSON line feature between ruler start and end points.
- getRulerLengthLabel · function · L25-L33 — Formats a line's length into a human-readable label showing both kilometers and nautical miles with adaptive precision.
- getRulerStartAndEndPoints · function · L35-L45 — Creates GeoJSON point features for ruler start and end positions with measurement labels.
- getRulerCenterPointWithLabel · function · L47-L61 — Calculates the center point of a line and computes bearing-adjusted rotation for label display.
