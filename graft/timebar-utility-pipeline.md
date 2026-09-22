---
name: Timebar Utility Pipeline
slug: timebar-utility-pipeline
type: system
sources:
  - path: apps/platform/features/_map/timebar/timebar.utils.ts
    hash: 3846750cc6af659c631c04a440d6e512cbba3b65fd3d0e40bfb3a53fe93b6176
sources_digest: 91dd7fcf17fb67fcf5f7850d42a8ce7292195b1df213c920299bb7318379f162
links:
  - to: time-range-management
    relation: depends_on
    description: >-
      Utilities rely on deck-layers getFeatureTimeRange and
      getDateInIntervalResolution for time boundary normalization
  - to: timebar-activity-hook
    relation: produces
    description: >-
      timebar.utils exports getGraphDataFromFourwingsHeatmap,
      getGraphDataFromFourwingsPositions, getGraphDataFromPoints, and
      getLegendColorScale; consumed directly by useHeatmapActivityGraph
  - to: timebar-cluster-events-hook
    relation: produces
    description: >-
      getGraphDataFromFourwingsPositions is consumed by useClusterEventsGraph
      for transforming cluster features
generator:
  version: 1
covers:
  - symbol: GetGraphDataFromFourwingsFeaturesParams
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L26-L35'
  - symbol: FeatureDates
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L37-L37'
  - symbol: getDatesPopulated
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L38-L87'
  - symbol: getGraphDataFromFourwingsPositions
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L89-L119'
  - symbol: getGraphDataFromPoints
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L121-L247'
  - symbol: findOverlappingIndex
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L154-L192'
  - symbol: getGraphDataFromFourwingsHeatmap
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L249-L395'
  - symbol: getLegendColorScale
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.utils.ts:L397-L404'
---

<!-- context:generated:start -->

## Summary

Transforms geospatial Fourwings and GeoJSON features into time-series ActivityTimeseriesFrame data for timebar visualization. Bridges deck.gl loaders, d3 color scaling, and luxon datetime arithmetic to support three feature converters: positions (binned by stime/value/layer), points (GeoJSON with configurable time boundaries), and heatmaps (with tile buffering, velocity aggregation, and comparison periods). Uses binary search for date overlap detection and manual extent insertion to force zero-valued edges at sublayer boundaries.

## Related

- depends on [[time-range-management]] — Utilities rely on deck-layers getFeatureTimeRange and getDateInIntervalResolution for time boundary normalization
- produces [[timebar-activity-hook]] — timebar.utils exports getGraphDataFromFourwingsHeatmap, getGraphDataFromFourwingsPositions, getGraphDataFromPoints, and getLegendColorScale; consumed directly by useHeatmapActivityGraph
- produces [[timebar-cluster-events-hook]] — getGraphDataFromFourwingsPositions is consumed by useClusterEventsGraph for transforming cluster features

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
