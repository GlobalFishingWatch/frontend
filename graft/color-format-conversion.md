---
name: Color Format Conversion
slug: color-format-conversion
type: system
sources:
  - path: libs/deck-layers/src/utils/colors.ts
    hash: 8b62fb2743876d1e61ab1d8b7b31e469e0760c41a29cd1f9f346fe4c8bbe6ae5
sources_digest: 8ce90e8fc491b294656af38f952b7095ab8779e4353b1fa742a741441764ac05
links:
  - to: color-ramps-configuration
    relation: depends_on
    description: Reads COLOR_TRANSPARENT default value from colors.config
generator:
  version: 1
covers:
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

Low-level color space conversion utilities supporting transformations between hex, RGB, RGBA, and deck.gl native color formats. Provides bidirectional converters (hexToRgb, deckToHexColor) and format-specific adapters (deckToRgbaColor, deckToVecColor) with sensible defaults for malformed inputs. Handles both 8-bit (0–255) and normalized (0–1) color spaces for GLSL shader consumption.

## Related

- depends on [[color-ramps-configuration]] — Reads COLOR_TRANSPARENT default value from colors.config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
