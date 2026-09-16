# apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx · [[asynchronous-file-type-detection]] [[dataset-metadata-configuration-path]] [[dataset-upload-and-parsing]] [[geometry-specific-metadata-extraction-and-validation]] [[timestamp-property-consistency-across-upload-path]]

React component for uploading and configuring new polygon datasets with metadata editing and validation.

- PolygonFeatureCollection · type · L46-L46 — Type alias extending GeoJSON FeatureCollection to include optional metadata record for polygon features.
- NewPolygonDataset · function · L48-L320 — Main React component that renders a form for uploading polygon datasets, validating metadata, and managing dataset configuration options.
- updateFileType · function · L74-L77 — Async function that detects and stores the file type of the uploaded dataset file.
