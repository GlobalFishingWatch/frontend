# apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts · [[annotation-system]] [[url-query-parameter-persistence]]

Provides React hooks for managing temporary and persisted map annotations, including creation, editing, deletion, and visibility toggling.

- useMapAnnotation · function · L19-L60 — Hook that manages the temporary annotation state in Redux before user confirmation, exposing methods to add, update, and reset the working annotation.
- useMapAnnotations · function · L65-L119 — Hook that manages confirmed annotations persisted in the URL query parameters, providing operations to upsert, delete, clean, and toggle visibility of all annotations.
