---
name: Timebar Chart Hooks & Data Transformation
slug: timebar-chart-hooks-data-transformation
type: file
sources:
  - path: libs/timebar/src/charts/charts.hooks.ts
    hash: a314d205a9c73f7edabd31cccb2945c4dc9939eaf109662c21c5b35a6dc3f186
sources_digest: 760c2f9abcb1670f36c17d955d4066e59e390cc67fe990f46448148f70ea0735
links:
  - to: timebar-chart-types
    relation: depends_on
    description: Uses TimebarChartData and event-type sort order definitions
generator:
  version: 1
covers:
  - symbol: filterData
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L21-L41'
  - symbol: clusterData
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L45-L100'
  - symbol: useDelta
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L102-L106'
  - symbol: useOuterScale
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L108-L115'
  - symbol: useTimebarTimeOrigin
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L117-L120'
  - symbol: useClusteredChartData
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L122-L130'
  - symbol: sortChunksByType
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L141-L145'
  - symbol: sortDataByType
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L147-L154'
  - symbol: sortDataByTime
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L156-L165'
  - symbol: useSortedChartData
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L167-L172'
  - symbol: useTimeseriesToChartData
    kind: function
    at: 'libs/timebar/src/charts/charts.hooks.ts:L174-L208'
---

<!-- context:generated:start -->

## Summary

Provides hooks and utilities for timebar data processing: filterData removes chunks outside date ranges; clusterData aggregates nearby chunks (within MIN_DISTANCE_PX_TO_CLUSTER); useOuterScale maps outer timeline domain to pixel coordinates via d3.scaleTime; useClusteredChartData and useSortedChartData memoize transformed datasets; useTimeseriesToChartData converts activity frames into chart items with metadata and values.

## Related

- depends on [[timebar-chart-types]] — Uses TimebarChartData and event-type sort order definitions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
