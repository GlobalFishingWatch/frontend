---
name: Chart Rendering Constraints
slug: chart-rendering-constraints
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartAggregated.tsx
    hash: 39ea3eb5a39b289cb47c713759e87f15a5d31b60caff1cb1b6f200cbd35b8621
  - path: libs/responsive-visualizations/src/charts/barchart/BarChartIndividual.tsx
    hash: f23faa88db7ab4af62c27c83926396eddb71d384095d61c47ed7e4f171e14c10
  - path: libs/responsive-visualizations/src/charts/config.ts
    hash: ca74280f91a8d980437bb2ea27de3cb32a46859e09ac0bd02beda4fd7b740f64
sources_digest: 2dabf15914393b435c7f7fe72f4b26c4fd49f7a54dbd39075d04950245797c76
links: []
generator:
  version: 1
covers:
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

Design constraints prevent performance degradation and readability issues: MAX_INDIVIDUAL_ITEMS hard limit on individual point cardinality; POINT_SIZES array ordered largest-to-smallest for responsive scaling; POINT_GAP controls minimum spacing between individual points; AXIS_LABEL_PADDING and TIMESERIES_PADDING define fixed margins. BarChartIndividual uses foreignObject to embed custom DOM instead of Recharts natives, giving fine-grained layout control. AggregatedBarChart computes stack totals via getResponsiveVisualizationItemValue and renders labels only at stack tops to avoid clutter.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
