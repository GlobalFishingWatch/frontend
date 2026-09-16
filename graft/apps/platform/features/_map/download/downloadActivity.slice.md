# apps/platform/features/_map/download/downloadActivity.slice.ts · [[activity-download-timeout-retry-loop]] [[download-state-workflow-orchestration]]

- DateRange · type · L26-L29 — Type definition for a date range with start and end date strings.
- DownloadActivityState · interface · L31-L39 — Interface describing the Redux state shape for tracking download activity status, area context, errors, and UI tab selection.
- DownloadActivityParams · type · L51-L69 — Type definition for parameters required to initiate a heatmap activity download, including date range, geographic area, datasets, formats, and optional spatial/temporal aggregation settings.
- selectDownloadActivityStatus · function · L264-L264 — Selector that retrieves the current async operation status of the download activity.
- selectDownloadActivityError · function · L265-L265 — Selector that retrieves the error object from a failed download activity operation.
- selectHadDownloadActivityTimeoutError · function · L266-L267 — Selector that indicates whether a download activity experienced a timeout or concurrency error.
- selectDownloadActivityErrorMsg · function · L268-L269 — Selector that retrieves the error message string from a download activity failure.
- selectDownloadActivityAreaKey · function · L270-L270 — Selector that retrieves the geographic area key associated with the current download activity.
- selectDownloadActiveTabId · function · L271-L271 — Selector that retrieves the currently active heatmap download tab identifier.
