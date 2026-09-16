---
name: Hotspot Computation
slug: hotspot-computation
type: system
sources:
  - path: apps/platform/features/_reports/reports-hotspot.hooks.ts
    hash: 5b6b5961a125533fee35e458802b0e2343a2c0aff9dc2cef45beba6029343b26
  - path: apps/platform/features/_reports/reports-hotspot.utils.ts
    hash: 4b893a7878831825eebd38217c27752ddab28cce794f8da638130ef8f4979f06
sources_digest: 91f5ca02f333373318feb4b79df26b87302aafade05adf2043f0b297e87e3cc4
links:
  - to: report-timeseries-pipeline
    relation: uses
    description: >-
      Subscribes to filtered features and loading state to trigger geometry
      computation when inputs change
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads hotspot settings (enabled, area, unit) from Redux and updates via
      dispatch
generator:
  version: 1
covers:
  - symbol: useComputeReportHotspot
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.hooks.ts:L22-L50'
  - symbol: useHotspotSettings
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.hooks.ts:L53-L80'
  - symbol: CellEntry
    kind: type
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L16-L16'
  - symbol: EllipseParams
    kind: type
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L21-L29'
  - symbol: formatArea
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L31-L35'
  - symbol: circularWindowSweep
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L39-L63'
  - symbol: computeEllipseParams
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L68-L122'
  - symbol: buildEllipsePolygon
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L124-L139'
  - symbol: cellsInsideEllipse
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L141-L151'
  - symbol: HotspotProperties
    kind: type
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L153-L158'
  - symbol: computeHotspotGeometry
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.utils.ts:L160-L209'
---

<!-- context:generated:start -->

## Summary

Computes activity hotspot geometry by identifying dense cell clusters via KDBush spatial indexing, fitting activity-weighted ellipses via PCA, and generating GeoJSON features with area/contribution metadata. Bridges deck layer abstractions with report UI.

## Related

- uses [[report-timeseries-pipeline]] — Subscribes to filtered features and loading state to trigger geometry computation when inputs change
- depends on [[workspace-routing-state]] — Reads hotspot settings (enabled, area, unit) from Redux and updates via dispatch

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
