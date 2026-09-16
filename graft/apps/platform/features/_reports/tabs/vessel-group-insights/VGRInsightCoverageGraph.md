# apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx · [[coverage-bucketing-schema]] [[vessel-group-report-insights-system]]

Renders an interactive bar chart showing the distribution of vessels across different data coverage buckets for vessel group reports.

- CustomTick · function · L18-L28 — Provides custom axis tick rendering for the coverage graph to display bucket labels with proper positioning.
- getDataByCoverage · function · L30-L33 — Groups vessels by their coverage bucket classification for aggregation and visualization purposes.
- parseCoverageGraphAggregatedData · function · L35-L43 — Transforms vessel data into aggregated chart format by counting vessels per coverage bucket.
- parseCoverageGraphIndividualData · function · L45-L55 — Transforms vessel data into individual item chart format by organizing and sorting vessels within each coverage bucket.
- VesselGroupReportInsightCoverageGraph · function · L57-L93 — React component that renders a responsive bar chart showing vessel coverage distribution with both aggregated and individual detail views.
