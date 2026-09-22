---
name: Color Ramps & Palettes
slug: color-ramps-palettes
type: system
sources:
  - path: libs/deck-layers/src/utils/colorRamps.spec.ts
    hash: a7000b718c7506f11d26044d0e7a1042a986f80db7584843354f4011fcfe311d
  - path: libs/deck-layers/src/utils/colorRamps.ts
    hash: 267326e3cb5f51c539c57cbdf2e616f44dd791b84dfd0b82647a00efeca68615
sources_digest: 32e61e04bde639a0fb1167f52c4e2a4a608d735e59ea6da3c1909fb662737a3e
links:
  - to: color-format-conversion
    relation: uses
    description: >-
      Calls hexToRgb and rgbaStringToObject to convert between color formats
      during ramp generation
  - to: color-ramps-configuration
    relation: depends_on
    description: >-
      Reads ramp definitions, MIN_OPACITY constant, and multiHue detection from
      colorRamps.config
generator:
  version: 1
covers:
  - symbol: isMultiHueColorRampId
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L24-L25'
  - symbol: getColorRampByOpacitySteps
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L29-L37'
  - symbol: getColorRampToWhite
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L39-L57'
  - symbol: getMixedOpacityToWhiteColorRamp
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L59-L68'
  - symbol: resolveColorRampId
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L70-L71'
  - symbol: getBivariateRamp
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L73-L80'
  - symbol: getBlend
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L82-L84'
  - symbol: getBivariateRampLegend
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L86-L113'
  - symbol: GetColorRampReturn
    kind: type
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L115-L119'
  - symbol: getColorRamp
    kind: function
    at: 'libs/deck-layers/src/utils/colorRamps.ts:L121-L140'
---

<!-- context:generated:start -->

## Summary

Comprehensive color ramp generation and formatting system for visualization, including single-hue opacity-based ramps, multi-hue spectral ramps, and bivariate color matrices. Exports a generic getColorRamp dispatcher that normalizes output across multiple color formats (RGBA object, string, numeric array) and handles special cases like reversed spectral ramps and bathymetry ramps with fixed bivariate legend structure.

## Related

- uses [[color-format-conversion]] — Calls hexToRgb and rgbaStringToObject to convert between color formats during ramp generation
- depends on [[color-ramps-configuration]] — Reads ramp definitions, MIN_OPACITY constant, and multiHue detection from colorRamps.config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
