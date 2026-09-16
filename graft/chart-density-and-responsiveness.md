---
name: Chart Density and Responsiveness
slug: chart-density-and-responsiveness
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/barchart/BarChart.tsx
    hash: 45993a8bb8c3f013b48ba2a514bad4f3da057fd3906a0015a325da3808f6740f
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx
    hash: 39ea3eb5a39b289cb47c713759e87f15a5d31b60caff1cb1b6f200cbd35b8621
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartIndividual.tsx
    hash: f23faa88db7ab4af62c27c83926396eddb71d384095d61c47ed7e4f171e14c10
sources_digest: c640d3d55ef3955e6425e74b151b1213d4cbe0f0970726ac43d441fab632c1a4
links: []
generator:
  version: 1
covers:
  - symbol: ResponsiveBarChartProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/barchart/BarChart.tsx:L16-L17'
  - symbol: ResponsiveBarChart
    kind: function
    at: 'libs/responsive-visualizations/src/charts/barchart/BarChart.tsx:L19-L89'
  - symbol: AggregatedBarChartProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx:L10-L10
  - symbol: AggregatedBarChart
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx:L12-L95
  - symbol: getStackTotal
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx:L23-L27
  - symbol: stackTopLabelAccessor
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx:L29-L34
  - symbol: IndividualBarChartProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartIndividual.tsx:L11-L14
  - symbol: IndividualBarChart
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/barchart/BarChartIndividual.tsx:L16-L85
---

<!-- context:generated:start -->

## Summary

Runtime decision to switch between chart representations based on screen density: AggregatedBarChart stacks multiple values at each X-axis position for compact high-level view; IndividualBarChart renders each data point as discrete element for detailed inspection. ResponsiveBarChart measures container via useResponsiveVisualization hook and calls getIsIndividualBarChartSupported to determine feasibility, ensuring charts remain readable at any viewport width.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
