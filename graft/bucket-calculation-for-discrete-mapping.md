---
name: Bucket Calculation for Discrete Mapping
slug: bucket-calculation-for-discrete-mapping
type: concept
sources:
  - path: libs/ui-components/src/map-legend/Bivariate.tsx
    hash: 7dfb8ed7e44967be6d27401a88deea07b5fcaeb733aa0c2166f2d19511e5b834
  - path: libs/ui-components/src/map-legend/ColorRamp.tsx
    hash: 29519aab843cb36ab517dbdfed7bd828cdedfe66a11b205b00591d3b2eead5ff
sources_digest: e8e982f41b7c91ab199ff1ccef0eee123d1dd8c9b46d034c6e53f619a7b36672
links:
  - to: map-legend-system
    relation: implements
    description: >-
      ColorRamp and BivariateLegend use bucket indexing to map continuous values
      to discrete legend cells
generator:
  version: 1
covers:
  - symbol: BivariateLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L11-L16'
  - symbol: getBucketIndex
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L36-L50'
  - symbol: getBivariateValue
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L52-L80'
  - symbol: BivariateRect
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L85-L104'
  - symbol: BivariateLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L121-L203'
  - symbol: PercentScale
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L18-L18'
  - symbol: toPercent
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L20-L23'
  - symbol: ColorRampLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L25-L32'
  - symbol: ColorRampLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L34-L264'
  - symbol: getValueLabel
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L168-L178'
---

<!-- context:generated:start -->

## Summary

Shared discretization pattern used by ColorRamp and BivariateLegend to convert continuous numeric values into discrete legend cell indices. ColorRamp's getBucketIndex classifies a value into bucket ranges based on break points, while BivariateLegend's getBivariateValue converts a pair of values into a single grid cell index using row-major layout. Both implementations use 0 as a sentinel value for omitted features (e.g., water bodies on land maps) and 1-based indexing for actual data buckets. A noted TODO flags that this logic was copied from an MGL (Mapbox GL) fork and should be centralized to reduce duplication; the 4-column grid layout is hard-coded in BivariateLegend.

## Related

- implements [[map-legend-system]] — ColorRamp and BivariateLegend use bucket indexing to map continuous values to discrete legend cells

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
