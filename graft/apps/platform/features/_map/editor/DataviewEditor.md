# apps/platform/features/_map/editor/DataviewEditor.tsx · [[dataview-editor-workspace-management]]

React component that provides a form editor for creating and updating dataviews with configuration options for category, datasets, color, zoom level, breaks, and temporal resolution.

- getDatasetCategory · function · L57-L58 — Maps a dataview category to its corresponding dataset category, with a special case for Events.
- temporalResolutionOption · type · L64-L64 — Type definition for temporal resolution options with id and label properties.
- DataviewEditorProps · type · L71-L74 — Props type for DataviewEditor component specifying optional dataview for editing and cancel callback.
- DataviewEditor · function · L76-L369 — Main React component that renders a form for creating or editing dataviews with validation, error handling, and save/cancel actions.
- onDataviewPropertyChange · function · L113-L115 — Updates partial dataview properties by merging changes into the current dataview state.
- onDataviewConfigChange · function · L117-L122 — Updates partial dataview configuration by merging changes into the nested config object.
- onSaveClick · function · L124-L184 — Validates and persists dataview by dispatching create or update thunk, handling errors and refreshing the workspace.
