---
name: Timebar Chart State Management
slug: timebar-chart-state-management
type: system
sources:
  - path: libs/timebar/src/charts/charts-store.atom.ts
    hash: 513e522a705905fef04828dac4f0cd86b294ed9c1e2bf35d5e07d50a0b1cabdd
sources_digest: 2c5f2cca3771b42d8bde38eb8d6b2843c7659a134bb0e15d392f6e7e30e48440
links:
  - to: timebar-chart-types
    relation: depends_on
    description: References ChartType and TimebarChartData types for state shape
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

Manages timebar chart visualization state via Jotai atoms: chartsStore maps chart type IDs to state (data, active, layers, loading); activeChartsDataState and activeChartLayersState provide reactive selectors with custom equality; hoveredEventState tracks interactive hover. useUpdateChartsData and useUpdateChartLayers manage component-level registration and lifecycle.

## Related

- depends on [[timebar-chart-types]] — References ChartType and TimebarChartData types for state shape

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
