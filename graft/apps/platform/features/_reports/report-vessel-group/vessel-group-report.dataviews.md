# apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts · [[data-normalization-state-merging]] [[vessel-group-report-configuration]]

Exports factory functions and identifiers for creating and filtering dataview instances specific to vessel group reports, handling activity (fishing, presence) and event (encounter, loitering, port visits, gaps) data visualization.

- VesselGroupActivityDataviewId · type · L39-L40 — Type alias for vessel group activity dataview identifiers combining a prefix with activity subcategories.
- isVesselGroupActivityDataview · function · L50-L52 — Predicate that checks if a dataview ID represents a vessel group activity type.
- normalizeVesselGroupDatasetId · function · L54-L55 — Normalizes dataset IDs by removing versioning and converting private datasets to their public equivalents.
- VesselGroupActivityDatasetsParams · type · L57-L61 — Parameter type bundling vessel group datasets, activity dataset IDs, and the complete dataset catalog.
- getVesselGroupActivityDatasets · function · L63-L79 — Filters activity datasets to only those whose identity datasets belong to the given vessel group.
- VesselGroupActivityDataview · type · L81-L84 — Data structure holding a dataview slug and its associated datasets for vessel group activities.
- VesselGroupActivityDataviewParams · type · L86-L91 — Parameter type aggregating vessel group data, activity dataviews, datasets, and a fallback slug.
- getIsPrivateDataset · function · L93-L93 — Predicate determining whether a dataset ID belongs to the private dataset namespace.
- getVesselGroupActivityDataview · function · L95-L131 — Selects the best matching activity dataview and datasets for a vessel group, preferring public or private based on the group's nature.
- VesselGroupEventsDataviewId · type · L133-L134 — Type alias for vessel group event dataview identifiers combining a prefix with event subcategories.
- VGReportEventsSubCategory · type · L149-L149 — Type alias for vessel group event subcategories, excluding the fishing category.
- GetReportVesselGroupVisibleDataviewsParams · type · L161-L166 — Parameter type for filtering visible dataviews in vessel group reports by section and subsection.
- getReportVesselGroupVisibleDataviews · function · L167-L190 — Filters dataviews to only those visible for a vessel group report's current section and subsection.
- getVesselGroupDataviewInstance · function · L192-L213 — Creates a dataview instance for displaying vessel group data with optional datasets and dataview reference.
- getVesselGroupActivityDataviewInstance · function · L215-L248 — Constructs a dataview instance for vessel group activity visualization with color, ramp, and type configuration.
- getVesselGroupEventDataviewInstance · function · L250-L275 — Creates a dataview instance for displaying vessel group events with optional color override.
- getVesselGroupEncountersDataviewInstance · function · L277-L282 — Constructs a specialized dataview instance for displaying vessel group encounter events.
- getVesselGroupLoiteringDataviewInstance · function · L284-L289 — Constructs a specialized dataview instance for displaying vessel group loitering events.
- getVesselGroupPortVisitsDataviewInstance · function · L291-L296 — Constructs a specialized dataview instance for displaying vessel group port visit events.
- getVesselGroupEventsDataviewInstance · function · L298-L311 — Routes to the appropriate event dataview instance builder based on the report subsection type.
