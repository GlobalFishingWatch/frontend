# apps/platform/features/_reports/reports-hotspot.utils.ts · [[hotspot-computation]] [[spatial-geometry-assumptions]]

Utility module that computes hotspot geometries (activity-weighted ellipses) for geospatial fishing reports using circular sweep and PCA fitting.

- CellEntry · type · L16-L16 — Data structure pairing a Fourwings grid cell with its aggregated activity total.
- EllipseParams · type · L21-L29 — Parameters defining an ellipse (center, semi-axes, rotation angle, and coordinate scaling factors) for hotspot visualization.
- formatArea · function · L31-L35 — Formats an area in square kilometers as a human-readable string with thousand abbreviations.
- circularWindowSweep · function · L39-L63 — Finds the densest circular region of maximum area using a spatial index sweep, returning cells within the highest-activity circle.
- computeEllipseParams · function · L68-L122 — Fits a PCA ellipse to activity-weighted cells, computing center, axes, and rotation constrained by a maximum area and aspect ratio limit.
- buildEllipsePolygon · function · L124-L139 — Generates a closed polygon coordinate ring by parametrically sampling an ellipse at regular angular intervals.
- cellsInsideEllipse · function · L141-L151 — Filters cells to retain only those whose centers fall within the ellipse boundary using the canonical ellipse inequality.
- HotspotProperties · type · L153-L158 — GeoJSON feature properties encoding hotspot area, unit, activity hours, and percentage of total regional activity.
- computeHotspotGeometry · function · L160-L209 — Orchestrates a three-step analysis (circular sweep, PCA fitting, region summation) to generate an optimized hotspot ellipse feature.
