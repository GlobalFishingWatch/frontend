# apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx · [[asynchronous-file-type-detection]] [[dataset-metadata-configuration-path]] [[dataset-upload-and-parsing]] [[geometry-specific-metadata-extraction-and-validation]] [[timestamp-property-consistency-across-upload-path]] [[track-dataset-field-immutability-during-edit]]

React component that handles user interface and workflow for uploading and configuring track datasets with file parsing, metadata management, and validation.

- NewTrackDataset · function · L49-L453 — Form component that enables users to upload track datasets, configure field mappings, set time filters, and manage dataset metadata before confirmation.
- updateFileType · function · L71-L76 — Detects the uploaded file format (CSV or GeoJSON) and updates the component state accordingly.
