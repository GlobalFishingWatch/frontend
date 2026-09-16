# apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts · [[drawing-coordinate-system]] [[drawing-geometry-import-lifecycle]]

Module that exports hooks for managing pending user-drawn geometries during dataset import, including layer rendering and viewport centering.

- PendingDrawGeometry · type · L22-L22 — Type representing a pending geometry drawn by the user, paired with the dataset ID it belongs to.
- usePendingDrawDataview · function · L32-L42 — Hook that retrieves the dataview instance corresponding to a pending drawn geometry dataset.
- usePendingDrawImportCenter · function · L44-L56 — Hook that computes the bounding box center of a pending drawn geometry to center the viewport during dataset import.
- usePendingDrawOverlayLayer · function · L58-L102 — Hook that creates and manages a GeoJSON layer displaying pending drawn geometry while the dataset is importing, auto-refreshing until ingestion completes.
