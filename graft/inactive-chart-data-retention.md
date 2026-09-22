---
name: Inactive Chart Data Retention
slug: inactive-chart-data-retention
type: concept
sources:
  - path: libs/timebar/src/charts/charts-store.atom.spec.tsx
    hash: 095725de9b74b22bc11ec8ac48233cc2c98f50b72dd7d62403ee5b998ad045f9
  - path: libs/timebar/src/charts/charts-store.atom.ts
    hash: 513e522a705905fef04828dac4f0cd86b294ed9c1e2bf35d5e07d50a0b1cabdd
sources_digest: cba45063a9f5c5f4fae29dae1d2edfe5f9b588801bb8b47c1a13e1e51b0b0c85
links:
  - to: timebar-chart-state-management
    relation: implements
    description: useUpdateChartsData implements unmount marking logic
generator:
  version: 1
covers:
  - symbol: wrapper
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.spec.tsx:L15-L17'
  - symbol: wrapper
    kind: function
    at: 'libs/timebar/src/charts/charts-store.atom.spec.tsx:L38-L40'
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

When a chart component unmounts, useUpdateChartsData marks its data as inactive (active: false) but preserves the data itself in the store. This pattern enables chart history or previous states to persist across component lifecycles, useful for undo/redo, performance optimization, or restoring state when components remount.

## Related

- implements [[timebar-chart-state-management]] — useUpdateChartsData implements unmount marking logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
