# apps/platform/features/_reports/shared/utils/reports.utils.ts · [[data-aggregation-with-others-bucketing]]

Utility module providing functions to aggregate, group, and process vessel and activity graph data for report visualizations.

- VesselVisualizationData · type · L28-L31 — Type alias for individual-level responsive visualization data containing vessel names and associated values.
- getAggregatedDataWithOthers · function · L35-L63 — Caps categorical distribution data to MAX_CATEGORIES, rolling excess categories into an Others group with aggregated values.
- getVesselAggregatedGroupedData · function · L65-L135 — Groups vessels by a specified property (flag, type, gear, or source) per dataview and sorts by aggregated value across dataviews.
- getVesselIndividualGroupedData · function · L137-L232 — Groups vessels by a property and consolidates null, other, and excess categories into a single Others group, preserving dataview order.
- isTimeComparisonGraph · function · L239-L241 — Checks whether a report activity graph type is a before/after or period comparison time-based graph.
