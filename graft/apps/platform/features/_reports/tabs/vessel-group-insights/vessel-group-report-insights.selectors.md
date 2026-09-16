# apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts · [[insight-data-enrichment-and-deduplication]] [[vessel-group-report-insights-system]]

Provides Redux selectors to extract and organize vessel insight data (gaps, fishing violations, IUU listings, flag changes, and MOU memberships) from vessel group reports.

- VesselGroupReportInsightVessel · type · L30-L32 — Type alias combining a vessel group insight with its resolved identity information.
- selectVGRVesselsByInsight · function · L34-L61 — Higher-order selector factory that filters vessels by a specific insight type and sorts them by counter value or ship name.
- MouVesselByCategoryInsight · type · L97-L100 — Type defining a vessel paired with an insight value for categorizing MOU compliance records.
- MOUInsightCountry · type · L102-L102 — Union type identifying the two MOU country jurisdictions tracked in vessel compliance.
- MOUInsightList · type · L103-L103 — Union type identifying the two MOU vessel list classifications for compliance tracking.
- MOUVesselByList · type · L104-L104 — Type mapping MOU list types to arrays of categorized vessel insights.
- MOUVesselsGrouped · type · L105-L105 — Selector that organizes MOU-listed vessels by country and list type, grouping compliance data by jurisdiction.
