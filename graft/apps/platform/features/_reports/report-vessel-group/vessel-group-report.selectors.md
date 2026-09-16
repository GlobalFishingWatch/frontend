# apps/platform/features/_reports/report-vessel-group/vessel-group-report.selectors.ts · [[vessel-group-report-state-management]]

Provides Redux selectors to retrieve vessel group report insights (fishing, coverage, gap, IUU, flag changes, MOU) and ownership data from the application state.

- selectFetchVGRParamsByInsight · function · L34-L37 — Higher-order selector factory that creates parameterized selectors for vessel group report API requests by combining base parameters with a specific insight type.
- selectVGRInsightById · function · L49-L56 — Higher-order selector that resolves vessel group insight data from the API slice using a parameter selector to look up cached API responses by insight type.
