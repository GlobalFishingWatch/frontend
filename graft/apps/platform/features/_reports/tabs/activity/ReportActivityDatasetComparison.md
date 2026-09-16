# apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx · [[activity-report-ui-components]] [[analytics-and-navigation]] [[dataset-comparison-filtering]] [[query-parameter-synchronization]]

React component that provides dataset selection UI for comparing activity data in reports, managing main and comparison dataset state through URL query parameters.

- createDatasetOption · function · L27-L36 — Factory function that constructs a select option object with formatted label and optional color indicator.
- ReportActivityDatasetComparison · function · L38-L182 — Main React component that renders dual dataset selectors for activity report comparison with automatic filtering and query parameter sync.
- onMainSelect · function · L124-L131 — Handler that updates the main dataset selection in the report comparison query parameters.
- onCompareSelect · function · L133-L146 — Handler that updates the comparison dataset selection and triggers viewport adjustment to fit the compared area.
