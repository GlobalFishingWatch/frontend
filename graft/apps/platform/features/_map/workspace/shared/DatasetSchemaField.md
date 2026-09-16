# apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx · [[dataset-field-display-components]] [[dataview-instance-connector]] [[filter-type-and-unit-transformation-patterns]]

React component that renders dataset schema filter fields as removable tags, with support for range filters, numeric filters, and vessel/port grouping.

- LayerPanelProps · type · L33-L39 — Type definition for the props object passed to the DatasetSchemaField component, specifying dataview configuration, filter field, label, styling, and removal handler.
- DatasetSchemaField · function · L41-L166 — React component that transforms and displays dataset filter values (ranges, numbers, or categories) as removable tags with support for histogram filters and guest user restrictions.
- toDisplay · function · L90-L90 — Utility function that converts a raw filter value to its display format using the field-specific value transformation.
