# apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx · [[collapsed-dataset-lists]] [[dataset-state-management]] [[dataview-state-management]] [[guest-user-isolation]] [[layer-library-ui]] [[lazy-user-dataset-loading]] [[map-drawing-system]]

Provides the user datasets section of the layer library panel, allowing users to upload, view, and add their datasets or draw custom layers on the map.

- LayerLibraryUserPanel · function · L41-L295 — React component that renders a panel displaying the authenticated user's uploaded datasets grouped by geometry type, with UI controls for uploading and drawing custom layers.
- SectionComponent · function · L115-L246 — Nested component that conditionally renders the user datasets list, loading spinner, error state with retry, or login prompt based on authentication and data fetch status.
