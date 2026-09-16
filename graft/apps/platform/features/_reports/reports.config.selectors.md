# apps/platform/features/_reports/reports.config.selectors.ts · [[report-state-configuration]] [[workspace-routing-state]]

Provides Redux selectors for accessing and composing report configuration state from URL query parameters, workspace state, and defaults.

- AreaReportProperty · type · L9-L9 — Type alias that extracts the resolved type of a report state property from the fully-required ReportState type.
- selectReportStateProperty · function · L10-L22 — Factory function that creates Redux selectors with a fallback chain: URL query parameters, workspace state, then default configuration.
