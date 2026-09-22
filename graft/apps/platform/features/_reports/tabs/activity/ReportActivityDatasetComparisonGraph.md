# apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx · [[activity-graph-rendering]] [[axis-and-domain-configuration]] [[dataset-comparison-filtering]]

Renders a dual-axis Recharts composition visualizing time-series activity data for two datasets side-by-side with filtered sublayers and dynamic domain scaling.

- ReportActivityDatasetComparisonProps · type · L28-L32 — Type definition specifying the props required for the dataset comparison graph component.
- filterDataBySublayer · function · L34-L65 — Filters and transforms dataview records to isolate specific sublayers (main and compare datasets) while restructuring their time-series arrays accordingly.
- findDataviewData · function · L67-L71 — Locates a specific dataview record by its ID or by matching a sublayer within it.
- calculateXDomain · function · L73-L83 — Computes the X-axis time domain for the chart by adjusting the end date based on the reporting interval.
- calculateYAxisDomain · function · L85-L100 — Determines the Y-axis range with padding for a specific data series, ensuring non-zero domain spans and sensible default bounds.
- ReportActivityDatasetComparisonGraph · function · L102-L283 — React component that renders a dual-axis time-series comparison chart with loading and empty-state handling for two datasets.
