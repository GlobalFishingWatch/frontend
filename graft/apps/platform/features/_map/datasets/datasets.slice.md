# apps/platform/features/_map/datasets/datasets.slice.ts · [[dataset-management-redux-layer]] [[geospatial-data-transform-contracts]] [[recursive-related-dataset-fetching-with-depth-limit]] [[two-step-file-upload-flow]]

Redux slice managing dataset state with thunks for fetching, creating, updating, and deleting datasets from Global Fishing Watch API.

- getAPILocale · function · L37-L41 — Converts application locale to uppercase API locale format, handling Crowdin source and in-context language variants.
- DatasetsState · interface · L43-L46 — Redux state interface for datasets with async loading status, deprecation mappings, and deleted dataset tracking.
- DatasetsSliceState · type · L48-L48 — Type alias defining the datasets slice structure within the root Redux state.
- FetchUserDatasetsMode · type · L83-L83 — Union type specifying whether to fetch all datasets or only user-owned datasets.
- FetchDatasetsBatchParams · type · L85-L93 — Configuration parameters for batch fetching datasets with existing IDs, refresh mode, locale, and API caching options.
- fetchDatasetsBatch · function · L95-L187 — Fetches a batch of datasets from the API, handling deleted datasets and building deprecation/related dataset mappings.
- fetchDatasets · function · L119-L139 — Constructs and executes the API request for datasets with locale, includes, and pagination parameters.
- FetchAllDatasetsParams · type · L307-L308 — Optional parameters for the fetch all datasets thunk specifying fetch mode and locale.
- getAllDatasetsRequestKey · function · L311-L314 — Generates a cache key for in-flight all-datasets requests to prevent duplicate concurrent fetches.
- UpsertDataset · type · L339-L344 — Parameters for creating or updating a dataset including file upload, public creation flag, and ID suffix options.
- selectDatasetsStatus · function · L533-L533 — Selector extracting the async loading status of the datasets state.
- selectDatasetsStatusId · function · L534-L534 — Selector extracting the ID of the dataset currently being loaded.
- selectDatasetsError · function · L535-L535 — Selector extracting any async error from the datasets loading operation.
- selectSliceDeprecatedDatasets · function · L536-L537 — Selector accessing the raw deprecation mappings stored in the datasets state slice.
- selectDeletedDatasets · function · L538-L538 — Selector retrieving the list of dataset IDs marked as deleted in the current state.
