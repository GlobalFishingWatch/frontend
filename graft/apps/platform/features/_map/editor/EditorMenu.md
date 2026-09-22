# apps/platform/features/_map/editor/EditorMenu.tsx · [[dataview-editor-workspace-management]]

React component that manages editor UI for dataviews and workspace, toggling between a dataviews list and a dataview editor form based on user interactions.

- Section · type · L16-L16 — Union type that defines the two possible sections of the editor menu: dataviews list or new dataview form.
- EditorMenu · function · L17-L52 — React component that renders the editor menu with conditional navigation between workspace/dataview editors and creation controls based on permissions and workspace status.
- onEditClick · function · L23-L26 — Callback handler that opens the dataview editor form and switches to the new-dataview section when editing an existing dataview.
- onCancelClick · function · L28-L31 — Callback handler that clears the edited dataview and returns the editor menu to the dataviews list section.
