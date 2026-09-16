---
name: Timebar Activity Hook
slug: timebar-activity-hook
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts
    hash: 8a2709a07046ea8586dbb40af38cf448d53b86fe4fd6cb37f6e2160552096348
sources_digest: f232269921fb082319d3a5e50383d6b8c1eac174fa97ee8eb72b890821411068
links:
  - to: deckgl-layer-integration
    relation: depends_on
    description: >-
      Uses useGetDeckLayer, getFourwingsChunk, getSublayersVisibleValuesHash,
      isMultiHueColorRampId from deck-layer-composer
  - to: timebar-activity-component
    relation: produces
    description: >-
      Hook exports useHeatmapActivityGraph, consumed by TimebarActivityGraph
      component to populate activity data and color scaling
  - to: timebar-utility-pipeline
    relation: uses
    description: >-
      Calls getGraphDataFromFourwingsHeatmap,
      getGraphDataFromFourwingsPositions, and getLegendColorScale to transform
      raw Fourwings data
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Selects selectTimebarSelectedDataviews, selectViewport,
      selectIsRealTimeMode for data source filtering and real-time mode
      detection
generator:
  version: 1
covers:
  - symbol: useHeatmapActivityGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L44-L162'
  - symbol: setFourwingsPositionsData
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L102-L111
  - symbol: setFourwingsHeatmapData
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L113-L127
---

<!-- context:generated:start -->

## Summary

React hook (useHeatmapActivityGraph) that orchestrates timebar activity data extraction from Fourwings layers, selecting between position and heatmap data paths based on visualizationMode Redux state. Manages color domain caching in lastLegendRampByLayer to persist legend scales across re-renders, handles real-time mode with special interval caching, and filters by viewport-selected dataviews. Returns loading status, timeseries frames, dataview metadata, and a numeric-to-RGBA color scaling function.

## Related

- depends on [[deckgl-layer-integration]] — Uses useGetDeckLayer, getFourwingsChunk, getSublayersVisibleValuesHash, isMultiHueColorRampId from deck-layer-composer
- produces [[timebar-activity-component]] — Hook exports useHeatmapActivityGraph, consumed by TimebarActivityGraph component to populate activity data and color scaling
- uses [[timebar-utility-pipeline]] — Calls getGraphDataFromFourwingsHeatmap, getGraphDataFromFourwingsPositions, and getLegendColorScale to transform raw Fourwings data
- depends on [[workspace-redux-state]] — Selects selectTimebarSelectedDataviews, selectViewport, selectIsRealTimeMode for data source filtering and real-time mode detection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
