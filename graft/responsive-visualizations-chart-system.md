---
name: Responsive Visualizations Chart System
slug: responsive-visualizations-chart-system
type: system
sources:
  - path: libs/responsive-visualizations/eslint.config.js
    hash: f4b8d65ebbc93fe43ef6ba67d31c4a5a7e461dadba54eadb8263a58bea75dc53
  - path: libs/responsive-visualizations/src/charts/barchart/BarChart.tsx
    hash: 45993a8bb8c3f013b48ba2a514bad4f3da057fd3906a0015a325da3808f6740f
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx
    hash: 39ea3eb5a39b289cb47c713759e87f15a5d31b60caff1cb1b6f200cbd35b8621
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartIndividual.tsx
    hash: f23faa88db7ab4af62c27c83926396eddb71d384095d61c47ed7e4f171e14c10
  - path: libs/responsive-visualizations/src/charts/config.ts
    hash: ca74280f91a8d980437bb2ea27de3cb32a46859e09ac0bd02beda4fd7b740f64
sources_digest: 0a1ea83519e9510df99f8bf9ccddc4a9f6e658fec10dd57eaa054a4a498099c7
links:
  - to: chart-density-and-responsiveness
    relation: implements
    description: >-
      ResponsiveBarChart checks screen density via
      getIsIndividualBarChartSupported to choose between aggregated and
      individual rendering modes
  - to: chart-rendering-constraints
    relation: depends_on
    description: >-
      Chart components enforce MAX_INDIVIDUAL_ITEMS limit and use config
      constants for spacing (POINT_GAP), sizing (POINT_SIZES), and margins
      (AXIS_LABEL_PADDING)
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

Responsive React charting library that adapts chart type (aggregated vs individual) and point density based on available screen space and data volume. Uses Recharts for rendering, includes helper hooks for data fetching and container measurement, and supports customizable colors, tooltips, formatting, and click handlers across bar and time-series visualizations.

## Related

- implements [[chart-density-and-responsiveness]] — ResponsiveBarChart checks screen density via getIsIndividualBarChartSupported to choose between aggregated and individual rendering modes
- depends on [[chart-rendering-constraints]] — Chart components enforce MAX_INDIVIDUAL_ITEMS limit and use config constants for spacing (POINT_GAP), sizing (POINT_SIZES), and margins (AXIS_LABEL_PADDING)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
