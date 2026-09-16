---
name: Number Formatting & Rounding Convention
slug: number-formatting-rounding-convention
type: concept
sources:
  - path: libs/ui-components/src/map-legend/map-legend.utils.ts
    hash: 9ac08d1d0363480f8a31e290830775d09d7dec5b9e64f086e207f18a975ea73d
sources_digest: b698723847382064b9fb15c63952b6f31502ef57512b57aac1d7510ae3fa5155
links:
  - to: map-legend-system
    relation: implements
    description: >-
      formatLegendValue and related utilities format numeric values for display
      in all legend types
generator:
  version: 1
covers:
  - symbol: parseLegendNumber
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L6-L11'
  - symbol: roundLegendDecimals
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L13-L18'
  - symbol: roundLegendNumber
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L20-L22'
  - symbol: FormatLegendValueParams
    kind: type
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L24-L31'
  - symbol: formatLegendValue
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L32-L63'
---

<!-- context:generated:start -->

## Summary

map-legend.utils implements specialized numeric formatting rules for cartographic legends that handle abbreviation (B for billions, M for millions, K for thousands), decimal precision control, scientific notation prevention, and divergent scale polarity indicators (≤, ≥, +). Key functions include parseLegendNumber (converts to fixed-point to avoid scientific notation), roundLegendNumber (applies floor for large values, fixed-point for small), and formatLegendValue (the primary export that combines abbreviation, truncation, and inequality symbols). A design constraint is the MIN_DECIMALS_SCIENTIFIC_NOTATION threshold of 7 digits—beyond this, JavaScript auto-converts to scientific notation, which must be prevented for legend readability. The divergent parameter enables rendering with explicit polarity for bipolar scales, while isFirst and isLast flags allow customization of boundary symbols.

## Related

- implements [[map-legend-system]] — formatLegendValue and related utilities format numeric values for display in all legend types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
