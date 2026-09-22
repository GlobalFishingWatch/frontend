---
name: Events Report System
slug: events-report-system
type: system
sources:
  - path: apps/platform/features/_reports/tabs/events/EventReportPorts.tsx
    hash: 06cb3dfa2faa52b69eb5e384aa3c16343c3997a2ae8d71b08b0cb9fe3590c510
  - path: apps/platform/features/_reports/tabs/events/events-report.hooks.ts
    hash: d75b150606425bfe92e665d32ae92092646cb1b61606fc99837f9317fbdbb247
  - path: apps/platform/features/_reports/tabs/events/events-report.selectors.ts
    hash: bbabfdfdae0bc51b12e4c69d7b246bb0f469ae76890cc387c6a3610692eaf051
  - path: apps/platform/features/_reports/tabs/events/events-report.types.ts
    hash: 74c68abba7c30be6d163a9f3d5b4bfb800b458ffb904a4b33be3aa5d6bad6067
  - path: apps/platform/features/_reports/tabs/events/events.report.download.ts
    hash: af6c3b0083c2b5b1e3e691ed1b66f4c75c611abe12c2b343e0e3f174805ea7a3
  - path: apps/platform/features/_reports/tabs/events/EventsReport.tsx
    hash: cb0371fdc000ad2fee2daae9bcbbf1fe278968c9a1d2a487b38a7bab48520739
  - path: apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx
    hash: a663c804f82a80aea802661719b42db62df2447a6fba7580730ce6f5f631aaed
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraph.tsx
    hash: 9b547568f5b46302f73c30c92901db015587b960a188b8e639264019fa635a1b
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx
    hash: 4805bf432091cf529f6f74faec37e00f550c317cb54a95495b1ac4cb5ba8b8ea
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx
    hash: f11fc428070f7734718e17c17f777898db7a2133c6a9aaf2b2f2797acaa9170f
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx
    hash: 66a78bd90d4fb856784e4106c2023a526e07f0539619325a4ff6931a2ce3e7b8
  - path: >-
      apps/platform/features/_reports/tabs/events/EventsReportSubsectionSelector.tsx
    hash: d55d4f70b02b04861819c960a4de33b4788ca2b7d88d108fe222dbd6c0394441
sources_digest: 9c93c0c99edbbf209e0071940aef76e8ff5c87eab0ed1e5c062d0311495f7b0d
links:
  - to: analytics-and-navigation
    relation: depends_on
    description: >-
      EventReportPorts uses trackEvent for analytics, useReplaceQueryParams for
      URL sync, and useDataviewInstancesConnect for filter modifications
  - to: analytics-tracking
    relation: uses
    description: >-
      EventsReportDownload and EventsReportGraphSelector track user actions
      (download, graph type selection) via trackEvent with category Analysis
  - to: event-type-hierarchical-csv-schema
    relation: uses
    description: >-
      parseReportEventsToCSV delegates CSV transformation to objectArrayToCSV
      with event-type-specific column configs (BASE, ENCOUNTER, PORT_VISIT);
      EventsReportDownload uses this to export filtered events
  - to: redux-report-state
    relation: depends_on
    description: >-
      All components query selectTimeRange, selectReportAreaName,
      selectReportEventsSubCategorySelector, selectEventsStatsDataGrouped from
      reports domain to drive filtering and rendering
  - to: report-data-fetching-hooks
    relation: uses
    description: >-
      EventsReport uses useGetReportEventsStatsQuery and
      useGetReportEventsVesselsQuery; EventsReportGraphEvolution and
      EventsReportGraphGrouped use useFetchEventReportGraphEvents to fetch
      detailed individual events
  - to: report-hash-and-url-sync
    relation: uses
    description: >-
      EventsReport integrates useReportHash for state tracking;
      EventsReportDownload and EventsReportGraphSelector use
      useReplaceQueryParams to persist user selections to URL
  - to: report-time-series-visualization-subsystem
    relation: depends_on
    description: >-
      EventsReportGraph queries aggregated stats and event types from Redux,
      conditionally renders EventsReportGraphEvolution or
      EventsReportGraphGrouped based on visualization mode
generator:
  version: 1
covers:
  - symbol: EventReportPorts
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L28-L216'
  - symbol: onPrevPageClick
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L57-L59'
  - symbol: onNextPageClick
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L60-L62'
  - symbol: onTogglePortFilter
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L72-L92'
  - symbol: EventsReport
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventsReport.tsx:L46-L219'
  - symbol: EventsReportDownloadProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx:L14-L16
  - symbol: EventsReportDownload
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx:L17-L79
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
  - symbol: EventsReportGraphSelectorProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L23-L26
  - symbol: EventsReportGraphSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L28-L95
  - symbol: onSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L71-L80
  - symbol: VesselGroupReportEventsSubsectionSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportSubsectionSelector.tsx:L18-L95
  - symbol: onSelectSubsection
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportSubsectionSelector.tsx:L71-L79
  - symbol: useGetEventReportGraphLabel
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/events-report.hooks.ts:L37-L64'
  - symbol: FetchEventReportGraphEventsParams
    kind: type
    at: 'apps/platform/features/_reports/tabs/events/events-report.hooks.ts:L66-L71'
  - symbol: useFetchEventReportGraphEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/events-report.hooks.ts:L72-L124
  - symbol: useReportHash
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/events-report.hooks.ts:L126-L143
  - symbol: EventsReportGraphProps
    kind: type
    at: 'apps/platform/features/_reports/tabs/events/events-report.types.ts:L7-L17'
  - symbol: parseReportEventsToCSV
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/events.report.download.ts:L51-L60
---

<!-- context:generated:start -->

## Summary

Redux selectors, hooks, and types orchestrating event data fetching, filtering, and aggregation for the events report tab. Supports multiple visualization modes (evolution time-series, grouped by flag/RFMO), port statistics with pagination and search, vessel event counts with related dataset tracking, and dynamic query parameter building incorporating spatial buffering and multi-dataview deduplication.

## Related

- depends on [[analytics-and-navigation]] — EventReportPorts uses trackEvent for analytics, useReplaceQueryParams for URL sync, and useDataviewInstancesConnect for filter modifications
- uses [[analytics-tracking]] — EventsReportDownload and EventsReportGraphSelector track user actions (download, graph type selection) via trackEvent with category Analysis
- uses [[event-type-hierarchical-csv-schema]] — parseReportEventsToCSV delegates CSV transformation to objectArrayToCSV with event-type-specific column configs (BASE, ENCOUNTER, PORT_VISIT); EventsReportDownload uses this to export filtered events
- depends on [[redux-report-state]] — All components query selectTimeRange, selectReportAreaName, selectReportEventsSubCategorySelector, selectEventsStatsDataGrouped from reports domain to drive filtering and rendering
- uses [[report-data-fetching-hooks]] — EventsReport uses useGetReportEventsStatsQuery and useGetReportEventsVesselsQuery; EventsReportGraphEvolution and EventsReportGraphGrouped use useFetchEventReportGraphEvents to fetch detailed individual events
- uses [[report-hash-and-url-sync]] — EventsReport integrates useReportHash for state tracking; EventsReportDownload and EventsReportGraphSelector use useReplaceQueryParams to persist user selections to URL
- depends on [[report-time-series-visualization-subsystem]] — EventsReportGraph queries aggregated stats and event types from Redux, conditionally renders EventsReportGraphEvolution or EventsReportGraphGrouped based on visualization mode

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
