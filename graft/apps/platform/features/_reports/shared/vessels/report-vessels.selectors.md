# apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts · [[category-based-report-filtering]] [[report-vessel-data-pipeline]]

Redux selectors for filtering, ordering, paginating, and formatting vessel data across report categories (activity, detections, vessel groups, events).

- getVesselSource · function · L50-L60 — Determines the data source of vessel identity information (registry, self-reported, or both).
- VesselGroupVessel · type · L62-L65 — Extends vessel group vessel identity with reporting dataview and track dataset references.
- getVesselDatasetsWithoutEventsRelated · function · L368-L385 — Filters vessel datasets to exclude those with related events datasets, used for event-free vessel group reports.
