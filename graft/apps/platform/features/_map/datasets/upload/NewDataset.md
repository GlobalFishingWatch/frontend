# apps/platform/features/_map/datasets/upload/NewDataset.tsx · [[dataset-upload-and-parsing]] [[guest-user-upload-blocking]] [[two-step-file-upload-flow]]

- OnConfirmParams · type · L43-L43 — Type defining the parameters passed to the dataset confirm callback, indicating whether the operation is an edit and optionally providing the file.
- NewDatasetProps · type · L44-L51 — Type defining the props interface for the NewDataset modal component, specifying file handling, confirmation callbacks, and error handling.
- DatasetMetadata · type · L53-L60 — Type defining the partial dataset metadata structure extracted from uploads, including geometry configuration and public visibility flag.
- NewDataset · function · L62-L274 — React modal component that orchestrates the dataset upload workflow, handling file selection, geometry type routing, metadata validation, and integration with workspace state.
