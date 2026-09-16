# apps/platform/features/_map/datasets/upload/FileDropzone.tsx · [[dataset-upload-and-parsing]] [[two-step-file-upload-flow]]

React component that provides a drag-and-drop interface for uploading dataset files with format validation and error handling.

- FileDropzoneProps · interface · L36-L43 — Configuration interface specifying accepted file types, handlers for file loading and clearing, styling options, and error display for the FileDropzone component.
- FileDropzone · function · L45-L128 — React component that renders a dropzone area accepting specified file types, displays file icons and format instructions, validates dropped files against accepted MIME types, and invokes callbacks on file selection or clearing.
