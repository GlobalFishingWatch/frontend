# apps/platform/queries/map/report-events-stats-api.ts · [[gfw-base-query]] [[statistics-apis]]

- BaseReportEventsVesselsParamsFilters · type · L22-L36 — Type defining optional filter criteria for report events queries including port, vessel group, encounter type, and duration bounds.
- BaseReportEventsVesselsParams · type · L38-L46 — Type defining common temporal and spatial parameters for report events queries including date range, region, and buffer settings.
- ReportEventsVesselsParams · type · L48-L52 — Type extending base params with dataset and filter operator specifications for vessel-level report event queries.
- ReportEventsStatsParams · type · L54-L60 — Type extending vessel params with includes and groupBy options to support aggregated statistics queries with optional grouping dimensions.
- ReportEventsStatsResponseGroups · type · L62-L67 — Type representing an array of grouped statistics with name, value, optional label and flag for categorized event aggregations.
- ReportEventsStatsResponse · type · L69-L75 — Type defining the response structure for report events statistics including counts, time-series data, and grouped breakdowns.
- GetReportEventParams · type · L77-L95 — Type extending base params to support multi-dataset queries with per-dataset filters, operators, and grouping dimension options.
- ReportEventsVesselsResponse · type · L97-L97 — Type alias for an array of vessel-level statistics responses.
- getFilterWithOperator · function · L101-L113 — Helper that wraps a filter key-value pair with an optional operator (EXCLUDE) in uppercase form.
- getEncounterTypesFilter · function · L115-L124 — Helper that expands encounter type identifiers and applies operator wrapping to produce a filter object.
- parseEventsFilters · function · L126-L146 — Transforms filter parameters into a normalized query object by mapping camelCase properties to dash-case API keys with operator support.
- getBaseStatsQuery · function · L148-L171 — Assembles core query parameters including dates, region, buffer settings, and filters into a single query object for API requests.
- getEventsStatsQuery · function · L173-L178 — Wraps the base stats query with a single dataset array for aggregate statistics endpoint requests.
- getEventsVesselQuery · function · L180-L185 — Wraps the base stats query with a single dataset scalar for vessel-level breakdown endpoint requests.
- selectReportEventsStats · function · L288-L289 — Selector factory that returns a Redux selector for cached report events statistics query results.
- selectReportEventsVessels · function · L291-L292 — Selector factory that returns a Redux selector for cached report events vessels query results.
- selectReportEventsPorts · function · L294-L295 — Selector factory that returns a Redux selector for cached report events ports query results using stats endpoint.
