# apps/platform/features/_map/bigquery/bigquery.slice.ts · [[async-operation-patterns]] [[bigquery-modal-and-custom-dataset-creation]] [[redux-state-management]]

Redux slice managing BigQuery dataset creation workflows, query cost estimation, and async operation status tracking.

- BigQueryVisualisation · type · L17-L17 — Union type defining the two supported visualization modes for BigQuery datasets.
- RunCostResponse · type · L19-L22 — Response type for BigQuery dry-run cost calculation containing byte consumption metrics.
- CreateBigQueryDataset · type · L24-L34 — Input payload type defining all parameters required to create a new BigQuery dataset with optional metadata and visualization settings.
- CreateBigQueryDatasetResponse · type · L61-L66 — Response type from BigQuery dataset creation API containing the new dataset ID and temporal bounds.
- BigQueryState · interface · L112-L116 — Redux state shape tracking the async status and results of BigQuery cost calculations and dataset creation operations.
- LazyLoadedSlices · interface · L176-L176 — Module augmentation interface registering the BigQuery slice as a lazy-loadable reducer in the root reducer.
