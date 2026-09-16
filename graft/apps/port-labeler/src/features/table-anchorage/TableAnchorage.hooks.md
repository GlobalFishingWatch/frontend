# apps/port-labeler/src/features/table-anchorage/TableAnchorage.hooks.ts · [[table-anchorage-editing-interface]]

Module that exports React hooks for managing state changes to point, subarea, and port values via Redux dispatch.

- ValueManager · type · L10-L14 — Type contract defining three callback handlers for updating point, subarea, and port field values in the labeler.
- useValueManagerConnect · function · L15-L44 — Custom hook that provides memoized Redux-connected callbacks to dispatch labeler state mutations for point, subarea, and port value changes.
