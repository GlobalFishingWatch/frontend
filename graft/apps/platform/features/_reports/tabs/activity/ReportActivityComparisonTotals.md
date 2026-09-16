# apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx · [[comparison-aggregation-logic]] [[data-freshness-and-temporal-bounds]] [[internationalization-i18n-and-formatting]] [[time-based-comparison-strategies]]

Displays aggregated baseline and comparison totals for activity reports with absolute and percentage change calculations across before/after or period comparison graphs.

- ComparisonGraph · type · L16-L16 — Type that defines the two supported comparison graph visualization modes: beforeAfter or periodComparison.
- bucketAvg · function · L19-L19 — Calculates the average value of a bucketed estimate by taking the midpoint between its min and max bounds.
- ReportActivityComparisonTotals · function · L21-L125 — React component that computes and renders baseline and comparison totals with color-coded change indicators for activity report comparisons.
