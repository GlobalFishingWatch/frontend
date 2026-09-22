---
name: Report locale and metadata formatting
slug: report-locale-and-metadata-formatting
type: concept
sources:
  - path: apps/platform/features/_reports/report-area/area-reports.hooks.tsx
    hash: 70313011499e2c852403577fad78104cc4a1551c8762ebc855e31edbdca6c80e
  - path: apps/platform/features/_reports/report-area/area-reports.utils.ts
    hash: bcb9374f504856975ff6f8d3c596e095528703a48e6ffce008b481cc1d3e45e2
  - path: apps/platform/features/_reports/report-area/title/report-title.utils.tsx
    hash: 7151c0695b237ea96d09b09d19708c75f064f6dff8acd574e3fb9560928f8ed5
sources_digest: 8a1932c9aa0273264250dda6590741b5428f5b37d9fadfba579a753d10da28d2
links:
  - to: area-report-ui-components
    relation: implements
    description: >-
      Report title generation and metadata display depend on locale-aware
      parsing and formatting utilities
generator:
  version: 1
covers:
  - symbol: DateTimeSeries
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L83-L86'
  - symbol: isClose
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L92-L95'
  - symbol: useReportAreaCenter
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L97-L112
  - symbol: useStatsBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L114-L147
  - symbol: useVesselGroupActivityBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L149-L153
  - symbol: useVesselGroupBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L155-L159
  - symbol: usePortsReportAreaFootprint
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L161-L176
  - symbol: usePortsReportAreaFootprintBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L178-L187
  - symbol: useReportAreaBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L189-L245
  - symbol: isAreaCenterInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L247-L267
  - symbol: useReportAreaInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L269-L275
  - symbol: useFitAreaInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L277-L307
  - symbol: getSimplificationByDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L315-L317
  - symbol: useFetchReportArea
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L319-L350
  - symbol: useFetchReportVessel
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L352-L427
  - symbol: usePortsReportAreaFootprintFitBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L429-L439
  - symbol: useReportTitle
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L441-L558
  - symbol: tickFormatter
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L55-L60'
  - symbol: formatDate
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L62-L82'
  - symbol: formatTooltipValue
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L84-L91'
  - symbol: BufferedAreaParams
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L93-L99'
  - symbol: getBufferedFeature
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L102-L143
  - symbol: getBufferedArea
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L146-L168
  - symbol: getBufferedAreaBbox
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L170-L185
  - symbol: parseReportUrl
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L187-L196
  - symbol: normalizeVesselProperties
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L198-L213
  - symbol: getVesselsFiltered
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L217-L277
  - symbol: getReportAreaStringByLocale
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/report-title.utils.tsx:L5-L26
---

<!-- context:generated:start -->

## Summary

Cross-cutting concept: Report name and description fields may be stored as JSON-encoded locale maps (e.g., {"en": "...", "es": "..."}) or plain strings, requiring flexible parsing. Utility functions parse these formats with fallback to plain string if JSON fails, and selectors can extract locale-specific versions based on user language preference. Metadata formatting standardizes vessel properties (ship name, gear types, flag) and time/numeric presentation.

## Related

- implements [[area-report-ui-components]] — Report title generation and metadata display depend on locale-aware parsing and formatting utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
