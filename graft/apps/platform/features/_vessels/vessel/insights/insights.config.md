# apps/platform/features/_vessels/vessel/insights/insights.config.ts · [[time-range-validation-in-insights]] [[vessel-insights-display-system]]

Configuration file that defines insight types and categorizes vessel insights into non-fishing and fishing categories.

- NonAPIInsights · type · L6-L6 — Type alias for insight types that query the events API directly rather than the insights API.
- VesselInsight · type · L8-L8 — Union type representing all valid vessel insight types from both API and non-API sources.
