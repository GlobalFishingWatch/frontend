# apps/platform/features/_map/layer-library/LayerLibraryItem.tsx · [[dataset-state-management]] [[dataview-state-management]] [[layer-library-ui]] [[workspace-color-assignment]]

React component file that exports a layer library item UI element for browsing and adding map layers to the workspace.

- LayerLibraryItemProps · type · L36-L36 — Props interface that defines a library layer and optional highlighted text for display.
- LayerLibraryItem · function · L40-L146 — React component that renders a layer library item with metadata, icons, and an action button to add the layer to the workspace.
- onAddToWorkspaceClick · function · L66-L106 — Async handler that adds a layer to the workspace with appropriate color selection, fetches missing dataviews/datasets, and tracks the user action.
