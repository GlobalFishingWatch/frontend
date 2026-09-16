# apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx · [[dataview-layer-management]] [[report-summary]]

Renders a summary view displaying tags for dataview configuration including color selection, filters, and visible value ranges in report summaries.

- LayerPanelProps · type · L38-L43 — Configuration type defining optional UI display and interaction settings for the report summary tags component.
- ReportSummaryTags · function · L45-L217 — Main component that renders dataview summary tags with conditional color picker, filter controls, and dataset field indicators based on report category and user permissions.
- onToggleFiltersUIOpen · function · L64-L66 — Toggles the visibility state of the filters UI panel.
- onToggleColorOpen · function · L67-L69 — Toggles the visibility state of the color picker UI panel.
- onColorClick · function · L70-L79 — Updates the dataview color and color ramp configuration when a color option is selected, then closes the color picker.
- onTagRemoveClick · function · L81-L83 — Resets the viewport to fit the report area when a tag is removed.
