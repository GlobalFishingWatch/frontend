# apps/platform/features/_reports/report-dataview-category.utils.ts · [[bundle-size-optimization-through-module-isolation]] [[report-dataview-categorization-and-filtering]]

Utility module providing predicates and transformers to classify dataviews by report category, subcategory, and supported feature types.

- isPointsDataviewReportSupported · function · L21-L23 — Predicate that identifies whether a dataview can be used in a report by checking if it is a UserPoints type.
- isPolygonsDataviewReportSupported · function · L25-L35 — Predicate that identifies whether a dataview can be used in a report by checking for Polygons, UserContext, or Context types with a valid dataset.
- isContextDataviewReportSupported · function · L37-L39 — Predicate that identifies whether a dataview can be used in a context report by combining points and polygons support checks.
- isUserHeatmapDataviewReportSupported · function · L41-L47 — Predicate that identifies whether a dataview can be used in a report by checking if it is a user-owned heatmap (static or animated).
- getReportCategoryFromDataview · function · L49-L62 — Maps a dataview to its corresponding report category, routing context dataviews to Others category and falling back to the dataview's own category.
- getReportSubCategoryFromDataview · function · L64-L77 — Extracts and normalizes the report subcategory from a dataview, handling the workaround to display BQ activity datasets with 'user' subcategory as 'fishing'.
- isSupportedReportDataview · function · L109-L117 — Validates whether a dataview is eligible for use in a report by checking category and type against predefined support lists and visibility requirements.
- isSupportedComparisonDataview · function · L119-L128 — Validates whether a dataview is eligible for use in a comparison view by checking category and type against predefined comparison support lists.
