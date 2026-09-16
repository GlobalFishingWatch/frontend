---
name: Spatial geometry and buffer operations
slug: spatial-geometry-and-buffer-operations
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/report-area/area-reports.buffer.selectors.ts
    hash: f9ab53669b8403ef18ec533e10397625c28595bad856767e013ec88139711fe0
  - path: apps/platform/features/_reports/report-area/area-reports.config.ts
    hash: 79c4ed6193c4f2a2a11d56287b27517200ca9aa67d378a05675c93be0bb02bb7
  - path: apps/platform/features/_reports/report-area/area-reports.selectors.ts
    hash: 99ee343c7a353f7c24c3a615d048b0e4f459e7ef44b07e52406c8cc37a479df3
  - path: apps/platform/features/_reports/report-area/area-reports.utils.ts
    hash: bcb9374f504856975ff6f8d3c596e095528703a48e6ffce008b481cc1d3e45e2
  - path: apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx
    hash: 842271ab176b14d640df65cde753e0b7dc808ba3d486ed73c47aba1de8ca16c7
sources_digest: 16bd48a9725e81d06562d87d43502ee9c691a38a5c6e36bbebcf9811889eb72c
links:
  - to: area-reports-system-core-logic-selectors
    relation: implements
    description: >-
      Buffer configuration and operations are core to area report geometry
      selection and vessel filtering
generator:
  version: 1
covers:
  - symbol: LastReportStorage
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.config.ts:L14-L14'
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
  - symbol: BufferButonTooltipProps
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L27-L37
  - symbol: BufferButtonTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L43-L186
  - symbol: handleInputChange
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L77-L83
---

<!-- context:generated:start -->

## Summary

Cross-cutting concept: area report buffers (distance-based expansions of geographic boundaries) are computed via Turf.js with optional difference operations to exclude buffered zones. Buffer configuration is resolved via tiered fallback (URL query → workspace state → defaults) and independently selectable unit (nautical miles, kilometers) and operation (dissolve for expansion, difference for exclusion). Web Mercator clamping tolerances and antimeridian splitting are handled transparently.

## Related

- implements [[area-reports-system-core-logic-selectors]] — Buffer configuration and operations are core to area report geometry selection and vessel filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
