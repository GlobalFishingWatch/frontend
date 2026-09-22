# apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx · [[dataview-instance-connector]] [[filter-compatibility-constraint]] [[layer-filter-and-properties-components]]

- LayerFiltersSourceProps · type · L23-L27 — Props interface defining the dataview instance, source change callback, and optional open state callback for the layer filters source component.
- LayerFiltersSource · function · L29-L86 — React component that renders a configurable multi-select dropdown for filtering and selecting data sources in a map layer with all/individual selection behavior.
- onSelectSourceClick · function · L45-L59 — Handler that updates the dataview's selected datasets when a source is clicked, replacing or adding to the current selection and cleaning invalid filters.
- onRemoveSourceClick · function · L61-L68 — Handler that removes a selected source from the dataview's datasets when the user deselects it from the multi-select dropdown.
