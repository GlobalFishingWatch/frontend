---
name: Report Others Tab System
slug: report-others-tab-system
type: system
sources:
  - path: apps/platform/features/_reports/tabs/others/ReportOthers.tsx
    hash: 833324f55f4ca4b642a881b66d6a4d231389d6c6998115a49cea115a6a0bb63f
  - path: apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx
    hash: 310c7dd5a77101ec492366da3b7cb1c43d6453c2583a67253665a87b9b552dc0
  - path: apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx
    hash: 5ef6716401366f3e39894da71965cac95d3c121704dd7f3d9a6f405f36521947
  - path: apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx
    hash: 7f1c1500e0fa605bc18ce5328699ebe763145934bf0cca39c59018fd3e52eb35
  - path: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts
    hash: 94ac0b2465c4c6eceaadf829cbee7cb456ef5a859650bb3cecb615cbe5dd6b29
  - path: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts
    hash: d9b25331ccb076846a8614dd9d8a83d5f666eaf175136d59ea2c7c2cbb58b1ed
  - path: apps/platform/features/_reports/tabs/others/ReportSublayerValues.tsx
    hash: 21ffbad570e610ecd8b50deb0f874b6b4f7c608506186a0b2b383296e9adcb51
sources_digest: 86d3b8011d83e9e017d0f40386136885b869ec80d8cfa1b9add4d6fe151ab322
links:
  - to: context-layer-interaction
    relation: uses
    description: >-
      ReportPolygonsGraph uses context layer setHighlightedFeatures to enable
      mouse-over highlighting of polygon geometries without full geometry copies
      in state
  - to: point-aggregation-and-filtering
    relation: implements
    description: >-
      ReportPointsGraph renders numeric filter selector and time-series charts;
      pointsFeaturesToTimeseries and getPointsTimeseries utils extract temporal
      data from GeoJSON features filtered by time windows
  - to: polygon-containment-and-overlap-metrics
    relation: implements
    description: >-
      ReportPolygonsGraph and ReportPolygonsEvolution visualize min (contained)
      vs max (overlapping) polygon counts per time bin; counts computed by
      isPolygonInBin and countBySublayer in polygons timeseries utils
  - to: redux-report-state
    relation: depends_on
    description: >-
      ReportOthers queries selectOthersActiveReportDataviewsGrouped, time range,
      and report area state; ReportPointsGraph uses useTimeseriesStats and
      dataview instance state
generator:
  version: 1
covers:
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
  - symbol: PolygonsEvolutionTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx:L24-L64
  - symbol: ReportPolygonsEvolution
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx:L66-L180
  - symbol: formatArea
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx:L31-L35
  - symbol: ReportPolygonsGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx:L37-L184
  - symbol: ReportSublayerValuesProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/ReportSublayerValues.tsx:L7-L10
  - symbol: ReportSublayerValues
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportSublayerValues.tsx:L12-L33
  - symbol: PointsFeaturesToTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L18-L26
  - symbol: pointsFeaturesToTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L28-L71
  - symbol: GetPointsTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L73-L76
  - symbol: getPointsTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L78-L108
  - symbol: getPointsTimeseriesStats
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L110-L146
  - symbol: generateTimeBins
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L13-L36
  - symbol: toMs
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L38-L41
  - symbol: isPolygonInBin
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L43-L55
  - symbol: countBySublayer
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L57-L78
  - symbol: GetPolygonsTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L80-L83
  - symbol: getEmptyPolygonsTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L85-L91
  - symbol: getPolygonsTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts:L93-L136
---

<!-- context:generated:start -->

## Summary

Renders non-report-area dataview analysis (polygons, points, heatmaps) with time-series visualizations. Orchestrates data selection, filtering, and component dispatch based on dataview type; includes polygon containment/overlap metrics, point aggregation selectors, and environment heatmap visualization.

## Related

- uses [[context-layer-interaction]] — ReportPolygonsGraph uses context layer setHighlightedFeatures to enable mouse-over highlighting of polygon geometries without full geometry copies in state
- implements [[point-aggregation-and-filtering]] — ReportPointsGraph renders numeric filter selector and time-series charts; pointsFeaturesToTimeseries and getPointsTimeseries utils extract temporal data from GeoJSON features filtered by time windows
- implements [[polygon-containment-and-overlap-metrics]] — ReportPolygonsGraph and ReportPolygonsEvolution visualize min (contained) vs max (overlapping) polygon counts per time bin; counts computed by isPolygonInBin and countBySublayer in polygons timeseries utils
- depends on [[redux-report-state]] — ReportOthers queries selectOthersActiveReportDataviewsGrouped, time range, and report area state; ReportPointsGraph uses useTimeseriesStats and dataview instance state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
