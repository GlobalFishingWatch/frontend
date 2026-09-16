# apps/platform/features/_map/dataviews/selectors/dataviews.selectors.ts · [[dataview-type-category-selectors]] [[report-aware-dataview-filtering]]

Redux selectors module that exports dataview instance queries and filtering logic for the map feature.

- selectHasSubcategoryDetectionsDataview · function · L160-L167 — Higher-order selector factory that checks if any visible dataview contains a dataset with the specified subcategory.
- getIsDataviewReportSupported · function · L284-L297 — Utility function that determines if a dataview is a supported report type and differs from the current report dataview.
