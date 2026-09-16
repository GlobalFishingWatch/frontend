---
name: Color Ramps Configuration
slug: color-ramps-configuration
type: concept
sources:
  - path: libs/deck-layers/src/utils/colorRamps.spec.ts
    hash: a7000b718c7506f11d26044d0e7a1042a986f80db7584843354f4011fcfe311d
  - path: libs/deck-layers/src/utils/colorRamps.ts
    hash: 267326e3cb5f51c539c57cbdf2e616f44dd791b84dfd0b82647a00efeca68615
  - path: libs/deck-layers/src/utils/colors.ts
    hash: 8b62fb2743876d1e61ab1d8b7b31e469e0760c41a29cd1f9f346fe4c8bbe6ae5
sources_digest: cd7af21730a91bc27efaf7975c6946370118782e557c5ef12120731c44345193
links: []
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
  - symbol: hexToRgb
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L6-L17'
  - symbol: rgbaStringToObject
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L20-L35'
  - symbol: hexToDeckColor
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L37-L48'
  - symbol: rgbaToDeckColor
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L50-L53'
  - symbol: componentToHex
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L55-L58'
  - symbol: deckToHexColor
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L60-L62'
  - symbol: deckToRgbaColor
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L64-L66'
  - symbol: colorToVec
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L68-L70'
  - symbol: deckToVecColor
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L71-L73'
  - symbol: rgbaStringToComponents
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L75-L86'
  - symbol: rgbaToString
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L88-L90'
  - symbol: rgbToRgbString
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L92-L94'
  - symbol: hexToRgbString
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L96-L99'
  - symbol: hexToRgbaString
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L101-L104'
  - symbol: hexToComponents
    kind: function
    at: 'libs/deck-layers/src/utils/colors.ts:L106-L109'
---

<!-- context:generated:start -->

## Summary

Centralized configuration defining available color ramps (spectral, single-hue, multi-hue, bathymetry), numeric constants (MIN_OPACITY, default steps), and type guards (isMultiHueColorRampId). Establishes the contract for ramp identifiers and ensures that all ramp generation functions derive from a single source of truth.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
