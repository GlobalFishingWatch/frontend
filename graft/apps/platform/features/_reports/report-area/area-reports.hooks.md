# apps/platform/features/_reports/report-area/area-reports.hooks.tsx · [[area-reports-system-core-logic-selectors]] [[map-viewport-and-timebar-integration]] [[report-locale-and-metadata-formatting]]

React hooks module for report area management, including boundary fitting, area data fetching, and report title generation.

- DateTimeSeries · type · L83-L86 — Type definition representing a time series of numeric data points indexed by date.
- isClose · function · L92-L95 — Utility function that checks if two numeric values are within a specified tolerance.
- useReportAreaCenter · function · L97-L112 — Hook that calculates map center coordinates (latitude, longitude, zoom) for a report area based on its bounding box.
- useStatsBounds · function · L114-L147 — Hook that fetches spatial statistics for a dataview and returns its bounding box coordinates.
- useVesselGroupActivityBounds · function · L149-L153 — Hook that retrieves the spatial bounds of vessel group activity data from stats.
- useVesselGroupBounds · function · L155-L159 — Hook that retrieves spatial bounds for a specific vessel group dataview by ID.
- usePortsReportAreaFootprint · function · L161-L176 — Hook that fetches and caches port report area footprint data from the dataset.
- usePortsReportAreaFootprintBounds · function · L178-L187 — Hook that returns the loading status and bounding box of a port report footprint area.
- useReportAreaBounds · function · L189-L245 — Hook that aggregates and resolves the correct spatial bounds depending on report type (vessel group, port, or standard area report).
- isAreaCenterInViewport · function · L247-L267 — Utility function that determines whether a report area's center is already visible in the current map viewport.
- useReportAreaInViewport · function · L269-L275 — Hook that checks whether the report area is currently centered in the map viewport.
- useFitAreaInViewport · function · L277-L307 — Hook that returns a callback to programmatically center and zoom the map to fit a report area bounds.
- getSimplificationByDataview · function · L315-L317 — Function that determines the geometric simplification tolerance level based on the dataview type.
- useFetchReportArea · function · L319-L350 — Hook that fetches and caches area geometry detail with appropriate simplification based on dataview configuration.
- useFetchReportVessel · function · L352-L427 — Hook that constructs vessel report query parameters, triggers data fetch, and manages workspace URL history.
- usePortsReportAreaFootprintFitBounds · function · L429-L439 — Hook that automatically fits the map viewport to a port report footprint when it finishes loading.
- useReportTitle · function · L441-L558 — Hook that generates a localized report title based on report type, area name, and dataset configuration.
