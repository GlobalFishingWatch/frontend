---
name: Report Time-Series Visualization Subsystem
slug: report-time-series-visualization-subsystem
type: system
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx
    hash: 4805bf432091cf529f6f74faec37e00f550c317cb54a95495b1ac4cb5ba8b8ea
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx
    hash: f11fc428070f7734718e17c17f777898db7a2133c6a9aaf2b2f2797acaa9170f
  - path: apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx
    hash: 5ef6716401366f3e39894da71965cac95d3c121704dd7f3d9a6f405f36521947
sources_digest: 87e769778793bafb91d195e2da9c5786b1b81d2d95018f8e70f824025edf3772
links:
  - to: events-report-system
    relation: part_of
    description: >-
      EventsReportGraphEvolution and EventsReportGraphGrouped render event
      statistics using this subsystem's ResponsiveTimeseries and
      ResponsiveBarChart, configuring colors and includes filters based on event
      type
  - to: report-others-tab-system
    relation: part_of
    description: >-
      ReportPolygonsEvolution uses ResponsiveTimeseries (via Recharts
      ComposedChart) to visualize dual-line plots (contained/overlapping) per
      sublayer with custom tooltips
generator:
  version: 1
covers:
  - symbol: EventsReportGraphEvolutionTooltipProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx:L32-L45
  - symbol: AggregatedGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx:L47-L75
  - symbol: EventsReportIndividualGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx:L77-L125
  - symbol: formatDateTicks
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx:L127-L136
  - symbol: EventsReportGraphEvolution
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx:L137-L215
  - symbol: EventsReportGraphGroupedTooltipProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx:L46-L59
  - symbol: AggregatedGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx:L61-L120
  - symbol: ReportGraphTick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx:L122-L227
  - symbol: onLabelClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx:L135-L186
  - symbol: EventsReportGraphGrouped
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx:L229-L344
  - symbol: PolygonsEvolutionTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx:L24-L64
  - symbol: ReportPolygonsEvolution
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx:L66-L180
---

<!-- context:generated:start -->

## Summary

Generic time-series charting infrastructure supporting multiple data types (events, polygons, points) via ResponsiveTimeseries and ResponsiveBarChart components. Bridges aggregated statistics (via Redux selectors like selectEventsStatsDataGrouped) with individual record details fetched on-demand. Includes helper utilities (formatDateTicks, tickFormatter) for axis labels and configurable intervals (FourwingsInterval) for data bucketing.

## Related

- part of [[events-report-system]] — EventsReportGraphEvolution and EventsReportGraphGrouped render event statistics using this subsystem's ResponsiveTimeseries and ResponsiveBarChart, configuring colors and includes filters based on event type
- part of [[report-others-tab-system]] — ReportPolygonsEvolution uses ResponsiveTimeseries (via Recharts ComposedChart) to visualize dual-line plots (contained/overlapping) per sublayer with custom tooltips

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
