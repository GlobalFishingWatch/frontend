# libs/datasets-client/src/datasets.utils.ts · [[dataset-utilities-and-version-management]]

Utility module providing functions to manipulate, query, and transform dataset metadata including version parsing, extent calculation, and dataset filtering.

- removeDatasetVersion · function · L9-L11 — Extracts the base dataset identifier by removing the version suffix.
- getDatasetVersion · function · L13-L15 — Extracts the version string from a versioned dataset identifier.
- parseDatasetVersion · function · L17-L18 — Parses version string into an array of numeric components for version comparison.
- getIsDatasetVersionDowngrade · function · L23-L47 — Determines whether a deprecated dataset version is actually an older version than the latest version.
- replaceDatasetPublicToPrivate · function · L49-L53 — Converts a public dataset prefix to a private dataset prefix.
- replaceDatasetPrivateToPublic · function · L55-L59 — Converts a private dataset prefix to a public dataset prefix.
- findDatasetByType · function · L61-L63 — Finds the first dataset in a list matching a specific dataset type.
- getUserDataviewDataset · function · L65-L75 — Retrieves a user-related dataset from a dataview by matching specific context, tracks, or event types.
- getDatasetsExtent · function · L77-L102 — Calculates the overall temporal extent (start and end dates) across multiple datasets.
- getDatasetsLatestEndDate · function · L104-L120 — Finds the latest end date from a list of datasets, optionally filtered by category.
- RelatedDatasetByTypeParams · type · L122-L125 — Type definition specifying optional parameters for filtering related datasets.
- getRelatedDatasetByType · function · L127-L142 — Retrieves a single related dataset by type, with preference for full datasets when allowed.
- getRelatedDatasetsByType · function · L144-L159 — Retrieves all related datasets of a specific type, with preference for full datasets when allowed.
- getIsVMSDataset · function · L162-L164 — Determines whether a dataset identifier represents a VMS (Vessel Monitoring System) dataset.
- DatasetEventSource · type · L165-L165 — Type alias representing the possible sources for dataset events: VMS or AIS.
- getDatasetSource · function · L166-L171 — Determines the data source type (VMS or AIS) from a dataset identifier.
