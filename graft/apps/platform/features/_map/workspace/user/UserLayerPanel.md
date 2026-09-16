# apps/platform/features/_map/workspace/user/UserLayerPanel.tsx · [[dataview-composition-and-resolution]] [[layer-property-customization]] [[user-track-visualization]] [[user-uploaded-dataset-management]]

User layer panel component that renders controls for toggling, editing, filtering, and styling user-uploaded datasets in the map workspace.

- UserPanelProps · type · L68-L72 — Type definition for the props passed to the UserPanel component, specifying dataview instance and optional callbacks.
- UserPanel · function · L74-L412 — Renders an interactive layer panel for user-created map datasets, managing visibility, filters, color/thickness properties, and editing of geographic data.
- changeColor · function · L132-L141 — Updates the dataview color configuration and closes the properties panel when a new color is selected.
- changeThickness · function · L142-L150 — Updates the dataview line thickness configuration and closes the properties panel when a new thickness is selected.
- onEditClick · function · L152-L166 — Dispatches actions to open either the map drawing editor or dataset modal depending on the dataset geometry type.
- onToggleColorOpen · function · L167-L169 — Toggles the visibility state of the layer properties panel.
- onToggleFilterOpen · function · L171-L173 — Toggles the visibility state of the layer filters panel.
- closeExpandedContainer · function · L175-L178 — Closes both the filters and properties expanded containers.
