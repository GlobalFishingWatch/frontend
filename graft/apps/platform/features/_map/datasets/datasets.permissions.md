# apps/platform/features/_map/datasets/datasets.permissions.ts · [[dataset-utilities-and-filtering]] [[geospatial-data-transform-contracts]] [[permission-based-dataset-filtering]]

Permission utility module that exports functions to check dataset permissions for reporting, download, and vessel data access across dataviews.

- hasDatasetConfigVesselData · function · L11-L17 — Checks whether a dataset configuration contains vessel-specific data by detecting vessel ID, ssvid, or vessels query parameters.
- getActivityDatasetsReportSupported · function · L19-L41 — Filters dataview datasets to return only those with report permissions and matching activity, detection, event, or heatmap-animated environment categories.
- getVesselDatasetsDownloadTrackSupported · function · L43-L57 — Retrieves track-endpoint datasets with vessel data that have download-track permissions for the given user.
- getDatasetsReportSupported · function · L59-L68 — Returns active datasets from dataviews that have permission-supported report capabilities.
- getDatasetsReportNotSupported · function · L70-L79 — Returns active datasets from dataviews that do not have permission-supported report capabilities.
