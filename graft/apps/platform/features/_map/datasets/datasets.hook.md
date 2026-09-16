# apps/platform/features/_map/datasets/datasets.hook.ts · [[dataset-management-integration-hook]] [[global-polling-state-for-import-refresh]]

React hooks module for managing dataset operations, including fetching, upserting, updating, deleting, and auto-refreshing datasets with modal state connections.

- NewDatasetProps · interface · L44-L46 — Configuration interface for dataset selection callbacks in the new dataset workflow.
- getDataviewInstanceByDataset · function · L50-L78 — Routes a dataset to the appropriate dataview instance handler based on its type and geometry.
- useAddDataviewFromDatasetToWorkspace · function · L80-L96 — Hook that provides a function to add a dataset as a dataview instance to the workspace.
- useDatasetModalOpenConnect · function · L98-L116 — Hook that connects dataset upload modal open/close state to Redux dispatch.
- useDatasetModalConfigConnect · function · L118-L136 — Hook that connects dataset upload modal configuration state and dispatch to Redux.
- useDatasetsAPI · function · L138-L198 — Hook providing wrapped dataset API operations (fetch, create, update, delete) with error handling.
- useAutoRefreshImportingDataset · function · L202-L241 — Hook that automatically polls a dataset's status until import completes, preventing duplicate polling.
- refreshDataset · function · L219-L229 — Polls dataset status and reschedules itself until import is no longer in progress.
- useAddDataset · function · L243-L260 — Hook that returns a callback to open the dataset upload modal and trigger analytics tracking.
