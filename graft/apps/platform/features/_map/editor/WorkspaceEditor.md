# apps/platform/features/_map/editor/WorkspaceEditor.tsx · [[dataview-editor-workspace-management]]

React component that displays available dataviews organized by category and allows users to add them to or remove them from the workspace.

- WorkspaceEditorProps · type · L28-L30 — Type definition for the props interface of the WorkspaceEditor component, specifying a callback for edit actions.
- WorkspaceEditor · function · L32-L150 — Main React component that renders a categorized list of dataviews with controls to add/remove them from the workspace.
- isDataviewAdded · function · L62-L66 — Predicate function that checks if a dataview with the given ID is already present and active in the workspace.
- addDataviewToWorkspace · function · L68-L81 — Async function that fetches required datasets and adds a dataview and its instance to the workspace.
- onDataviewClick · function · L83-L97 — Event handler that toggles a dataview in or out of the workspace based on its current presence.
