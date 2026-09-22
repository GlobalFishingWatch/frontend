---
name: Timebar Cluster Events Hook
slug: timebar-cluster-events-hook
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarClusterEventsGraph.hooks.ts
    hash: 6f8cee4a0498746a678018ee30228552139496ec8e0689dc2d120709566d8475
sources_digest: e0f47ae1345509609a552ce60ab7fe26cd0f636b82f4e6916638fb3c6f34a7b0
links:
  - to: deckgl-layer-integration
    relation: depends_on
    description: >-
      Uses useGetDeckLayers, getFourwingsChunk, getAvailableIntervalsInDataviews
      from deck-layer-composer
  - to: timebar-cluster-events-component
    relation: produces
    description: >-
      Hook exports useClusterEventsGraph, consumed by TimebarClusterEventsGraph
      component
  - to: timebar-utility-pipeline
    relation: uses
    description: >-
      Calls getGraphDataFromFourwingsPositions to transform Fourwings point
      features into ActivityTimeseriesFrame
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Reads selectViewport, selectTimebarSelectedDataviews,
      selectIsRealTimeMode, selectRealTimeTimerange for data filtering
generator:
  version: 1
covers:
  - symbol: useClusterEventsGraph
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarClusterEventsGraph.hooks.ts:L27-L109
---

<!-- context:generated:start -->

## Summary

React hook (useClusterEventsGraph) that aggregates real-time cluster event activity from Fourwings deck layers for timebar visualization. Orchestrates data fetching by reading viewport, dataviews, and time range from Redux; retrieves cluster layers via useGetDeckLayers; computes chunk boundaries and available intervals; transforms raw features into ActivityTimeseriesFrame via getGraphDataFromFourwingsPositions. Caches chunk bounds at Fourwings boundaries and memoizes viewport hash to avoid redundant computation. Returns loading status and eventsActivity timeseries array.

## Related

- depends on [[deckgl-layer-integration]] — Uses useGetDeckLayers, getFourwingsChunk, getAvailableIntervalsInDataviews from deck-layer-composer
- produces [[timebar-cluster-events-component]] — Hook exports useClusterEventsGraph, consumed by TimebarClusterEventsGraph component
- uses [[timebar-utility-pipeline]] — Calls getGraphDataFromFourwingsPositions to transform Fourwings point features into ActivityTimeseriesFrame
- depends on [[workspace-redux-state]] — Reads selectViewport, selectTimebarSelectedDataviews, selectIsRealTimeMode, selectRealTimeTimerange for data filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
