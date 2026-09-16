# apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx · [[dataset-metadata-configuration-path]] [[dataset-upload-and-parsing]] [[filter-enum-field-size-constraints]] [[geospatial-data-transform-contracts]]

- useDatasetMetadata · function · L21-L69 — Hook that manages dataset metadata state and provides callbacks to update metadata fields and frontend configuration while preserving id and value property mappings.
- FieldOption · type · L72-L72 — Type alias for a select option that includes an optional dataset filter type annotation.
- useDatasetMetadataOptions · function · L73-L177 — Hook that transforms dataset filters into selectable field options, filtering by type and excluding reserved fields, while disabling options that exceed enumeration value limits.
