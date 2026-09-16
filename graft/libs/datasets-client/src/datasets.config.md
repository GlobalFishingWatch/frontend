# libs/datasets-client/src/datasets.config.ts · [[dataset-configuration-and-filtering]]

Configuration utilities and type definitions for managing dataset properties, geometry types, and environmental data ranges across frontend and backend dataset configurations.

- DataList · type · L12-L12 — Type alias representing an array of generic key-value record objects used as structured data.
- DatasetSchemaGeneratorProps · type · L14-L16 — Type definition for the input properties required to generate a dataset schema from structured data.
- DatasetConfigurationProperty · type · L18-L18 — Type alias constraining property names to those valid in the FrontendConfiguration interface.
- DatasetProperty · type · L20-L20 — Generic type that retrieves and wraps the non-optional value type of a given FrontendConfiguration property.
- getDatasetConfigurationProperty · function · L43-L68 — Retrieves a typed configuration property from a dataset with fallback to legacy flattened structure for backward compatibility.
- getDatasetConfiguration · function · L70-L75 — Extracts a complete configuration object of a specified type from a dataset, defaulting to an empty object when absent.
- getDatasetGeometryType · function · L77-L88 — Determines the geometry type of a dataset, returning 'draw' for user-drawn datasets or reading from frontend configuration otherwise.
- getEnvironmentalDatasetRange · function · L90-L105 — Computes the scaled minimum and maximum data range for an environmental dataset from its configuration metadata.
