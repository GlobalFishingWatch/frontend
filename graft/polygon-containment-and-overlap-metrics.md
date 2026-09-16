---
name: Polygon Containment and Overlap Metrics
slug: polygon-containment-and-overlap-metrics
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx
    hash: 7f1c1500e0fa605bc18ce5328699ebe763145934bf0cca39c59018fd3e52eb35
  - path: >-
      apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts
    hash: d9b25331ccb076846a8614dd9d8a83d5f666eaf175136d59ea2c7c2cbb58b1ed
sources_digest: 8364b5b0fa5d0ab2db33306bb39d08a029ab5c22f3604a87dbcca30224d518d2
links:
  - to: report-others-tab-system
    relation: implements
    description: >-
      ReportPolygonsEvolution uses this metric schema to plot dual-line
      visualization (solid for contained, dashed for overlapping) per sublayer
      with dynamic y-axis padding
generator:
  version: 1
covers:
  - symbol: formatArea
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx:L31-L35
  - symbol: ReportPolygonsGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx:L37-L184
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

Polygons are tracked as two metrics: 'contained' (min) for polygons fully within monitored region, 'overlapping' (max) for polygons with any intersection. Time binning generates per-interval counts via isPolygonInBin (checks temporal overlap) and countBySublayer (filters by layer), handling missing end times as infinity for open-ended ranges. Requires startTimeProperty and endTimeProperty from deck layer config to locate temporal metadata.

## Related

- implements [[report-others-tab-system]] — ReportPolygonsEvolution uses this metric schema to plot dual-line visualization (solid for contained, dashed for overlapping) per sublayer with dynamic y-axis padding

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
