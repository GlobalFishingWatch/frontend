---
name: Spatial Geometry Assumptions
slug: spatial-geometry-assumptions
type: concept
sources:
  - path: apps/platform/features/_reports/reports-geo.utils.ts
    hash: 0b2dbce1e431cd5aa5da922fee2b952aeb0e05947f64ad2768095ae2152c41a8
  - path: apps/platform/features/_reports/reports-hotspot.utils.ts
    hash: 4b893a7878831825eebd38217c27752ddab28cce794f8da638130ef8f4979f06
  - path: apps/platform/features/_reports/reports-timeseries.utils.ts
    hash: bcf24bfb02260558b34645c4f8439b46ad3e61bed21cd2222ead42cdb7763272
sources_digest: 7ae7048e0bb072ac7bbbe3544cd321ce2e42dfb176af1ea42c5a41fe796ef004
links:
  - to: geospatial-filtering-worker
    relation: implements
    description: >-
      Enforces FourwingsFeature coordinate structure and antimeridian bbox
      normalization in filtering logic
  - to: hotspot-computation
    relation: implements
    description: >-
      Assumes FourwingsFeature corners and applies ellipse aspect ratio
      constraints
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
---

<!-- context:generated:start -->

## Summary

Underlying constraints in geospatial filtering: FourwingsFeature coordinates as eight-element arrays representing opposite corners, antimeridian bbox unwrapping required for Turf validity, contained polygons skip expensive clipping ops while overlapping ones are clipped first to prevent area overstatement, and ellipse aspect ratio capped to prevent degenerate shapes.

## Related

- implements [[geospatial-filtering-worker]] — Enforces FourwingsFeature coordinate structure and antimeridian bbox normalization in filtering logic
- implements [[hotspot-computation]] — Assumes FourwingsFeature corners and applies ellipse aspect ratio constraints

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
