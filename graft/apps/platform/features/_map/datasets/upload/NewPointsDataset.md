# apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx · [[asynchronous-file-type-detection]] [[dataset-metadata-configuration-path]] [[dataset-upload-and-parsing]] [[dual-path-geojson-transformation-for-points]] [[geometry-specific-metadata-extraction-and-validation]] [[timestamp-property-consistency-across-upload-path]]

Module that provides a React component for uploading and configuring point-based geographic datasets with coordinate and time field mapping.

- PointsGeojson · type · L52-L52 — Type alias for GeoJSON FeatureCollection of points with optional metadata tracking whether date parsing errors occurred.
- NewPointDataset · function · L54-L449 — React component that manages the upload workflow for point datasets, handling file parsing, metadata configuration, and coordinate/time field selection.
- updateFileType · function · L82-L87 — Async helper that detects the file type and determines if the dataset is in CSV format to enable appropriate parsing.
