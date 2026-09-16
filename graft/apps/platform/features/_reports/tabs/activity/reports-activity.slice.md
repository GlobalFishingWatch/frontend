# apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts · [[activity-report-redux-state]]

Redux slice managing the state and async operations for activity report vessel data fetching, filtering, buffer settings, and hotspot configuration.

- HotspotSettings · type · L29-L33 — Type defining hotspot visualization parameters including enable flag, buffer area, and measurement unit.
- PreviewBuffer · type · L41-L45 — Type representing a preview buffer configuration with value, unit, and buffer operation for spatial filtering.
- ReportStateError · type · L53-L53 — Type extending AsyncError to attach the current report URL to error payloads.
- ReportState · interface · L54-L62 — Interface defining the complete state shape for report data, including fetch status, vessel data, buffer settings, and hotspot configuration.
- ReportSliceState · type · L64-L64 — Type wrapping ReportState under a report key to match the Redux slice structure.
- ReportRegion · type · L75-L78 — Type identifying a geographic region by dataset and region ID for filtering report data.
- FetchReportVesselsThunkParams · type · L80-L97 — Type aggregating all parameters needed to fetch vessel reports including region, datasets, filters, date range, and optional buffer/aggregation settings.
- getReportQuery · function · L112-L160 — Builds a URL query string from fetch parameters, resolving defaults and conditionally including buffer and region options.
- getReportRequestHash · function · L189-L202 — Generates a unique cache key from datasets, filters, date range, and area ID to detect report parameter changes.
- LazyLoadedSlices · interface · L272-L272 — Module augmentation interface extending LazyLoadedSlices to include the injected report slice type for dynamic loading.
