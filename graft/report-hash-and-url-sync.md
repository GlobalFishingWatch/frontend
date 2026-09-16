---
name: Report Hash and URL Sync
slug: report-hash-and-url-sync
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReport.tsx
    hash: cb0371fdc000ad2fee2daae9bcbbf1fe278968c9a1d2a487b38a7bab48520739
  - path: apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx
    hash: a663c804f82a80aea802661719b42db62df2447a6fba7580730ce6f5f631aaed
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx
    hash: 66a78bd90d4fb856784e4106c2023a526e07f0539619325a4ff6931a2ce3e7b8
  - path: >-
      apps/platform/features/_reports/tabs/events/EventsReportSubsectionSelector.tsx
    hash: d55d4f70b02b04861819c960a4de33b4788ca2b7d88d108fe222dbd6c0394441
sources_digest: 4b971c1306c042954da28691a94ee460548b06fa4f2fc68308954a4806ff902b
links:
  - to: events-report-system
    relation: implements
    description: >-
      EventsReport uses useReportHash for state tracking; EventsReportDownload
      and selector components use useReplaceQueryParams to persist user
      selections
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
---

<!-- context:generated:start -->

## Summary

Cross-cutting concern ensuring URL query parameters stay synchronized with user selections: useReportHash tracks report state changes for dirty detection; useReplaceQueryParams persists selections (graph type, event subsection, point aggregation property) to URL on change. Enables browser back/forward navigation and shareable report links while coordinating with useFitAreaInViewport for viewport adjustments on graph type changes.

## Related

- implements [[events-report-system]] — EventsReport uses useReportHash for state tracking; EventsReportDownload and selector components use useReplaceQueryParams to persist user selections

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
