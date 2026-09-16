# apps/platform/features/_map/bigquery/bigquery.hooks.ts · [[bigquery-modal-and-custom-dataset-creation]] [[dataview-instance-management]] [[redux-state-management]]

Custom React hook that manages BigQuery modal state, query cost estimation, and dataset creation workflows.

- useBigQueryModal · function · L25-L89 — Custom hook that provides state management and handlers for the BigQuery modal including query cost estimation and dataset creation.
- onRunCostClick · function · L37-L49 — Async handler that fetches and validates BigQuery query execution cost, updating error state on failure.
- onCreateClick · function · L51-L72 — Async handler that creates a BigQuery dataset with specified parameters and automatically adds the resulting dataview to the workspace.
