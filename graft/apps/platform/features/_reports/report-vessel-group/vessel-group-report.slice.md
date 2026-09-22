# apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts · [[client-side-deduplication-memoization]] [[data-normalization-state-merging]] [[vessel-group-report-state-management]]

Redux slice managing vessel group report state, including fetching vessel group data with identities and providing selectors for datasets and activity dataviews.

- VesselGroupReport · type · L23-L25 — Type alias representing a vessel group report with enriched vessel identity data.
- ReportState · interface · L27-L32 — Interface defining the shape of the vessel group report slice state, tracking async operation status and cached vessel group data.
- VesselGroupReportSliceState · type · L34-L34 — Type alias mapping the full Redux state shape to the vessel group report slice.
- FetchVesselGroupReportThunkParams · type · L43-L45 — Type alias specifying parameters required to fetch vessel group report data by ID.
- fetchVesselGroupVesselIdentities · function · L47-L59 — Async function that fetches paginated vessel identity records filtered by vessel group ID, including self-reported information.
- selectVGRStatus · function · L132-L133 — Selector that retrieves the async operation status of the vessel group report fetch.
- selectVGRError · function · L134-L134 — Selector that retrieves any error that occurred during vessel group report fetching.
- selectVGRData · function · L135-L136 — Selector that retrieves the cached vessel group report data from state.
