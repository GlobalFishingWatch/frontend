---
name: Slider utilities
slug: slider-utilities
type: file
sources:
  - path: libs/ui-components/src/slider/slider.utils.ts
    hash: e932ecf1ebaed1bd8f628e5d083ba9bb6673117db2a7580228da621e4cba999e
sources_digest: a15565dc326eaa376f6602f3a02d4aad994bc2f3204f348f8f1c66cfeb22f612
links: []
generator:
  version: 1
covers:
  - symbol: formatSliderNumber
    kind: function
    at: 'libs/ui-components/src/slider/slider.utils.ts:L3-L8'
  - symbol: SliderTrackBackground
    kind: type
    at: 'libs/ui-components/src/slider/slider.utils.ts:L10-L15'
  - symbol: getSliderTrackBackground
    kind: function
    at: 'libs/ui-components/src/slider/slider.utils.ts:L19-L34'
---

<!-- context:generated:start -->

## Summary

Provides number formatting and CSS gradient generation for multi-segment slider tracks. `formatSliderNumber` applies magnitude-based precision rules (scientific notation ≥1000, no decimals for integers or >9, else one decimal), and `getSliderTrackBackground` generates linear-gradient strings with n+1 color stops for n slider values—a precondition enforced by contract rather than validation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
