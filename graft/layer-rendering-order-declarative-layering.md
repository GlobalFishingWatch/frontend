---
name: Layer Rendering Order & Declarative Layering
slug: layer-rendering-order-declarative-layering
type: concept
sources:
  - path: libs/timebar/src/charts/charts-store.atom.ts
    hash: 513e522a705905fef04828dac4f0cd86b294ed9c1e2bf35d5e07d50a0b1cabdd
sources_digest: 2c5f2cca3771b42d8bde38eb8d6b2843c7659a134bb0e15d392f6e7e30e48440
links:
  - to: timebar-chart-state-management
    relation: implements
    description: activeChartLayersState applies LAYER_ORDER when aggregating layers
generator:
  version: 1
covers:
  - symbol: ChartState
    kind: type
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L8-L8'
  - symbol: selectActiveCharts
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L14-L15'
  - symbol: activeChartsEqual
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L17-L21'
  - symbol: selectLayers
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L27-L28'
  - symbol: layersEqual
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L30-L31'
  - symbol: selectAnyLoading
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L35-L36'
  - symbol: useUpdateChartsData
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L40-L54'
  - symbol: useUpdateChartLayers
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.ts:L56-L70'
---

<!-- context:generated:start -->

## Summary

Timebar charts define a fixed rendering precedence via LAYER_ORDER array (tracksGraphs → activity → tracks → tracksEvents) to ensure visual layering consistency. activeChartLayersState applies this ordering when flattening layers from multiple chart types, decoupling from call order and providing deterministic z-order semantics.

## Related

- implements [[timebar-chart-state-management]] — activeChartLayersState applies LAYER_ORDER when aggregating layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
