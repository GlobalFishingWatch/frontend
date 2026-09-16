---
name: Event Visualization Hierarchy
slug: event-visualization-hierarchy
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraph.tsx
    hash: 9b547568f5b46302f73c30c92901db015587b960a188b8e639264019fa635a1b
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx
    hash: 4805bf432091cf529f6f74faec37e00f550c317cb54a95495b1ac4cb5ba8b8ea
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx
    hash: f11fc428070f7734718e17c17f777898db7a2133c6a9aaf2b2f2797acaa9170f
sources_digest: 0462af2996fa44cbc32c84786cc43ea3d7efc50101addb71eb4a9610ec25497b
links:
  - to: events-report-system
    relation: implements
    description: >-
      EventsReportGraph selects visualization mode and passes time-series or
      grouped data to appropriate graph component; tooltips display
      aggregated/individual event metadata depending on hover context
  - to: report-data-fetching-hooks
    relation: depends_on
    description: >-
      Both graph components use useFetchEventReportGraphEvents to load
      individual events for tooltips and download; EventsReportGraph retrieves
      aggregated stats via selectEventsStatsDataGrouped
generator:
  version: 1
covers:
  - symbol: EventsReportGraph
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventsReportGraph.tsx:L18-L75'
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
---

<!-- context:generated:start -->

## Summary

Dual-mode event display controlled by graph type selector: EventsReportGraphEvolution shows temporal trends via ResponsiveTimeseries with aggregated and individual event tooltips; EventsReportGraphGrouped displays categorical distributions (flag, RFMO, FAO, EEZ) via ResponsiveBarChart with truncation to MAX_CATEGORIES and 'others' bucketing. Both modes conditionally render EventsReportDownload only when individual events are fetchable.

## Related

- implements [[events-report-system]] — EventsReportGraph selects visualization mode and passes time-series or grouped data to appropriate graph component; tooltips display aggregated/individual event metadata depending on hover context
- depends on [[report-data-fetching-hooks]] — Both graph components use useFetchEventReportGraphEvents to load individual events for tooltips and download; EventsReportGraph retrieves aggregated stats via selectEventsStatsDataGrouped

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
