# apps/platform/queries/map/vessel-insight-api.ts · [[gfw-base-query]] [[vessel-and-search-apis]]

Redux Toolkit query API module that provides vessel and vessel-group insight data queries with reusable base parameters and selector exports.

- BaseInsightParams · type · L11-L15 — Type that defines the common insight query parameters including the insight type and date range.
- VesselInsightParams · type · L17-L19 — Type that extends BaseInsightParams to specify parameters for querying insights on multiple individual vessels with their dataset identifiers.
- VesselGroupInsightParams · type · L21-L23 — Type that extends BaseInsightParams to specify parameters for querying insights on a grouped collection of vessels.
- getBaseQueryParams · function · L25-L31 — Helper function that normalizes common insight request parameters into a standardized query object format.
- selectVesselGroupInsight · function · L71-L72 — Selector function that retrieves the request state for a specific vessel group insight query using its parameters.
