# apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx · [[activity-report-ui-components]] [[analytics-and-navigation]] [[dataset-comparison-filtering]] [[query-parameter-synchronization]]

Component that provides a selector dropdown for choosing between different activity graph visualization modes (evolution, before-after, period comparison, dataset comparison) with conditional availability based on filter equality and data type.

- isEvolutionOrDatasetComparison · function · L28-L29 — Determines whether a graph type is evolution or dataset comparison (time-option-agnostic) by checking against the known time-comparison options.
- ReportActivityGraphSelectorProps · type · L31-L33 — Defines the props interface for the ReportActivityGraphSelector component with a loading flag.
- ReportActivityGraphSelector · function · L35-L131 — Renders a dropdown selector that allows users to switch between different activity graph comparison modes, handling filter validation and query parameter updates based on graph type selection.
- onSelect · function · L78-L113 — Handles graph type selection by validating filter consistency, managing time comparison state, filtering dataset instances, and updating URL parameters accordingly.
