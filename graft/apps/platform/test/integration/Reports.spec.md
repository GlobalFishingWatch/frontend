# apps/platform/test/integration/Reports.spec.tsx · [[asynchronous-test-patterns]] [[reports-feature-integration-tests]]

Integration test suite for Reports feature covering navigation, data display, filtering, and tab interactions across various report types.

- waitForLocationType · function · L45-L47 — Polls the store's location type until it matches the expected route type, blocking test execution until navigation completes.
- clickReportTab · function · L49-L54 — Clicks a report tab button (Activity, Events, or Detections) using the provided test role accessor.
- waitForUserReportsReady · function · L56-L60 — Polls the reports state until it reaches Finished status, ensuring user reports have completed loading.
- findUserReportByName · function · L62-L64 — Filters user reports by name using a regex pattern, returning the first matching report.
- waitForReportFeaturesLoaded · function · L66-L85 — Polls until report state contains fully populated timeseries, stats, and features with isLoading false.
- getCalculatedReportHours · function · L87-L101 — Computes total hours from the first timeseries by formatting evolution data and summing aggregated values across the time range.
- waitForStatsQueryLoaded · function · L103-L127 — Polls until the events stats query resolves to a fulfilled or rejected state, returning the query result.
