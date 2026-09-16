---
name: Area reports system (core logic & selectors)
slug: area-reports-system-core-logic-selectors
type: system
sources:
  - path: >-
      apps/platform/features/_reports/report-area/area-reports.buffer.selectors.ts
    hash: f9ab53669b8403ef18ec533e10397625c28595bad856767e013ec88139711fe0
  - path: apps/platform/features/_reports/report-area/area-reports.config.ts
    hash: 79c4ed6193c4f2a2a11d56287b27517200ca9aa67d378a05675c93be0bb02bb7
  - path: apps/platform/features/_reports/report-area/area-reports.hooks.tsx
    hash: 70313011499e2c852403577fad78104cc4a1551c8762ebc855e31edbdca6c80e
  - path: apps/platform/features/_reports/report-area/area-reports.selectors.ts
    hash: 99ee343c7a353f7c24c3a615d048b0e4f459e7ef44b07e52406c8cc37a479df3
  - path: apps/platform/features/_reports/report-area/area-reports.utils.ts
    hash: bcb9374f504856975ff6f8d3c596e095528703a48e6ffce008b481cc1d3e45e2
sources_digest: 676831e12468e766a233c07f2d6612f545e877e1a54ee39631a926ae670e8c0c
links:
  - to: area-report-ui-components
    relation: implements
    description: >-
      Provides selectors, hooks, and utilities consumed by AreaReport,
      ReportTitle, and BufferButtonTooltip components
  - to: report-activity-and-vessel-data
    relation: depends_on
    description: >-
      Integrates activity data from reports-activity.slice; uses geospatial
      filtering on vessel positions
  - to: spatial-geometry-and-buffer-operations
    relation: uses
    description: >-
      Wraps Turf.js operations via data-transforms for buffering, bounding box,
      and geometry calculations
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: depends_on
    description: >-
      Reads workspace configuration, viewport, and time ranges from workspace
      selectors
generator:
  version: 1
covers:
  - symbol: LastReportStorage
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.config.ts:L14-L14'
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
  - symbol: ReportVesselWithMeta
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L70-L79
  - symbol: ReportVesselWithDatasets
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L81-L91
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
---

<!-- context:generated:start -->

## Summary

Redux selectors, hooks, and utilities managing area-based geographic reporting—filtering vessels by gear type and dataset, computing buffered boundaries, resolving area geometry with spatial operations, and synthesizing report titles with localization. Coordinates with map viewport for bounds fitting, integrates time-range filtering, and supports both user-drawn and system-provided areas (global, EEZ, MPA, FAO, RFMO). Deliberately splits buffer configuration into separate module to avoid bundling heavy dependencies (deck-layers, turf) into MainNav.

## Related

- implements [[area-report-ui-components]] — Provides selectors, hooks, and utilities consumed by AreaReport, ReportTitle, and BufferButtonTooltip components
- depends on [[report-activity-and-vessel-data]] — Integrates activity data from reports-activity.slice; uses geospatial filtering on vessel positions
- uses [[spatial-geometry-and-buffer-operations]] — Wraps Turf.js operations via data-transforms for buffering, bounding box, and geometry calculations
- depends on [[workspace-state-orchestration-redux-slice-selectors]] — Reads workspace configuration, viewport, and time ranges from workspace selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
