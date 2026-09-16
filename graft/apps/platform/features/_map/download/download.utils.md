# apps/platform/features/_map/download/download.utils.ts · [[download-validation-format-selection]]

Utility module providing validation and filtering functions for download report configuration, including temporal resolution support and grouping option constraints.

- getDownloadReportSupported · function · L32-L40 — Validates whether a download report is supported by checking that the date range does not exceed the configured report day limit.
- getSupportedGroupByOptions · function · L42-L96 — Filters grouping options by disabling MMSI and gear-type groupings when their corresponding data support is unavailable in the selected dataviews.
- hasDataviewWithIntervalSupported · function · L101-L121 — Checks whether all dataviews and their active datasets support a specific temporal interval, falling back to sensible defaults by dataview category when configuration is missing.
- getSupportedTemporalResolutions · function · L123-L172 — Returns available temporal resolution options filtered by date range constraints and dataset interval support, disabling resolutions that exceed available data granularity.
