# apps/platform/features/_reports/reports-geo.utils.ts · [[geospatial-filtering-worker]] [[spatial-geometry-assumptions]]

- getAreaKm2 · function · L17-L28 — Computes polygon area in square kilometers, preferring precomputed property over geometry measurement.
- FilteredPolygons · type · L30-L35 — Type that classifies geographic features into contained and overlapping subsets relative to a polygon.
- isCellInPolygon · function · L37-L45 — Checks whether all four corners of a grid cell are contained within a polygon boundary.
- FilterByPolygonMode · type · L47-L47 — Enumeration of filtering strategies for classifying features relative to a polygon.
- FilterByPolygomParams · type · L48-L53 — Parameters object specifying the polygon, feature layers, and filtering mode for geographic classification.
- filterByPolygon · function · L54-L161 — Partitions grid cells and features into contained versus overlapping categories based on polygon intersection tests.
