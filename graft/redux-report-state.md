---
name: Redux Report State
slug: redux-report-state
type: concept
sources:
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
  - path: apps/platform/features/_reports/tabs/others/ReportOthers.tsx
    hash: 833324f55f4ca4b642a881b66d6a4d231389d6c6998115a49cea115a6a0bb63f
  - path: apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx
    hash: 310c7dd5a77101ec492366da3b7cb1c43d6453c2583a67253665a87b9b552dc0
  - path: apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsights.tsx
    hash: 23eb0a99e4e118ddbdbf5ea5d70adffcf29681e7d782e17fed5919685cdcdb92
sources_digest: 71cc20502a82977e1e90687c4b15a43bdf4db88c9be536e2820c5ce04a363d3d
links:
  - to: events-report-system
    relation: configures
    description: >-
      Report state selectors configure which event types to display, time range
      filtering, graph visualization mode, and dataset availability constraints
  - to: report-others-tab-system
    relation: configures
    description: >-
      Redux selectors route dataviews to correct graph components (polygon,
      point, environment) and provide time range/area context
  - to: vessel-group-report-insights-system
    relation: configures
    description: >-
      selectVGRData, selectFetchVesselGroupReportXxxParams provide vessel group
      context and API request parameters for each insight type
generator:
  version: 1
covers:
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
  - symbol: ReportOthers
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportOthers.tsx:L27-L112'
  - symbol: ReportPointsGraph
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L29-L157'
  - symbol: onSelectAggregatedProperty
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L65-L70'
  - symbol: onClearSelection
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L71-L73'
  - symbol: VesselGroupReportInsights
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsights.tsx:L25-L76
---

<!-- context:generated:start -->

## Summary

Centralized Redux store manages report context: workspace domain stores selectTimeRange, selectActiveDataviews; reports domain stores selectReportAreaName, selectReportEventsSubCategorySelector, selectEventsStatsDataGrouped, selectReportEventsGraph, selectIsGlobalReport, selectVGRVesselDatasetsWithoutEventsRelated. Early bailouts prevent rendering when required state is missing (e.g., vessel datasets, unsupported event datasets). Time-range validity checked via getDownloadReportSupported before loading vessel data.

## Related

- configures [[events-report-system]] — Report state selectors configure which event types to display, time range filtering, graph visualization mode, and dataset availability constraints
- configures [[report-others-tab-system]] — Redux selectors route dataviews to correct graph components (polygon, point, environment) and provide time range/area context
- configures [[vessel-group-report-insights-system]] — selectVGRData, selectFetchVesselGroupReportXxxParams provide vessel group context and API request parameters for each insight type

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
