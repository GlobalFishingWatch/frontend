---
name: Geospatial Filtering Worker
slug: geospatial-filtering-worker
type: system
sources:
  - path: apps/platform/features/_reports/reports-geo.utils.ts
    hash: 0b2dbce1e431cd5aa5da922fee2b952aeb0e05947f64ad2768095ae2152c41a8
  - path: apps/platform/features/_reports/reports-geo.utils.workers.hooks.ts
    hash: 592c7c4fdd357b33988597bc98d693dd25f118933d26a2d7d505d5619023c686
  - path: apps/platform/features/_reports/reports-geo.utils.workers.ts
    hash: 4ff3a28d9d65dfb5628d3a30121dd22923cf9548404f47c825ac029239631e96
sources_digest: fb4d93342fd0693628ec909cb7ca5facbb27579b486f3a61115fdc58171319b8
links:
  - to: report-timeseries-pipeline
    relation: implements
    description: >-
      Provides spatial filtering capability consumed by timeseries computation
      to partition features
generator:
  version: 1
covers:
  - symbol: getAreaKm2
    kind: function
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L17-L28'
  - symbol: FilteredPolygons
    kind: type
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L30-L35'
  - symbol: isCellInPolygon
    kind: function
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L37-L45'
  - symbol: FilterByPolygonMode
    kind: type
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L47-L47'
  - symbol: FilterByPolygomParams
    kind: type
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L48-L53'
  - symbol: filterByPolygon
    kind: function
    at: 'apps/platform/features/_reports/reports-geo.utils.ts:L54-L161'
  - symbol: useFilterCellsByPolygonWorker
    kind: function
    at: 'apps/platform/features/_reports/reports-geo.utils.workers.hooks.ts:L11-L13'
---

<!-- context:generated:start -->

## Summary

Web Worker infrastructure for polygon-based spatial filtering of geographic features, enabling off-main-thread processing of cell containment/overlap detection. Bridges Fourwings cells and GeoJSON features against query polygons with four filtering modes (cell corners, cell center, points, polygons).

## Related

- implements [[report-timeseries-pipeline]] — Provides spatial filtering capability consumed by timeseries computation to partition features

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
