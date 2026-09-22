# libs/api-types/src/vessel-insights.ts · [[api-type-contracts]] [[vessel-identity-and-regulatory-status-tracking]]

Defines the type schemas for vessel insight data including coverage, fishing activity, gaps, and vessel identity information.

- InsightType · type · L1-L7 — Enumeration of available insight report types: coverage, gaps, fishing events, and vessel identity tracking categories.
- InsightBase · type · L9-L14 — Base structure providing the time period frame (start and end dates) for all insight reports.
- InsightValueInPeriod · type · L16-L21 — Records a vessel flag status value (BLACK or GREY) during a specific date range within the insight period.
- InsightCoverage · type · L23-L27 — Quantifies AIS data coverage by reporting total blocks tracked and percentage of blocks with position data.
- InsightFishing · type · L29-L38 — Summarizes fishing activity with event counts in RFMOs without authorization and no-take marine protected areas, plus supporting datasets.
- InsightGaps · type · L40-L47 — Reports AIS transmission gaps with event counts and lists of gap-off intervals tracked across datasets.
- InsightIdentityEntry · type · L49-L53 — Tracks a vessel's listing count across a compliance list (IUU, MOU, or flag changes) with period-specific values and historical totals.
- InsightIdentityMOU · type · L55-L60 — Optional container for MOU compliance list status (Tokyo and Paris conventions) for a vessel.
- InsightIdentityIUU · type · L62-L64 — Optional container tracking whether a vessel appears on an IUU (illegal, unreported, unregulated) fishing vessel list.
- InsightIdentityFlagsChanges · type · L66-L68 — Optional container recording flag change history for a vessel during the reporting period.
- InsightIdentity · type · L70-L74 — Aggregates all vessel identity compliance and flag-change data (IUU, MOU, flag changes) with supporting datasets.
- InsightResponse · type · L76-L81 — Complete vessel insight report combining coverage metrics, gaps, fishing events, and identity compliance details within a time period.
