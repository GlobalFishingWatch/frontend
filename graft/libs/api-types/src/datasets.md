# libs/api-types/src/datasets.ts · [[api-types-type-definitions]] [[discriminated-union-type-safety-via-generics]] [[temporal-data-versioning-constraints]]

Defines TypeScript type definitions and enumerations for dataset entities, configurations, documentation, categorization, and file metadata used throughout the API.

- UploadResponse · type · L10-L13 — Represents the response structure for file uploads, containing the path and URL of the uploaded resource.
- DatasetType · type · L15-L15 — Template string type that narrows DatasetTypes into a union of valid dataset type strings.
- DatasetStatus · enum · L17-L22 — Enumerates the possible lifecycle states of a dataset: deleted, done, error, or importing.
- DatasetDocumentationTypes · type · L24-L25 — Union type defining the categories of dataset documentation that can be attached to a dataset.
- DatasetDocumentationStatusTypes · enum · L27-L30 — Enumerates whether dataset documentation is currently active or deprecated.
- DatasetDocumentation · type · L32-L38 — Metadata structure describing documentation type, status, related queries, and provider information for a dataset.
- DatasetConfigurationInterval · type · L40-L40 — Union type specifying the allowed time interval granularities for dataset configuration.
- RelatedDataset · type · L42-L45 — Represents a reference to another dataset, including its identifier and type.
- DatasetCategory · enum · L47-L55 — Enumerates the primary classifications of datasets: activity, context, detections, environment, event, vessel, or vessel groups.
- DatasetCategories · type · L57-L57 — Template string type that converts DatasetCategory enum values into a union of string literals.
- DatasetSubCategory · enum · L59-L85 — Enumerates granular classifications beneath primary categories, covering environmental, fishing, tracking, and satellite data types.
- DatasetSubCategories · type · L87-L87 — Template string type that converts DatasetSubCategory enum values into a union of string literals.
- DatasetFile · type · L89-L94 — Describes metadata for a single file in a dataset, including name, storage path, size, and last update timestamp.
- DatasetI18nFilter · type · L96-L99 — Holds internationalization metadata for a single filter, including label text and enum value translations.
- DatasetI18nFilters · type · L100-L100 — Maps filter names to their internationalization metadata, enabling multi-language filter presentation.
- DatasetI18n · type · L102-L106 — Internationalization container for dataset names, descriptions, and filter translations across languages.
- Dataset · type · L108-L134 — Complete dataset entity structure defining identity, classification, configuration, documentation, temporal bounds, ownership, and related data references.
- DownloadDataset · type · L136-L145 — Simplified dataset representation for download operations, including DOI, readme content, and file listing.
