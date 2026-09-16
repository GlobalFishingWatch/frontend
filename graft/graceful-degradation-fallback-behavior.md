---
name: Graceful Degradation & Fallback Behavior
slug: graceful-degradation-fallback-behavior
type: concept
sources:
  - path: apps/platform/features/_reports/report-port/PortsReportLink.tsx
    hash: 7c005ad01343f1e065e7c3dad56afeef323c97d6bb883b5e22a01b7c86b227ea
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportError.tsx
    hash: 3f10ec815f2feaee809b6f416e032365697c0107d32d6b2545e4a32bcef2042d
  - path: apps/platform/features/_reports/reports-timeseries.utils.ts
    hash: bcf24bfb02260558b34645c4f8439b46ad3e61bed21cd2222ead42cdb7763272
  - path: apps/platform/features/_reports/reports.selectors.ts
    hash: d0e84334b3d56d9959e7915bee4744ffacf8a21360f788148a7f0b5e08ddd19d
  - path: apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx
    hash: 5a041bb51614838b5b90009e8eaf9baec72483e0aba0b69e1f603643b8e1bbe3
sources_digest: 8fcb721d542258148f287bfcbffc74dde96dceb1b28d7c0e1839db0cfc5e346b
links:
  - to: report-state-configuration
    relation: implements
    description: >-
      Encapsulates fallback logic to handle missing or invalid selections across
      ~20 selectors
  - to: report-timeseries-pipeline
    relation: implements
    description: Gracefully degrades on geometry errors and returns partial stats
generator:
  version: 1
covers:
  - symbol: PortsReportLinkProps
    kind: type
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L26-L30'
  - symbol: PortsReportLink
    kind: function
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L32-L90'
  - symbol: VesselGroupReportError
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportError.tsx:L12-L57
  - symbol: ReportFourwingsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L43-L43'
  - symbol: ReportPointsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L44-L44'
  - symbol: ReportPolygonsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L45-L45'
  - symbol: ReportDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L46-L47'
  - symbol: GetTimeseriesParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L49-L52'
  - symbol: isInstanceOfPointsLayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L54-L56'
  - symbol: isInstanceOfPolygonLayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L58-L60'
  - symbol: GetPolygonsStatsParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L64-L70'
  - symbol: getFeatureCount
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L77-L80'
  - symbol: getFeaturesCount
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L82-L84'
  - symbol: getCountsBySublayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L86-L96'
  - symbol: getPolygonsTimeseriesStats
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L98-L241'
  - symbol: addTopArea
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L147-L160'
  - symbol: getTimeseries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L243-L269'
  - symbol: GetTimeseriesStatsParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L271-L275'
  - symbol: getTimeseriesStats
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L277-L320'
  - symbol: filterTimeseriesByTimerange
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L322-L347'
  - symbol: getItemLabel
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L22-L28
  - symbol: AreaReportSearch
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L30-L143
  - symbol: updateMatchingAreas
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L39-L50
  - symbol: onInputChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L52-L60
  - symbol: onSelectResult
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L62-L75
  - symbol: onInputBlur
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L87-L93
  - symbol: handleKeyDown
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L97-L105
---

<!-- context:generated:start -->

## Summary

Defensive pattern ensuring UI stability when data or context is missing: components render children as plain text rather than broken links, error components return null if not in error state, selectors automatically promote first available option on invalid selections, and geometry errors log warnings and return partial stats.

## Related

- implements [[report-state-configuration]] — Encapsulates fallback logic to handle missing or invalid selections across ~20 selectors
- implements [[report-timeseries-pipeline]] — Gracefully degrades on geometry errors and returns partial stats

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
