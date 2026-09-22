---
name: Report Data Fetching Hooks
slug: report-data-fetching-hooks
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReport.tsx
    hash: cb0371fdc000ad2fee2daae9bcbbf1fe278968c9a1d2a487b38a7bab48520739
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx
    hash: 4805bf432091cf529f6f74faec37e00f550c317cb54a95495b1ac4cb5ba8b8ea
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx
    hash: f11fc428070f7734718e17c17f777898db7a2133c6a9aaf2b2f2797acaa9170f
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx
    hash: 823d3e9c9c32f6dd5426a7111b98849139f6c8f345b0a664beb57a75a1fa1ad9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx
    hash: 448b6932910e79a3730f28cf48a1ce5470c2ed176e33e5485ad6f3eed7e5f971
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselEvents.tsx
    hash: 474144c2adaf390047e8b094ce7a2402f7630ed6e84a270503f81733abd1db68
sources_digest: 30392bf5830fdc287afafe738c8a373d43336261adba103cad0682bcba9a3d23
links:
  - to: events-report-system
    relation: implements
    description: >-
      EventsReport, EventsReportGraphEvolution, EventsReportGraphGrouped use
      these hooks to fetch stats and individual events for visualization and
      export
  - to: vessel-group-report-insights-system
    relation: implements
    description: >-
      Insight components (VGRInsightLongline, VGRInsightVesselEvents) use
      useGetVesselEventsQuery and useGetVesselGroupInsightQuery to populate
      filtered event lists and drill-down details
generator:
  version: 1
covers:
  - symbol: EventsReport
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventsReport.tsx:L46-L219'
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
  - symbol: VesselGroupReportInsightFishing
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L37-L226
  - symbol: onMPAToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L53-L67
  - symbol: onRFMOToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L69-L83
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L85-L91
  - symbol: getVesselGroupReportInsighFishingVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L93-L155
  - symbol: VesselWithEvents
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L32-L37
  - symbol: getVesselsWithEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L39-L51
  - symbol: VesselGroupReportInsightLongline
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L53-L191
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L78-L87
  - symbol: onCategoryToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L89-L98
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L100-L106
  - symbol: renderCategoryVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L108-L153
  - symbol: VesselGroupReportInsightVesselEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselEvents.tsx:L12-L63
---

<!-- context:generated:start -->

## Summary

Custom hooks orchestrate report data fetching: useGetReportEventsStatsQuery and useGetReportEventsVesselsQuery fetch aggregated event statistics; useFetchEventReportGraphEvents lazily loads individual event records with optional include filters; useGetVesselGroupInsightQuery fetches insight data (gaps, flag changes, IUU, MOU, etc.); useGetVesselEventsQuery retrieves vessel-specific events filtered by dataset. Hooks manage loading states, error boundaries, and conditional skip logic to avoid unnecessary API calls.

## Related

- implements [[events-report-system]] — EventsReport, EventsReportGraphEvolution, EventsReportGraphGrouped use these hooks to fetch stats and individual events for visualization and export
- implements [[vessel-group-report-insights-system]] — Insight components (VGRInsightLongline, VGRInsightVesselEvents) use useGetVesselEventsQuery and useGetVesselGroupInsightQuery to populate filtered event lists and drill-down details

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
