# apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts · [[dataview-instance-resolution-pipeline]] [[report-aware-dataview-filtering]]

Exports Redux selectors for filtering and retrieving dataview instances based on vessel location, report categories, visibility, and dataview types.

- findVesselProfileDataviewInstance · function · L45-L67 — Identifies the correct vessel profile dataview instance by matching vessel ID and dataset version, with fallback to less specific matches.
- selectDataviewInstancesByType · function · L194-L198 — Returns a selector factory that filters resolved dataview instances by their configuration type.
