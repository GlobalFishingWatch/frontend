# apps/platform/features/_map/editor/editor.slice.ts · [[dataview-editor-workspace-management]]

Redux slice that manages the state and async operations for fetching and displaying map editor dataviews.

- EditorState · interface · L24-L29 — State interface defining the structure of editor state with async-managed dataviews collection.
- fetchDataviewsBy · function · L46-L55 — Utility function that constructs and executes API requests to fetch paginated dataviews filtered by arbitrary parameters.
- LazyLoadedSlices · interface · L113-L113 — Module declaration interface that registers the editor slice as a lazy-loaded Redux slice extension.
