# apps/track-labeler/src/features/map/map.selectors.ts · [[map-rendering-visualization-layer]]

Redux selectors module that extracts and transforms vessel track points for map visualization and filtering by date ranges and selected segments.

- extractVesselDirectionPoints · function · L18-L63 — Filters and transforms raw vessel track points into directional arrow points, excluding segments that fall within selected track time ranges.
- extractVesselDirectionPointsByDateRange · function · L65-L75 — Narrows a list of vessel points to only those with timestamps falling within a specified start and end date range.
