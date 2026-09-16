---
name: Context Layer Interaction
slug: context-layer-interaction
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx
    hash: 7f1c1500e0fa605bc18ce5328699ebe763145934bf0cca39c59018fd3e52eb35
sources_digest: 0e7a332d204d244df4cf3ee555ca789b8bae28b4bf64c973a62161df440f6317
links:
  - to: report-others-tab-system
    relation: implements
    description: >-
      ReportPolygonsGraph's highlightArea callback uses context layer to enable
      hover-based feature highlighting without state-based geometry storage
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
---

<!-- context:generated:start -->

## Summary

Enables mouse-over highlighting of geospatial features (polygons) via context layer's setHighlightedFeatures method without maintaining full geometry copies in component state. Used by ReportPolygonsGraph to highlight polygon geometries on hover, improving interactivity while keeping memory footprint low and avoiding full re-renders of large feature sets.

## Related

- implements [[report-others-tab-system]] — ReportPolygonsGraph's highlightArea callback uses context layer to enable hover-based feature highlighting without state-based geometry storage

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
