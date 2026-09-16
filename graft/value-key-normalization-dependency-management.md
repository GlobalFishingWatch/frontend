---
name: Value Key Normalization & Dependency Management
slug: value-key-normalization-dependency-management
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/hooks.ts
    hash: 57175eb8eecbc4813585bcff2ed001bbe4bb0e0a6f8f9d99f6d064612252a19a
sources_digest: 8a0852d464d59a5dc92baa72d19870e2f74eaef600a6ca338681033dec6ce20a
links:
  - to: responsive-chart-hooks-orchestration
    relation: implements
    description: useValueKeys applies this pattern for value key normalization
generator:
  version: 1
covers:
  - symbol: useValueKeys
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L24-L37'
  - symbol: ResponsiveVisualizationContainerRef
    kind: type
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L39-L39'
  - symbol: useResponsiveDimensions
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L40-L59'
  - symbol: UseResponsiveVisualizationDataProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L61-L72'
  - symbol: useResponsiveVisualizationData
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L74-L183'
  - symbol: useResponsiveVisualization
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L185-L203'
---

<!-- context:generated:start -->

## Summary

useValueKeys uses hash-string representation of arrays instead of direct array references in dependency lists as a pragmatic workaround to react-hooks exhaustive-deps linting. This pattern avoids unnecessary array recreations while satisfying exhaustive dependency checking, enabling downstream hooks to safely key memoization on normalized value keys.

## Related

- implements [[responsive-chart-hooks-orchestration]] — useValueKeys applies this pattern for value key normalization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
