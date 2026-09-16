---
name: Color Accessibility
slug: color-accessibility
type: file
sources:
  - path: libs/responsive-visualizations/src/charts/utils.ts
    hash: c8690402011707c52270dc7389ab4935be6a22a8d5f703c89a9bb7362b6e63b7
sources_digest: d8e46eba5e432e9b854ff8c64120ad90970f61d2a31dd8bfb0a4b9c86b2b29f5
links: []
generator:
  version: 1
covers:
  - symbol: relativeLuminance
    kind: function
    at: 'libs/responsive-visualizations/src/charts/utils.ts:L3-L10'
  - symbol: contrastWCAG
    kind: function
    at: 'libs/responsive-visualizations/src/charts/utils.ts:L12-L18'
  - symbol: ensureMinimumContrast
    kind: function
    at: 'libs/responsive-visualizations/src/charts/utils.ts:L20-L36'
  - symbol: getContrastSafeColor
    kind: function
    at: 'libs/responsive-visualizations/src/charts/utils.ts:L38-L76'
---

<!-- context:generated:start -->

## Summary

Ensures chart colors meet WCAG 2.0 contrast thresholds via getContrastSafeColor, which iteratively darkens colors in OKLch space until target contrast is met. relativeLuminance and contrastWCAG compute luminance and contrast ratios per WCAG spec; ensureMinimumContrast applies the adjustment logic.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
